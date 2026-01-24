import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/types';
import { GeminiService } from '@/config/gemini';
import { FirebaseService } from '@/config/firebase';
import { logger } from '@/utils/logger';
import { Response } from 'express';

const router = Router();

// Get music recommendations based on mood
router.get('/recommendations', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { mood, activity = 'relaxation', limit = 10 } = req.query;

  try {
    // Get user's music preferences
    const userDoc = await FirebaseService.getUser(userId);
    const recentMoods = await FirebaseService.getUserMoodHistory(userId, 5);
    
    const musicPreferences = {
      genres: ['ambient', 'classical', 'nature sounds'],
      preferredArtists: [],
      therapeuticGoals: ['stress relief', 'mood improvement'],
      ...(userDoc as any)?.musicPreferences
    };

    // Generate AI-powered music recommendations
    const recommendations = await GeminiService.generateMusicRecommendations(
      { currentMood: mood || 'neutral', recentMoods, intensity: 0.5 },
      musicPreferences,
      activity as string
    );

    res.json({
      success: true,
      data: {
        recommendations: recommendations.recommendations || [],
        mood: mood || 'neutral',
        activity,
        generatedAt: new Date()
      }
    });

  } catch (error: any) {
    logger.error('Error getting music recommendations:', error);
    res.status(500).json({
      error: 'Failed to get music recommendations',
      code: 'MUSIC_RECOMMENDATIONS_ERROR'
    });
  }
}));

// Update user music preferences
router.post('/preferences', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { genres, artists, moodMappings, therapeuticGoals } = req.body;

  try {
    await FirebaseService.updateMusicPreferences(userId, {
      genres: genres || [],
      artists: artists || [],
      moodMappings: moodMappings || {},
      therapeuticGoals: therapeuticGoals || []
    });

    res.json({
      success: true,
      data: {
        message: 'Music preferences updated successfully',
        preferences: {
          genres,
          artists,
          moodMappings,
          therapeuticGoals
        },
        updatedAt: new Date()
      }
    });

  } catch (error: any) {
    logger.error('Error updating music preferences:', error);
    res.status(500).json({
      error: 'Failed to update music preferences',
      code: 'MUSIC_PREFERENCES_ERROR'
    });
  }
}));

// Get curated playlists
router.get('/playlists', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { category = 'all', mood } = req.query;

  try {
    // This would connect to a music service API or database
    const playlists = [
      {
        id: 'playlist_1',
        name: 'Anxiety Relief',
        description: 'Calming music to help reduce anxiety',
        category: 'anxiety',
        mood: 'anxious',
        tracks: 20,
        duration: '1h 15m',
        therapeuticBenefits: ['stress reduction', 'heart rate normalization', 'breathing regulation']
      },
      {
        id: 'playlist_2',
        name: 'Mood Boost',
        description: 'Uplifting songs to improve your mood',
        category: 'mood',
        mood: 'sad',
        tracks: 25,
        duration: '1h 30m',
        therapeuticBenefits: ['dopamine release', 'positive thinking', 'energy boost']
      },
      {
        id: 'playlist_3',
        name: 'Focus & Clarity',
        description: 'Instrumental music for concentration',
        category: 'focus',
        mood: 'neutral',
        tracks: 30,
        duration: '2h',
        therapeuticBenefits: ['concentration enhancement', 'cognitive support', 'productivity']
      }
    ];

    const filteredPlaylists = category === 'all' 
      ? playlists 
      : playlists.filter(p => p.category === category);

    res.json({
      success: true,
      data: {
        playlists: filteredPlaylists,
        category,
        totalCount: filteredPlaylists.length
      }
    });

  } catch (error: any) {
    logger.error('Error fetching playlists:', error);
    res.status(500).json({
      error: 'Failed to fetch playlists',
      code: 'PLAYLISTS_FETCH_ERROR'
    });
  }
}));

// Create custom playlist
router.post('/playlists', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { name, description, tracks, mood, therapeuticGoals } = req.body;

  if (!name || !tracks || !Array.isArray(tracks)) {
    res.status(400).json({
      error: 'Name and tracks array are required',
      code: 'MISSING_PLAYLIST_DATA'
    });
    return;
  }

  try {
    // This would be implemented in FirebaseService
    const playlistId = `playlist_${Date.now()}`;
    
    res.status(201).json({
      success: true,
      data: {
        playlistId,
        name,
        description,
        tracks: tracks.length,
        mood,
        therapeuticGoals,
        createdAt: new Date(),
        createdBy: userId
      }
    });

  } catch (error: any) {
    logger.error('Error creating playlist:', error);
    res.status(500).json({
      error: 'Failed to create playlist',
      code: 'PLAYLIST_CREATE_ERROR'
    });
  }
}));

// Get music therapy session
router.post('/therapy-session', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { currentMood, goals, duration = 30, preferences = {} } = req.body;

  try {
    const userDoc = await FirebaseService.getUser(userId);
    const moodHistory = await FirebaseService.getUserMoodHistory(userId, 10);
    
    // Generate therapeutic music session
    const session = await GeminiService.generateMusicRecommendations(
      { currentMood, recentMoods: moodHistory, intensity: 0.5 },
      { ...preferences, therapeuticGoals: goals },
      'therapy_session'
    );

    // Create session structure
    const therapySession = {
      sessionId: `therapy_${Date.now()}`,
      userId,
      structure: {
        warmUp: {
          duration: Math.round(duration * 0.2),
          tracks: (session.recommendations || []).slice(0, 3),
          purpose: 'Gradual mood preparation'
        },
        main: {
          duration: Math.round(duration * 0.6),
          tracks: (session.recommendations || []).slice(3, 8),
          purpose: 'Core therapeutic intervention'
        },
        coolDown: {
          duration: Math.round(duration * 0.2),
          tracks: (session.recommendations || []).slice(8, 10),
          purpose: 'Integration and relaxation'
        }
      },
      expectedOutcomes: ['Improved mood', 'Reduced stress', 'Enhanced relaxation'],
      instructions: ['Find a quiet space', 'Use headphones for best experience', 'Focus on your breathing'],
      createdAt: new Date(),
      totalDuration: duration
    };

    res.json({
      success: true,
      data: therapySession
    });

  } catch (error: any) {
    logger.error('Error creating therapy session:', error);
    res.status(500).json({
      error: 'Failed to create therapy session',
      code: 'THERAPY_SESSION_ERROR'
    });
  }
}));

export default router;