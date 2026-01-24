import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { logger } from '@/utils/logger';
import path from 'path';

let app: any;
let db: FirebaseFirestore.Firestore;
let auth: any;
let storage: any;

export async function initializeFirebase() {
  try {
    // Check if Firebase app is already initialized
    if (getApps().length === 0) {
      // Initialize Firebase Admin SDK
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
      
      if (serviceAccountPath) {
        // Use service account file
        const serviceAccount = require(path.resolve(serviceAccountPath));
        app = initializeApp({
          credential: cert(serviceAccount),
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
          databaseURL: process.env.FIREBASE_DATABASE_URL
        });
      } else {
        // Use environment variables for service account
        const serviceAccount = {
          type: 'service_account',
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: 'https://accounts.google.com/o/oauth2/auth',
          token_uri: 'https://oauth2.googleapis.com/token',
          auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
          client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
        } as any;

        app = initializeApp({
          credential: cert(serviceAccount),
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
          databaseURL: process.env.FIREBASE_DATABASE_URL
        });
      }
    } else {
      app = getApps()[0];
    }

    // Initialize services
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);

    // Configure Firestore settings
    db.settings({
      ignoreUndefinedProperties: true
    });

    logger.info('Firebase Admin SDK initialized successfully');
    return { app, db, auth, storage };
  } catch (error) {
    logger.error('Failed to initialize Firebase:', error);
    throw error;
  }
}

// Collections and subcollections structure
export const Collections = {
  USERS: 'users',
  CHAT_SESSIONS: 'chatSessions',
  MOOD_ENTRIES: 'moodEntries',
  VOICE_SESSIONS: 'voiceSessions',
  MUSIC_PREFERENCES: 'musicPreferences',
  PHYSICAL_ACTIVITIES: 'physicalActivities',
  PROGRESS_TRACKING: 'progressTracking',
  CRISIS_LOGS: 'crisisLogs',
  USER_SETTINGS: 'userSettings',
  ANALYTICS: 'analytics',
  NOTIFICATIONS: 'notifications',
  FEEDBACK: 'feedback'
} as const;

export const SubCollections = {
  MESSAGES: 'messages',
  MOOD_HISTORY: 'moodHistory',
  VOICE_TRANSCRIPTS: 'voiceTranscripts',
  PLAYLISTS: 'playlists',
  EXERCISE_LOGS: 'exerciseLogs',
  GOALS: 'goals',
  ACHIEVEMENTS: 'achievements',
  INSIGHTS: 'insights'
} as const;

// Firestore helper functions
export class FirebaseService {
  static async createUser(uid: string, userData: any) {
    try {
      const userRef = db.collection(Collections.USERS).doc(uid);
      await userRef.set({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        profile: {
          displayName: userData.displayName || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || null,
          photoURL: userData.photoURL || null,
          age: userData.age || null,
          gender: userData.gender || null,
          location: userData.location || null,
          emergencyContact: userData.emergencyContact || null
        },
        preferences: {
          language: userData.language || 'en',
          timezone: userData.timezone || 'UTC',
          notifications: {
            push: true,
            email: true,
            sms: false,
            reminders: true,
            moodCheckins: true,
            crisisAlerts: true
          },
          privacy: {
            shareData: false,
            anonymousAnalytics: true,
            dataRetention: '2years'
          }
        },
        mentalHealthProfile: {
          conditions: userData.conditions || [],
          medications: userData.medications || [],
          therapyHistory: userData.therapyHistory || [],
          riskLevel: 'low',
          lastAssessment: null,
          goals: userData.goals || [],
          supportNetwork: userData.supportNetwork || []
        }
      });
      return userRef;
    } catch (error) {
      logger.error('Error creating user in Firestore:', error);
      throw error;
    }
  }

  static async updateUser(uid: string, updateData: any) {
    try {
      const userRef = db.collection(Collections.USERS).doc(uid);
      await userRef.update({
        ...updateData,
        updatedAt: new Date()
      });
      return userRef;
    } catch (error) {
      logger.error('Error updating user in Firestore:', error);
      throw error;
    }
  }

  static async getUser(uid: string) {
    try {
      const userDoc = await db.collection(Collections.USERS).doc(uid).get();
      if (!userDoc.exists) {
        return null;
      }
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      logger.error('Error getting user from Firestore:', error);
      throw error;
    }
  }

  static async createChatSession(uid: string, sessionData: any) {
    try {
      const sessionRef = db.collection(Collections.CHAT_SESSIONS).doc();
      await sessionRef.set({
        userId: uid,
        ...sessionData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      });
      return sessionRef;
    } catch (error) {
      logger.error('Error creating chat session:', error);
      throw error;
    }
  }

  static async addChatMessage(sessionId: string, messageData: any) {
    try {
      const messageRef = db
        .collection(Collections.CHAT_SESSIONS)
        .doc(sessionId)
        .collection(SubCollections.MESSAGES)
        .doc();
      
      await messageRef.set({
        ...messageData,
        timestamp: new Date()
      });

      // Update session last activity
      await db.collection(Collections.CHAT_SESSIONS).doc(sessionId).update({
        lastActivity: new Date(),
        messageCount: require('firebase-admin').firestore.FieldValue.increment(1)
      });

      return messageRef;
    } catch (error) {
      logger.error('Error adding chat message:', error);
      throw error;
    }
  }

  static async createMoodEntry(uid: string, moodData: any) {
    try {
      const moodRef = db.collection(Collections.MOOD_ENTRIES).doc();
      await moodRef.set({
        userId: uid,
        ...moodData,
        timestamp: new Date()
      });
      return moodRef;
    } catch (error) {
      logger.error('Error creating mood entry:', error);
      throw error;
    }
  }

  static async getUserMoodHistory(uid: string, limit: number = 30) {
    try {
      const moodQuery = await db
        .collection(Collections.MOOD_ENTRIES)
        .where('userId', '==', uid)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      return moodQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      logger.error('Error getting mood history:', error);
      throw error;
    }
  }

  static async createVoiceSession(uid: string, voiceData: any) {
    try {
      const voiceRef = db.collection(Collections.VOICE_SESSIONS).doc();
      await voiceRef.set({
        userId: uid,
        ...voiceData,
        createdAt: new Date(),
        status: 'processing'
      });
      return voiceRef;
    } catch (error) {
      logger.error('Error creating voice session:', error);
      throw error;
    }
  }

  static async updateMusicPreferences(uid: string, preferences: any) {
    try {
      const prefRef = db.collection(Collections.MUSIC_PREFERENCES).doc(uid);
      await prefRef.set({
        userId: uid,
        ...preferences,
        updatedAt: new Date()
      }, { merge: true });
      return prefRef;
    } catch (error) {
      logger.error('Error updating music preferences:', error);
      throw error;
    }
  }

  static async logPhysicalActivity(uid: string, activityData: any) {
    try {
      const activityRef = db.collection(Collections.PHYSICAL_ACTIVITIES).doc();
      await activityRef.set({
        userId: uid,
        ...activityData,
        timestamp: new Date()
      });
      return activityRef;
    } catch (error) {
      logger.error('Error logging physical activity:', error);
      throw error;
    }
  }

  static async logCrisisEvent(uid: string, crisisData: any) {
    try {
      const crisisRef = db.collection(Collections.CRISIS_LOGS).doc();
      await crisisRef.set({
        userId: uid,
        ...crisisData,
        timestamp: new Date(),
        resolved: false,
        priority: crisisData.severity || 'high'
      });
      
      // Update user's risk level
      await this.updateUser(uid, {
        'mentalHealthProfile.riskLevel': crisisData.severity === 'critical' ? 'critical' : 'high',
        'mentalHealthProfile.lastCrisisEvent': new Date()
      });

      return crisisRef;
    } catch (error) {
      logger.error('Error logging crisis event:', error);
      throw error;
    }
  }

  static async updateProgressTracking(uid: string, progressData: any) {
    try {
      const progressRef = db.collection(Collections.PROGRESS_TRACKING).doc(uid);
      await progressRef.set({
        userId: uid,
        ...progressData,
        updatedAt: new Date()
      }, { merge: true });
      return progressRef;
    } catch (error) {
      logger.error('Error updating progress tracking:', error);
      throw error;
    }
  }

  static async batchWrite(operations: any[]) {
    try {
      const batch = db.batch();
      operations.forEach(op => {
        if (op.type === 'set') {
          batch.set(op.ref, op.data);
        } else if (op.type === 'update') {
          batch.update(op.ref, op.data);
        } else if (op.type === 'delete') {
          batch.delete(op.ref);
        }
      });
      await batch.commit();
    } catch (error) {
      logger.error('Error in batch write operation:', error);
      throw error;
    }
  }
}

// Export Firebase instances
export { app as firebaseApp, db as firestore, auth as firebaseAuth, storage as firebaseStorage };
export default { initializeFirebase, FirebaseService };