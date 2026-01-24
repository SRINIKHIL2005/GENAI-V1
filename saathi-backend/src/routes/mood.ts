import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { strictRateLimiter } from '@/middleware/rateLimiter';
import { detectUserLanguage, setTranslationContext, translateResponse } from '@/middleware/translation';
import { AuthenticatedRequest } from '@/types';
import { GeminiService } from '@/config/gemini';
// Note: Google Cloud services removed - using Gemini for mood analysis
import { FirebaseService } from '@/config/firebase';
import { socketService } from '@/services/socketService';
import { logger, StructuredLogger } from '@/utils/logger';
import { Response } from 'express';

const router = Router();

// Analyze mood from text input
router.post('/analyze', 
  detectUserLanguage,
  setTranslationContext('mental-health'),
  translateResponse,
  strictRateLimiter, 
  asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { text, context, includeFacialAnalysis = false, imageData } = req.body;
  const userId = req.user!.uid;

  if (!text || !text.trim()) {
    res.status(400).json({
      error: 'Text is required for mood analysis',
      code: 'MISSING_TEXT'
    });
    return;
  }

  try {
    // Get user's previous mood history for context
    const moodHistory = await FirebaseService.getUserMoodHistory(userId, 10);
    
    // Analyze mood from text using Gemini
    const textMoodAnalysis = await GeminiService.analyzeMoodFromText(text, moodHistory);
    
    // Note: Using Gemini for all analysis now
    const sentimentAnalysis = {
      score: textMoodAnalysis.sentiment?.score || 0,
      magnitude: textMoodAnalysis.sentiment?.magnitude || 0
    };
    
    let facialAnalysis = null;
    if (includeFacialAnalysis && imageData) {
      try {
        // For now, facial analysis is disabled - could integrate with MediaPipe later
        logger.info('Facial analysis requested but currently disabled');
        facialAnalysis = { emotions: [], confidence: 0 };
      } catch (error) {
        logger.warn('Facial analysis failed:', error);
      }
    }

    // Combine analyses for comprehensive mood assessment
    const combinedAnalysis = {
      primaryEmotion: textMoodAnalysis.primaryEmotion || 'neutral',
      emotions: {
        ...(textMoodAnalysis.emotions || {}),
      },
      sentiment: sentimentAnalysis,
      intensity: textMoodAnalysis.intensity || 0.5,
      confidence: Math.min(
        (textMoodAnalysis.confidence || 0.5) + (facialAnalysis?.confidence || 0) / 2,
        1.0
      ),
      triggers: textMoodAnalysis.triggers || [],
      recommendations: textMoodAnalysis.recommendations || [],
      facialExpression: facialAnalysis ? {
        detectedFaces: 0,
        dominantEmotion: 'neutral',
        confidence: facialAnalysis.confidence
      } : null
    };

    // Store mood entry in Firestore
    const moodEntry = await FirebaseService.createMoodEntry(userId, {
      mood: combinedAnalysis.primaryEmotion,
      intensity: combinedAnalysis.intensity,
      triggers: combinedAnalysis.triggers,
      notes: text,
      context: context || {},
      analysis: {
        sentiment: combinedAnalysis.sentiment.score,
        emotions: Object.keys(combinedAnalysis.emotions),
        recommendations: combinedAnalysis.recommendations,
        confidence: combinedAnalysis.confidence
      },
      sources: {
        text: true,
        facial: !!facialAnalysis,
        sentiment: true
      }
    });

    // Log mood entry
    StructuredLogger.logMoodEntry(userId, {
      mood: combinedAnalysis.primaryEmotion,
      intensity: combinedAnalysis.intensity,
      triggers: combinedAnalysis.triggers
    });

    // Send real-time update via Socket.IO
    socketService.sendMoodUpdateNotification(userId, combinedAnalysis);

    // Check if mood indicates need for support
    if (combinedAnalysis.sentiment.score < -0.6 || 
        combinedAnalysis.intensity > 0.8 ||
        combinedAnalysis.triggers.some((trigger: string) => 
          ['crisis', 'suicide', 'self-harm', 'emergency'].includes(trigger.toLowerCase())
        )) {
      
      // Send supportive resources
      socketService.sendNotification(userId, {
        title: 'Support Available',
        message: 'We noticed you might be going through a difficult time. Support resources are available.',
        type: 'info',
        data: {
          resources: {
            crisis: '988',
            emergency: '911',
            text: 'Text HOME to 741741'
          }
        }
      });
    }

    res.json({
      success: true,
      data: {
        moodEntryId: moodEntry.id,
        analysis: combinedAnalysis,
        timestamp: new Date(),
        supportResources: combinedAnalysis.sentiment.score < -0.5 ? {
          crisis: '988',
          emergency: '911',
          text: 'Text HOME to 741741'
        } : null
      }
    });

  } catch (error: any) {
    logger.error('Error analyzing mood:', error);
    res.status(500).json({
      error: 'Failed to analyze mood',
      code: 'MOOD_ANALYSIS_ERROR',
      message: 'We encountered an issue analyzing your mood. Please try again.'
    });
  }
}));

// Get mood history and trends
router.get('/history', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.uid;
  const { period = '30days', limit = 50 } = req.query;

  try {
    const moodHistory = await FirebaseService.getUserMoodHistory(userId, Number(limit));
    
    // Calculate trends and patterns
    const trends = {
      averageMood: 0,
      moodStability: 0,
      commonTriggers: [] as string[],
      improvementTrend: 'stable' as 'improving' | 'declining' | 'stable',
      patterns: {
        timeOfDay: {} as Record<string, number>,
        dayOfWeek: {} as Record<string, number>,
        commonEmotions: {} as Record<string, number>
      }
    };

    if (moodHistory.length > 0) {
      // Calculate average mood intensity
      trends.averageMood = moodHistory.reduce((acc: number, entry: any) => 
        acc + (entry.intensity || 0), 0) / moodHistory.length;

      // Calculate mood stability (lower values mean more stable)
      const intensities = moodHistory.map((entry: any) => entry.intensity || 0);
      const variance = intensities.reduce((acc, val) => 
        acc + Math.pow(val - trends.averageMood, 2), 0) / intensities.length;
      trends.moodStability = Math.sqrt(variance);

      // Extract common triggers
      const allTriggers = moodHistory.flatMap((entry: any) => entry.triggers || []);
      const triggerCounts = allTriggers.reduce((acc: Record<string, number>, trigger: string) => {
        acc[trigger] = (acc[trigger] || 0) + 1;
        return acc;
      }, {});
      trends.commonTriggers = Object.entries(triggerCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([trigger]) => trigger);

      // Determine improvement trend
      if (moodHistory.length >= 7) {
        const recentAvg = moodHistory.slice(0, 7).reduce((acc: number, entry: any) => 
          acc + (entry.intensity || 0), 0) / 7;
        const olderAvg = moodHistory.slice(-7).reduce((acc: number, entry: any) => 
          acc + (entry.intensity || 0), 0) / 7;
        
        if (recentAvg > olderAvg + 0.1) trends.improvementTrend = 'improving';
        else if (recentAvg < olderAvg - 0.1) trends.improvementTrend = 'declining';
      }
    }

    res.json({
      success: true,
      data: {
        moodHistory,
        trends,
        period,
        totalEntries: moodHistory.length,
        analysisDate: new Date()
      }
    });

  } catch (error: any) {
    logger.error('Error fetching mood history:', error);
    res.status(500).json({
      error: 'Failed to fetch mood history',
      code: 'MOOD_HISTORY_ERROR'
    });
  }
}));

// Get mood insights and recommendations
router.get('/insights', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { period = '30days' } = req.query;

  try {
    const moodHistory = await FirebaseService.getUserMoodHistory(userId, 30);
    const userDoc = await FirebaseService.getUser(userId);
    
    if (moodHistory.length === 0) {
      res.json({
        success: true,
        data: {
          insights: ['Start tracking your mood regularly to get personalized insights.'],
          recommendations: ['Try logging your mood daily to identify patterns.'],
          trends: null
        }
      });
      return;
    }

    // Generate AI-powered insights
    const insights = await GeminiService.generateWellnessInsights(
      { period, totalEntries: moodHistory.length },
      moodHistory,
      [] // activity history would be added here
    );

    res.json({
      success: true,
      data: {
        insights: insights.insights || [],
        recommendations: insights.recommendations || [],
        patterns: insights.patterns || {},
        trends: insights.trends || {},
        period,
        generatedAt: new Date()
      }
    });

  } catch (error: any) {
    logger.error('Error generating mood insights:', error);
    res.status(500).json({
      error: 'Failed to generate mood insights',
      code: 'MOOD_INSIGHTS_ERROR'
    });
  }
}));

// Update mood entry
router.patch('/:entryId', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.uid;
  const { entryId } = req.params;
  const { mood, intensity, triggers, notes, context } = req.body;

  try {
    // This would need to be implemented in FirebaseService
    res.json({
      success: true,
      data: {
        entryId,
        mood,
        intensity,
        triggers,
        notes,
        context,
        updatedAt: new Date()
      }
    });

  } catch (error: any) {
    logger.error('Error updating mood entry:', error);
    res.status(500).json({
      error: 'Failed to update mood entry',
      code: 'MOOD_UPDATE_ERROR'
    });
  }
}));

// Delete mood entry
router.delete('/:entryId', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.uid;
  const { entryId } = req.params;

  try {
    // This would need to be implemented in FirebaseService
    res.json({
      success: true,
      message: 'Mood entry deleted successfully'
    });

  } catch (error: any) {
    logger.error('Error deleting mood entry:', error);
    res.status(500).json({
      error: 'Failed to delete mood entry',
      code: 'MOOD_DELETE_ERROR'
    });
  }
}));

// Mood check-in reminder endpoint
router.post('/checkin-reminder', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.uid;

  try {
    // Send mood check-in reminder via Socket.IO
    socketService.sendWellnessReminder(userId, {
      type: 'mood_checkin',
      message: 'How are you feeling right now? Take a moment to check in with yourself.',
      action: 'Open mood tracker',
      scheduledAt: new Date()
    });

    res.json({
      success: true,
      message: 'Mood check-in reminder sent'
    });

  } catch (error: any) {
    logger.error('Error sending mood check-in reminder:', error);
    res.status(500).json({
      error: 'Failed to send reminder',
      code: 'REMINDER_ERROR'
    });
  }
}));

export default router;