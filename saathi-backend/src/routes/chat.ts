import { Router, Response } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { chatRateLimiter } from '@/middleware/rateLimiter';
import { detectUserLanguage, setTranslationContext, translateResponse } from '@/middleware/translation';
import { AuthenticatedRequest } from '@/types';
import { GeminiService } from '@/config/gemini';
import { FirebaseService } from '@/config/firebase';
import { socketService } from '@/services/socketService';
import { logger, StructuredLogger } from '@/utils/logger';

const router = Router();

// Enhanced chat message endpoint
router.post('/message', 
  detectUserLanguage,
  setTranslationContext('mental-health'),
  translateResponse,
  chatRateLimiter, 
  asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { message, sessionId, context } = req.body;
  const userId = req.user!.uid;

  if (!message || !message.trim()) {
    res.status(400).json({
      error: 'Message is required',
      code: 'MISSING_MESSAGE'
    });
    return;
  }

  try {
    // Create new session if not provided
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const sessionRef = await FirebaseService.createChatSession(userId, {
        title: message.substring(0, 50) + '...',
        type: 'wellness_chat',
        metadata: {
          platform: 'web',
          userAgent: req.get('User-Agent'),
          ip: req.ip
        }
      });
      currentSessionId = sessionRef.id;
    }

    // Get user context for personalized responses
    const userDoc = await FirebaseService.getUser(userId);
    const userContext = {
      profile: (userDoc as any)?.profile || {},
      mentalHealthProfile: (userDoc as any)?.mentalHealthProfile || {},
      preferences: (userDoc as any)?.preferences || {},
      recentMoods: await FirebaseService.getUserMoodHistory(userId, 5),
      context: context || {}
    };

    // Add user message to session
    await FirebaseService.addChatMessage(currentSessionId, {
      content: message,
      role: 'user',
      userId,
      metadata: {
        timestamp: new Date(),
        platform: 'web'
      }
    });

    // Get conversation history for context
    const conversationHistory = [
      { role: 'user', content: message }
    ];

    // Generate AI response using Gemini
    const aiResponse = await GeminiService.createWellnessResponse(
      conversationHistory,
      userContext
    );

    // Check for crisis indicators
    const crisisAnalysis = await GeminiService.detectCrisis(
      message,
      null,
      userContext
    );

    // Add AI response to session
    await FirebaseService.addChatMessage(currentSessionId, {
      content: aiResponse.content,
      role: 'assistant',
      userId,
      metadata: {
        timestamp: new Date(),
        model: aiResponse.model,
        usage: aiResponse.usage,
        crisisAnalysis: crisisAnalysis
      }
    });

    // Send response via Socket.IO if user is connected
    socketService.sendToChatSession(currentSessionId, 'new_message', {
      id: Date.now().toString(),
      content: aiResponse.content,
      role: 'assistant',
      timestamp: new Date(),
      sessionId: currentSessionId
    });

    // Handle crisis detection
    if (crisisAnalysis.riskLevel === 'high' || crisisAnalysis.riskLevel === 'critical') {
      StructuredLogger.logCrisisEvent(userId, crisisAnalysis.riskLevel, {
        message,
        analysis: crisisAnalysis,
        sessionId: currentSessionId
      });

      // Send crisis resources
      socketService.sendNotification(userId, {
        title: 'Support Resources Available',
        message: 'We\'re here to help. Please consider reaching out to professional support.',
        type: 'warning',
        data: {
          resources: crisisAnalysis.resources || {
            suicide: '988',
            crisis: '1-800-273-8255',
            emergency: '911'
          }
        }
      });
    }

    // Log chat interaction
    StructuredLogger.logChatInteraction(userId, currentSessionId, 'user', {
      messageLength: message.length,
      crisisRisk: crisisAnalysis.riskLevel
    });

    StructuredLogger.logChatInteraction(userId, currentSessionId, 'ai', {
      responseLength: aiResponse.content?.length || 0,
      model: aiResponse.model,
      usage: aiResponse.usage
    });

    res.json({
      success: true,
      data: {
        sessionId: currentSessionId,
        response: aiResponse.content,
        timestamp: new Date(),
        crisisAnalysis: {
          riskLevel: crisisAnalysis.riskLevel,
          hasResources: !!crisisAnalysis.resources
        },
        usage: {
          tokens: aiResponse.usage?.total_tokens || 0,
          model: aiResponse.model
        }
      }
    });

  } catch (error: any) {
    logger.error('Error processing chat message:', error);
    
    res.status(500).json({
      error: 'Failed to process message',
      code: 'CHAT_PROCESSING_ERROR',
      message: 'We encountered an issue processing your message. Please try again.'
    });
  }
}));

// Streaming chat endpoint for real-time responses
router.post('/stream', chatRateLimiter, asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { message, sessionId, context } = req.body;
  const userId = req.user!.uid;

  if (!message || !message.trim()) {
    res.status(400).json({
      error: 'Message is required',
      code: 'MISSING_MESSAGE'
    });
    return;
  }

  try {
    // Set up Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Create new session if not provided
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const sessionRef = await FirebaseService.createChatSession(userId, {
        title: message.substring(0, 50) + '...',
        type: 'wellness_chat_stream'
      });
      currentSessionId = sessionRef.id;
    }

    // Get user context
    const userDoc = await FirebaseService.getUser(userId);
    const userContext = {
      profile: (userDoc as any)?.profile || {},
      mentalHealthProfile: (userDoc as any)?.mentalHealthProfile || {},
      preferences: (userDoc as any)?.preferences || {},
      recentMoods: await FirebaseService.getUserMoodHistory(userId, 5),
      context: context || {}
    };

    // Add user message to session
    await FirebaseService.addChatMessage(currentSessionId, {
      content: message,
      role: 'user',
      userId,
      metadata: {
        timestamp: new Date(),
        platform: 'web',
        streamingMode: true
      }
    });

    const conversationHistory = [
      { role: 'user', content: message }
    ];

    // Start streaming response
    const stream = await GeminiService.createStreamingWellnessResponse(
      conversationHistory,
      userContext
    );

    let fullResponse = '';
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        
        // Send chunk via SSE
        res.write(`data: ${JSON.stringify({
          type: 'chunk',
          content,
          sessionId: currentSessionId
        })}\n\n`);
        
        // Also send via Socket.IO
        socketService.sendToChatSession(currentSessionId, 'message_chunk', {
          content,
          sessionId: currentSessionId
        });
      }
    }

    // Save complete response to Firestore
    await FirebaseService.addChatMessage(currentSessionId, {
      content: fullResponse,
      role: 'assistant',
      userId,
      metadata: {
        timestamp: new Date(),
        streamingMode: true
      }
    });

    // Send completion event
    res.write(`data: ${JSON.stringify({
      type: 'complete',
      sessionId: currentSessionId,
      timestamp: new Date()
    })}\n\n`);

    res.end();

    StructuredLogger.logChatInteraction(userId, currentSessionId, 'ai', {
      responseLength: fullResponse.length,
      streamingMode: true
    });

  } catch (error: any) {
    logger.error('Error in streaming chat:', error);
    
    res.write(`data: ${JSON.stringify({
      type: 'error',
      error: 'Failed to process streaming message',
      code: 'STREAMING_ERROR'
    })}\n\n`);
    
    res.end();
  }
}));

// Get chat sessions for user
router.get('/sessions', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { limit = 20, offset = 0 } = req.query;

  try {
    // This would need to be implemented in FirebaseService
    // For now, we'll return a placeholder response
    res.json({
      success: true,
      data: {
        sessions: [],
        total: 0,
        hasMore: false
      }
    });
  } catch (error: any) {
    logger.error('Error fetching chat sessions:', error);
    res.status(500).json({
      error: 'Failed to fetch chat sessions',
      code: 'SESSIONS_FETCH_ERROR'
    });
  }
}));

// Get messages for a specific session
router.get('/sessions/:sessionId/messages', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { sessionId } = req.params;
  const { limit = 50, offset = 0 } = req.query;

  try {
    // This would need to be implemented in FirebaseService
    // For now, we'll return a placeholder response
    res.json({
      success: true,
      data: {
        messages: [],
        sessionInfo: {
          id: sessionId,
          title: 'Chat Session',
          createdAt: new Date(),
          messageCount: 0
        }
      }
    });
  } catch (error: any) {
    logger.error('Error fetching chat messages:', error);
    res.status(500).json({
      error: 'Failed to fetch chat messages',
      code: 'MESSAGES_FETCH_ERROR'
    });
  }
}));

// Update session title
router.patch('/sessions/:sessionId', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { sessionId } = req.params;
  const { title } = req.body;

  if (!title || !title.trim()) {
    res.status(400).json({
      error: 'Title is required',
      code: 'MISSING_TITLE'
    });
    return;
  }

  try {
    // This would need to be implemented in FirebaseService
    res.json({
      success: true,
      data: {
        sessionId,
        title: title.trim(),
        updatedAt: new Date()
      }
    });
  } catch (error: any) {
    logger.error('Error updating session:', error);
    res.status(500).json({
      error: 'Failed to update session',
      code: 'SESSION_UPDATE_ERROR'
    });
  }
}));

// Delete chat session
router.delete('/sessions/:sessionId', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { sessionId } = req.params;

  try {
    // This would need to be implemented in FirebaseService
    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error: any) {
    logger.error('Error deleting session:', error);
    res.status(500).json({
      error: 'Failed to delete session',
      code: 'SESSION_DELETE_ERROR'
    });
  }
}));

// Generate coping strategies based on current mood
router.post('/coping-strategies', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { currentMood, triggers, preferences } = req.body;

  try {
    const userDoc = await FirebaseService.getUser(userId);
    const moodHistory = await FirebaseService.getUserMoodHistory(userId, 10);
    
    const strategies = await GeminiService.generateCopingStrategies(
      { currentMood, triggers, history: moodHistory },
      { ...preferences, profile: (userDoc as any)?.profile }
    );

    res.json({
      success: true,
      data: {
        strategies,
        timestamp: new Date(),
        context: {
          currentMood,
          triggersConsidered: Array.isArray(triggers) ? triggers.length : 0
        }
      }
    });

  } catch (error: any) {
    logger.error('Error generating coping strategies:', error);
    res.status(500).json({
      error: 'Failed to generate coping strategies',
      code: 'COPING_STRATEGIES_ERROR'
    });
  }
}));

export default router;