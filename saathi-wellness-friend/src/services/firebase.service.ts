import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  // use an alias because `limit` is a common local variable name
  limit as firestoreLimit,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '@/config/firebase.config';

// Auth Services
export const createUser = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user's display name
    await updateProfile(user, { displayName });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      createdAt: serverTimestamp(),
      preferences: {
        theme: 'system',
        language: 'en',
        notifications: true,
      },
      wellness: {
        moodHistory: [],
        goals: [],
        streak: 0,
      }
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Check if user document exists, if not create one
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        preferences: {
          theme: 'system',
          language: 'en',
          notifications: true,
        },
        wellness: {
          moodHistory: [],
          goals: [],
          streak: 0,
        }
      });
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// User Data Services
export const getUserData = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const updateUserData = async (uid: string, data: any) => {
  try {
    await updateDoc(doc(db, 'users', uid), data);
  } catch (error) {
    throw error;
  }
};

// Mood Tracking Services
export const saveMoodEntry = async (uid: string, moodData: any) => {
  try {
    // Create a deterministic document id to avoid duplicates: one mood entry per user per day
    const today = new Date();
    // Use ISO-like date in YYYY-MM-DD format using user's local timezone
    const dateStr = today.toLocaleDateString('en-CA'); // en-CA yields YYYY-MM-DD
    const docId = `${uid}_${dateStr}`;
    const moodRef = doc(db, 'moods', docId);

    // Write (merge) the mood entry so repeated saves for the same day update instead of creating duplicates
    await setDoc(moodRef, {
      uid,
      ...moodData,
      date: dateStr,
      timestamp: serverTimestamp(),
    }, { merge: true });

    // Update user's wellness streak and lastMoodDate on their user document
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData: any = userSnap.data();
      const wellness = userData.wellness || {};
      const lastDate: string | undefined = wellness.lastMoodDate;
      let streak = typeof wellness.streak === 'number' ? wellness.streak : 0;

      // If the user already logged today, keep streak unchanged
      if (lastDate === dateStr) {
        // no-op: updating the same day
      } else {
        // compute yesterday's date string
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toLocaleDateString('en-CA');

        if (lastDate === yesterdayStr) {
          // consecutive day -> increment streak
          streak = streak + 1;
        } else {
          // not consecutive -> reset streak to 1
          streak = 1;
        }

        // persist updated streak and lastMoodDate
        try {
          await updateDoc(userRef, {
            'wellness.streak': streak,
            'wellness.lastMoodDate': dateStr,
          });
        } catch (e) {
          // non-fatal: user doc update failed, but mood entry was saved
          console.warn('Failed updating user wellness streak', e);
        }
      }
    }
  } catch (error) {
    throw error;
  }
};

export const getMoodHistory = async (uid: string, limit = 30) => {
  try {
    const q = query(
      collection(db, 'moods'),
      where('uid', '==', uid),
      orderBy('timestamp', 'desc'),
      firestoreLimit(limit),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// Chat Services
export const saveChatMessage = async (uid: string, message: any) => {
  try {
    await addDoc(collection(db, 'chats'), {
      uid,
      ...message,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

export const getChatHistory = async (uid: string, limit = 50) => {
  try {
    const q = query(
      collection(db, 'chats'),
      where('uid', '==', uid),
      orderBy('timestamp', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, limit);
  } catch (error) {
    throw error;
  }
};