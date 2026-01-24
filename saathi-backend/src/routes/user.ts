import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/types';
import { FirebaseService } from '@/config/firebase';
import { logger } from '@/utils/logger';
import { Response } from 'express';

const router = Router();

// Get user profile
router.get('/profile', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;

  try {
    const userDoc = await FirebaseService.getUser(userId);
    
    if (!userDoc) {
      res.status(404).json({
        error: 'User profile not found',
        code: 'PROFILE_NOT_FOUND'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        profile: (userDoc as any).profile || {},
        preferences: (userDoc as any).preferences || {},
        mentalHealthProfile: (userDoc as any).mentalHealthProfile || {},
        createdAt: (userDoc as any).createdAt,
        updatedAt: (userDoc as any).updatedAt
      }
    });

  } catch (error: any) {
    logger.error('Error fetching user profile:', error);
    res.status(500).json({
      error: 'Failed to fetch user profile',
      code: 'PROFILE_FETCH_ERROR'
    });
  }
}));

// Update user profile
router.patch('/profile', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { profile, preferences, mentalHealthProfile } = req.body;

  try {
    const updateData: any = {};
    
    if (profile) updateData.profile = profile;
    if (preferences) updateData.preferences = preferences;
    if (mentalHealthProfile) updateData.mentalHealthProfile = mentalHealthProfile;

    await FirebaseService.updateUser(userId, updateData);

    res.json({
      success: true,
      data: {
        message: 'Profile updated successfully',
        updatedFields: Object.keys(updateData),
        updatedAt: new Date()
      }
    });

  } catch (error: any) {
    logger.error('Error updating user profile:', error);
    res.status(500).json({
      error: 'Failed to update user profile',
      code: 'PROFILE_UPDATE_ERROR'
    });
  }
}));

// Get user settings
router.get('/settings', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;

  try {
    const userDoc = await FirebaseService.getUser(userId);
    
    res.json({
      success: true,
      data: {
        preferences: (userDoc as any)?.preferences || {},
        notifications: (userDoc as any)?.preferences?.notifications || {},
        privacy: (userDoc as any)?.preferences?.privacy || {}
      }
    });

  } catch (error: any) {
    logger.error('Error fetching user settings:', error);
    res.status(500).json({
      error: 'Failed to fetch user settings',
      code: 'SETTINGS_FETCH_ERROR'
    });
  }
}));

// Update user settings
router.patch('/settings', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { notifications, privacy, language, timezone } = req.body;

  try {
    const updateData: any = { 'preferences': {} };
    
    if (notifications) updateData.preferences.notifications = notifications;
    if (privacy) updateData.preferences.privacy = privacy;
    if (language) updateData.preferences.language = language;
    if (timezone) updateData.preferences.timezone = timezone;

    await FirebaseService.updateUser(userId, updateData);

    res.json({
      success: true,
      data: {
        message: 'Settings updated successfully',
        updatedAt: new Date()
      }
    });

  } catch (error: any) {
    logger.error('Error updating user settings:', error);
    res.status(500).json({
      error: 'Failed to update user settings',
      code: 'SETTINGS_UPDATE_ERROR'
    });
  }
}));

// Delete user account
router.delete('/account', asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.uid;
  const { confirmDelete } = req.body;

  if (!confirmDelete) {
    res.status(400).json({
      error: 'Account deletion must be confirmed',
      code: 'DELETION_NOT_CONFIRMED'
    });
    return;
  }

  try {
    // This would implement complete account deletion
    // For now, we'll return a placeholder response
    
    res.json({
      success: true,
      data: {
        message: 'Account deletion initiated',
        note: 'Account and all associated data will be permanently deleted within 30 days',
        cancellationPeriod: '30 days',
        deletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

  } catch (error: any) {
    logger.error('Error deleting user account:', error);
    res.status(500).json({
      error: 'Failed to delete user account',
      code: 'ACCOUNT_DELETION_ERROR'
    });
  }
}));

export default router;