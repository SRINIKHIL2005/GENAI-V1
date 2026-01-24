import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';

let db: FirebaseFirestore.Firestore;
let auth: any;

export function initFirebaseAdmin() {
  if (getApps().length === 0) {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
    try {
      // prefer a service account file if provided
      const sa = require(path.resolve(serviceAccountPath));
      initializeApp({ credential: cert(sa as any) as any });
    } catch (e) {
      // fallback to default app initialization
      initializeApp();
    }
  }

  db = getFirestore();
  auth = getAuth();
  return { db, auth };
}

export { db, auth };
