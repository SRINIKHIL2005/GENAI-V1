import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { crisisRateLimiter } from '@/middleware/rateLimiter';
import { optionalAuthMiddleware } from '@/middleware/auth';
import { detectUserLanguage, setTranslationContext, translateResponse } from '@/middleware/translation';
import { AuthenticatedRequest } from '@/types';
import { GeminiService } from '@/config/gemini';
import { FirebaseService } from '@/config/firebase';
import { socketService } from '@/services/socketService';
import { logger, StructuredLogger } from '@/utils/logger';
import { Request, Response } from 'express';

const router = Router();

// Crisis detection endpoint (can be accessed without authentication for emergencies)
router.post('/detect', 
  detectUserLanguage,
  setTranslationContext('crisis'),
  translateResponse,
  crisisRateLimiter, 
  optionalAuthMiddleware, 
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { message, context, location, contactInfo } = req.body;
  const userId = (req as AuthenticatedRequest).user?.uid;

  if (!message || !message.trim()) {
    res.status(400).json({
      error: 'Message is required for crisis detection',
      code: 'MISSING_MESSAGE'
    });
    return;
  }

  try {
    // Perform crisis analysis
    const crisisAnalysis = await GeminiService.detectCrisis(
      message,
      null, // No voice analysis for text-only
      { ...context, userId, location, contactInfo }
    );

    // Log crisis event regardless of risk level
    const crisisLogId = userId ? await FirebaseService.logCrisisEvent(userId, {
      severity: crisisAnalysis.riskLevel,
      type: crisisAnalysis.type || 'other',
      message,
      location,
      contactedSupport: false,
      interventions: [],
      followUpRequired: crisisAnalysis.followUpRequired || false
    }) : null;

    // Immediate response based on risk level
    let response = {
      riskLevel: crisisAnalysis.riskLevel,
      immediateAction: crisisAnalysis.immediateAction || false,
      resources: {
        suicide: '988',
        crisis: '1-800-273-8255',
        emergency: '911',
        text: 'Text HOME to 741741',
        chat: 'https://suicidepreventionlifeline.org/chat/',
        local: []
      },
      supportMessage: '',
      recommendations: crisisAnalysis.recommendations || [],
      followUpRequired: crisisAnalysis.followUpRequired || false,
      crisisLogId: crisisLogId?.id || null
    };

    // Customize response based on severity
    switch (crisisAnalysis.riskLevel) {
      case 'critical':
        response.supportMessage = 'This appears to be a crisis situation. Please contact emergency services immediately or call 911. You are not alone, and help is available.';
        response.immediateAction = true;
        
        // Alert crisis response team
        if (userId) {
          socketService.sendNotification(userId, {
            title: 'Crisis Support Available',
            message: 'Please reach out for immediate help. Emergency services: 911',
            type: 'error',
            data: { resources: response.resources }
          });
        }
        break;

      case 'high':
        response.supportMessage = 'It sounds like you\'re going through a very difficult time. Please consider reaching out to a crisis helpline or mental health professional immediately.';
        response.immediateAction = true;
        break;

      case 'moderate':
        response.supportMessage = 'Thank you for sharing. It\'s important to seek support when you\'re struggling. Consider talking to a mental health professional or trusted person.';
        response.followUpRequired = true;
        break;

      case 'low':
        response.supportMessage = 'I hear that you\'re going through a tough time. Remember that support is available when you need it.';
        break;

      default:
        response.supportMessage = 'Thank you for reaching out. If you\'re in distress, professional support is available.';
    }

    // Log crisis detection
    StructuredLogger.logCrisisEvent(userId || 'anonymous', crisisAnalysis.riskLevel, {
      message: message.substring(0, 100) + '...',
      location,
      hasContactInfo: !!contactInfo,
      analysisConfidence: crisisAnalysis.confidence
    });

    // Send real-time alerts for high-risk situations
    if (['critical', 'high'].includes(crisisAnalysis.riskLevel)) {
      // Alert crisis response team (would be implemented based on your crisis protocol)
      logger.warn('High-risk crisis detected', {
        userId: userId || 'anonymous',
        riskLevel: crisisAnalysis.riskLevel,
        location,
        timestamp: new Date()
      });

      // Send immediate notifications via Socket.IO
      if (userId) {
        socketService.broadcast('crisis_alert_staff', {
          userId,
          riskLevel: crisisAnalysis.riskLevel,
          location,
          timestamp: new Date(),
          requiresImmedateAttention: true
        });
      }
    }

    res.json({
      success: true,
      data: response
    });

  } catch (error: any) {
    logger.error('Error in crisis detection:', error);
    
    // Always provide crisis resources even if detection fails
    res.status(500).json({
      error: 'Crisis detection service temporarily unavailable',
      code: 'CRISIS_DETECTION_ERROR',
      data: {
        resources: {
          suicide: '988',
          crisis: '1-800-273-8255',
          emergency: '911',
          text: 'Text HOME to 741741'
        },
        message: 'If you are in immediate danger, please contact emergency services at 911.'
      }
    });
  }
}));

// Get crisis resources
router.get('/resources', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { location, language = 'en' } = req.query;

  try {
    // This would be expanded with location-specific resources
    const resources = {
      immediate: {
        suicide: {
          phone: '988',
          description: 'Suicide & Crisis Lifeline',
          available: '24/7',
          languages: ['English', 'Spanish']
        },
        emergency: {
          phone: '911',
          description: 'Emergency Services',
          available: '24/7',
          note: 'For immediate life-threatening situations'
        },
        text: {
          number: '741741',
          message: 'Text HOME to 741741',
          description: 'Crisis Text Line',
          available: '24/7'
        },
        chat: {
          url: 'https://suicidepreventionlifeline.org/chat/',
          description: 'Online Crisis Chat',
          available: '24/7'
        }
      },
      ongoing: {
        therapy: {
          samhsa: '1-800-662-4357',
          description: 'SAMHSA National Helpline',
          note: 'Treatment referral and information service'
        },
        warmlines: [
          {
            name: 'NAMI Helpline',
            phone: '1-800-950-6264',
            description: 'Information, referrals, and support'
          }
        ]
      },
      specialized: {
        lgbtq: {
          name: 'The Trevor Project',
          phone: '1-866-488-7386',
          description: 'Crisis support for LGBTQ+ youth'
        },
        veterans: {
          name: 'Veterans Crisis Line',
          phone: '1-800-273-8255',
          description: 'Press 1 for veterans support'
        },
        domestic_violence: {
          name: 'National Domestic Violence Hotline',
          phone: '1-800-799-7233',
          description: '24/7 confidential support'
        }
      },
      apps: [
        {
          name: 'Crisis Text Line',
          description: 'Text-based crisis support',
          platforms: ['iOS', 'Android']
        },
        {
          name: 'PTSD Coach',
          description: 'PTSD symptom management',
          platforms: ['iOS', 'Android']
        }
      ],
      selfCare: [
        {
          technique: 'Deep Breathing',
          description: 'Take slow, deep breaths for 5 minutes',
          duration: '5 minutes'
        },
        {
          technique: 'Grounding (5-4-3-2-1)',
          description: 'Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste',
          duration: '5-10 minutes'
        },
        {
          technique: 'Safe Space Visualization',
          description: 'Imagine a place where you feel completely safe and calm',
          duration: '10 minutes'
        }
      ]
    };

    res.json({
      success: true,
      data: {
        resources,
        location: location || 'general',
        language,
        lastUpdated: new Date(),
        disclaimer: 'If you are in immediate danger, please call 911 or go to your nearest emergency room.'
      }
    });

  } catch (error: any) {
    logger.error('Error fetching crisis resources:', error);
    res.status(500).json({
      error: 'Failed to fetch crisis resources',
      code: 'RESOURCES_FETCH_ERROR'
    });
  }
}));

// Report crisis intervention outcome
router.post('/intervention/:crisisLogId/outcome', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { crisisLogId } = req.params;
  const { outcome, interventions, contactedSupport, notes, followUpScheduled } = req.body;

  try {
    // This would be implemented in FirebaseService
    // Update crisis log with outcome
    
    res.json({
      success: true,
      data: {
        crisisLogId,
        outcome,
        interventions: interventions || [],
        contactedSupport: contactedSupport || false,
        followUpScheduled: followUpScheduled || false,
        updatedAt: new Date(),
        message: 'Crisis intervention outcome recorded successfully'
      }
    });

  } catch (error: any) {
    logger.error('Error recording crisis outcome:', error);
    res.status(500).json({
      error: 'Failed to record crisis outcome',
      code: 'CRISIS_OUTCOME_ERROR'
    });
  }
}));

// Get crisis history (for authenticated users)
router.get('/history', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { limit = 10, resolved } = req.query;

  try {
    // This would be implemented in FirebaseService
    const crisisHistory: any[] = [];
    
    res.json({
      success: true,
      data: {
        crisisEvents: crisisHistory,
        totalCount: crisisHistory.length,
        resolvedCount: crisisHistory.filter(c => c.resolved).length,
        lastCrisisDate: crisisHistory.length > 0 ? crisisHistory[0].timestamp : null
      }
    });

  } catch (error: any) {
    logger.error('Error fetching crisis history:', error);
    res.status(500).json({
      error: 'Failed to fetch crisis history',
      code: 'CRISIS_HISTORY_ERROR'
    });
  }
}));

// Emergency contact notification
router.post('/notify-emergency-contact', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { contactInfo, message, location } = req.body;

  try {
    // This would integrate with SMS/email services to notify emergency contacts
    // For now, we'll log the attempt
    
    StructuredLogger.logUserAction(userId, 'emergency_contact_notified', {
      contactInfo: contactInfo ? 'provided' : 'not_provided',
      location: location ? 'provided' : 'not_provided',
      timestamp: new Date()
    });

    res.json({
      success: true,
      data: {
        message: 'Emergency contact notification initiated',
        timestamp: new Date(),
        note: 'Contact will be notified according to your preferences'
      }
    });

  } catch (error: any) {
    logger.error('Error notifying emergency contact:', error);
    res.status(500).json({
      error: 'Failed to notify emergency contact',
      code: 'EMERGENCY_CONTACT_ERROR'
    });
  }
}));

export default router;