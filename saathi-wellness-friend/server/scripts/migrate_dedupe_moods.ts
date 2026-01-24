#!/usr/bin/env ts-node
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';

async function main() {
  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';
    const serviceAccount = require(path.resolve(serviceAccountPath));

    if (getApps().length === 0) {
      initializeApp({ credential: cert(serviceAccount) as any, projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID });
    }

    const db = getFirestore();
    console.log('Fetching mood entries...');
    const snapshot = await db.collection('moodEntries').get();

    const map = new Map<string, Map<string, FirebaseFirestore.QueryDocumentSnapshot>>();

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const userId = data.userId || data.uid || data.user || 'unknown';
      const ts = data.timestamp ? data.timestamp.toDate() : (data.date ? new Date(data.date) : null);
      const dateStr = ts ? ts.toISOString().split('T')[0] : 'unknown';

      if (!map.has(userId)) map.set(userId, new Map());
      const userMap = map.get(userId)!;

      if (!userMap.has(dateStr)) userMap.set(dateStr, doc);
      else {
        const existing = userMap.get(dateStr)!;
        const existingTs = existing.get('timestamp') ? existing.get('timestamp').toDate() : null;
        const currentTs = data.timestamp ? data.timestamp.toDate() : null;
        if (!existingTs && currentTs) userMap.set(dateStr, doc);
        else if (existingTs && currentTs && currentTs > existingTs) userMap.set(dateStr, doc);
      }
    }

    const batch = db.batch();
    let count = 0;
    for (const [userId, userMap] of map.entries()) {
      for (const [dateStr, docSnap] of userMap.entries()) {
        const newId = `${userId}_${dateStr}`;
        const newRef = db.collection('moodEntries').doc(newId);
        const data = docSnap.data();
        const payload = {
          userId,
          mood: data.mood || data.analysis?.primaryEmotion || null,
          intensity: data.intensity ?? data.analysis?.intensity ?? null,
          triggers: data.triggers || [],
          notes: data.notes || data.text || data.content || null,
          date: dateStr,
          timestamp: data.timestamp || new Date()
        } as any;

        batch.set(newRef, payload, { merge: true });
        count++;
      }
    }

    console.log(`Committing ${count} docs...`);
    await batch.commit();

    for (const [userId, userMap] of map.entries()) {
      const dates = Array.from(userMap.keys()).sort().reverse();
      let streak = 0;
      let lastDate: string | null = null;
      for (const dateStr of dates) {
        if (!lastDate) { streak = 1; lastDate = dateStr; }
        else {
          const dLast = new Date(lastDate);
          const dCurrent = new Date(dateStr);
          const diff = (dLast.getTime() - dCurrent.getTime()) / (1000 * 60 * 60 * 24);
          if (diff === 1) { streak += 1; lastDate = dateStr; } else break;
        }
      }
      await db.collection('users').doc(userId).set({ wellness: { streak, lastMoodDate: dates[0] } }, { merge: true });
    }

    console.log('Migration done');
    process.exit(0);
  } catch (e) {
    console.error('Migration failed', e);
    process.exit(1);
  }
}

main();
