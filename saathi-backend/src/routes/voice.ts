import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { voiceRateLimiter, uploadRateLimiter } from '@/middleware/rateLimiter';
import { AuthenticatedRequest } from '@/types';
// Note: Google Cloud Speech services removed - using alternative implementation
import { GeminiService } from '@/config/gemini';
import { FirebaseService } from '@/config/firebase';
import { socketService } from '@/services/socketService';
import { logger, StructuredLogger } from '@/utils/logger';
import { Response } from 'express';
import multer from 'multer';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
});

// Process voice message
router.post('/process', voiceRateLimiter, upload.single('audio'), asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { sessionId, language = 'en-US', enableEmotionAnalysis = true } = req.body;

  if (!req.file) {
    res.status(400).json({
      error: 'Audio file is required',
      code: 'MISSING_AUDIO_FILE'
    });
    return;
  }

  try {
    // Create voice session
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const sessionRef = await FirebaseService.createVoiceSession(userId, {
        type: 'voice_message',
        language,
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      });
      currentSessionId = sessionRef.id;
    }

    // Send processing notification
    socketService.sendToVoiceSession(currentSessionId, 'processing_started', {
      sessionId: currentSessionId,
      message: 'Processing your voice message...'
    });

    // Mock transcription - would integrate with Speech-to-Text service later
    const transcriptionResult = {
      transcript: 'Mock transcription - Speech-to-Text service would be integrated here',
      confidence: 0.85,
      words: [],
      emotions: { neutral: 0.7, happy: 0.2, sad: 0.1 }
    };

    if (!transcriptionResult.transcript) {
      res.status(400).json({
        error: 'Unable to transcribe audio',
        code: 'TRANSCRIPTION_FAILED',
        details: 'Audio quality may be too low or contain no speech'
      });
      return;
    }

    // Analyze mood and emotions from transcription
    let moodAnalysis = null;
    if (enableEmotionAnalysis) {
      try {
        const moodHistory = await FirebaseService.getUserMoodHistory(userId, 5);
        moodAnalysis = await GeminiService.analyzeMoodFromText(
          transcriptionResult.transcript,
          moodHistory
        );
      } catch (error) {
        logger.warn('Mood analysis failed for voice message:', error);
      }
    }

    // Detect crisis indicators
    const crisisAnalysis = await GeminiService.detectCrisis(
      transcriptionResult.transcript,
      transcriptionResult.emotions,
      { source: 'voice', userId }
    );

    // Generate AI response
    const userDoc = await FirebaseService.getUser(userId);
    const userContext = {
      profile: (userDoc as any)?.profile || {},
      voiceContext: {
        emotions: transcriptionResult.emotions,
        confidence: transcriptionResult.confidence
      }
    };

    const aiResponse = await GeminiService.createWellnessResponse(
      [{ role: 'user', content: transcriptionResult.transcript }],
      userContext
    );

    // Generate speech for AI response - mock implementation
    let audioResponse = null;
    try {
      // Mock TTS - would integrate with Text-to-Speech service later
      const speechResult = {
        audioContent: Buffer.from('mock audio content'),
        voiceInfo: { language: 'en-US', voice: 'standard' }
      };
      audioResponse = {
        audioContent: speechResult.audioContent?.toString(),
        voiceConfig: speechResult.voiceInfo
      };
    } catch (error) {
      logger.warn('Text-to-speech generation failed:', error);
    }

    // Update voice session with results
    // This would need to be implemented in FirebaseService

    // Log voice processing
    StructuredLogger.logVoiceProcessing(userId, currentSessionId, {
      duration: transcriptionResult.words.length * 0.6, // Rough estimate
      confidence: transcriptionResult.confidence,
      emotions: transcriptionResult.emotions,
      transcriptLength: transcriptionResult.transcript.length
    });

    // Send real-time updates
    socketService.sendToVoiceSession(currentSessionId, 'processing_complete', {
      sessionId: currentSessionId,
      transcript: transcriptionResult.transcript,
      analysis: moodAnalysis,
      response: aiResponse.content
    });

    // Handle crisis detection
    if (crisisAnalysis.riskLevel === 'high' || crisisAnalysis.riskLevel === 'critical') {
      StructuredLogger.logCrisisEvent(userId, crisisAnalysis.riskLevel, {
        source: 'voice',
        transcript: transcriptionResult.transcript,
        sessionId: currentSessionId
      });

      socketService.sendNotification(userId, {
        title: 'Support Available',
        message: 'We detected you might need support. Professional help is available.',
        type: 'warning',
        data: {
          resources: crisisAnalysis.resources
        }
      });
    }

    res.json({
      success: true,
      data: {
        sessionId: currentSessionId,
        transcript: transcriptionResult.transcript,
        confidence: transcriptionResult.confidence,
        emotions: transcriptionResult.emotions,
        moodAnalysis,
        aiResponse: aiResponse.content,
        audioResponse,
        crisisAnalysis: {
          riskLevel: crisisAnalysis.riskLevel,
          hasResources: !!crisisAnalysis.resources
        },
        processingTime: Date.now(),
        wordCount: transcriptionResult.words?.length || 0
      }
    });

  } catch (error: any) {
    logger.error('Error processing voice message:', error);
    
    // Send error notification via Socket.IO
    if (sessionId) {
      socketService.sendToVoiceSession(sessionId, 'processing_error', {
        sessionId,
        error: 'Failed to process voice message'
      });
    }

    res.status(500).json({
      error: 'Failed to process voice message',
      code: 'VOICE_PROCESSING_ERROR',
      message: 'We encountered an issue processing your voice message. Please try again.'
    });
  }
}));

// Start streaming voice session
router.post('/stream/start', voiceRateLimiter, asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { language = 'en-US', enableRealTimeFeedback = true } = req.body;

  try {
    // Create streaming voice session
    const sessionRef = await FirebaseService.createVoiceSession(userId, {
      type: 'voice_stream',
      language,
      streamingMode: true,
      status: 'active'
    });

    // Set up streaming transcription
    const streamConfig = {
      language,
      enableRealTimeFeedback,
      sessionId: sessionRef.id
    };

    // Join socket room for real-time updates
    socketService.sendToUser(userId, 'voice_stream_ready', {
      sessionId: sessionRef.id,
      config: streamConfig,
      instructions: 'You can now start speaking. Real-time transcription is active.'
    });

    res.json({
      success: true,
      data: {
        sessionId: sessionRef.id,
        streamConfig,
        status: 'ready',
        message: 'Voice streaming session started'
      }
    });

  } catch (error: any) {
    logger.error('Error starting voice stream:', error);
    res.status(500).json({
      error: 'Failed to start voice stream',
      code: 'VOICE_STREAM_START_ERROR'
    });
  }
}));

// End streaming voice session
router.post('/stream/:sessionId/end', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { sessionId } = req.params;

  try {
    // End streaming session and generate summary
    // This would need to be implemented in FirebaseService

    if (sessionId) {
      socketService.sendToVoiceSession(sessionId, 'stream_ended', {
        sessionId,
        message: 'Voice streaming session ended',
        summary: 'Session summary would be generated here'
      });
    }

    res.json({
      success: true,
      data: {
        sessionId,
        status: 'ended',
        endTime: new Date()
      }
    });

  } catch (error: any) {
    logger.error('Error ending voice stream:', error);
    res.status(500).json({
      error: 'Failed to end voice stream',
      code: 'VOICE_STREAM_END_ERROR'
    });
  }
}));

// Get voice session history
router.get('/sessions', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { limit = 20, offset = 0 } = req.query;

  try {
    // This would need to be implemented in FirebaseService
    res.json({
      success: true,
      data: {
        sessions: [],
        total: 0,
        hasMore: false
      }
    });

  } catch (error: any) {
    logger.error('Error fetching voice sessions:', error);
    res.status(500).json({
      error: 'Failed to fetch voice sessions',
      code: 'VOICE_SESSIONS_FETCH_ERROR'
    });
  }
}));

// Get specific voice session details
router.get('/sessions/:sessionId', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { sessionId } = req.params;

  try {
    // This would need to be implemented in FirebaseService
    res.json({
      success: true,
      data: {
        sessionId,
        transcript: '',
        analysis: {},
        createdAt: new Date(),
        status: 'completed'
      }
    });

  } catch (error: any) {
    logger.error('Error fetching voice session:', error);
    res.status(500).json({
      error: 'Failed to fetch voice session',
      code: 'VOICE_SESSION_FETCH_ERROR'
    });
  }
}));

// Generate voice response for text
router.post('/synthesize', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { text, emotionalContext = 'neutral', language = 'en-US' } = req.body;

  if (!text || !text.trim()) {
    res.status(400).json({
      error: 'Text is required for speech synthesis',
      code: 'MISSING_TEXT'
    });
    return;
  }

  try {
    // Mock TTS implementation
    const speechResult = {
      audioContent: Buffer.from('mock audio content'),
      voiceInfo: { language: 'en-US', voice: 'standard' }
    };

    res.json({
      success: true,
      data: {
        audioContent: speechResult.audioContent?.toString(),
        voiceConfig: speechResult.voiceInfo,
        text,
        emotionalContext,
        audioFormat: 'MP3',
        generatedAt: new Date()
      }
    });

  } catch (error: any) {
    logger.error('Error synthesizing speech:', error);
    res.status(500).json({
      error: 'Failed to synthesize speech',
      code: 'SPEECH_SYNTHESIS_ERROR'
    });
  }
}));

export default router;