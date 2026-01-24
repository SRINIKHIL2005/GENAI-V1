import { Router } from 'express';
import { db } from '../services/firebaseAdmin';

const router = Router();

// Save mood entry (one per day enforced by deterministic id)
router.post('/save', async (req, res) => {
  try {
    const { uid, mood, note, energy, stress } = req.body;
    if (!uid) return res.status(400).json({ error: 'uid required' });

    const dateStr = new Date().toISOString().split('T')[0];
    const docId = `${uid}_${dateStr}`;
    const ref = db.collection('moodEntries').doc(docId);
    await ref.set({ uid, mood, note, energy, stress, date: dateStr, timestamp: new Date() }, { merge: true });

    // also update user's wellness
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();
    let streak = 1;
    if (userSnap.exists) {
      const data: any = userSnap.data();
      const last = data?.wellness?.lastMoodDate;
      if (last === dateStr) {
        // do nothing
      } else {
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() -1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const prevStreak = data?.wellness?.streak || 0;
        if (last === yesterdayStr) streak = prevStreak + 1;
      }
    }
    await userRef.set({ wellness: { streak, lastMoodDate: dateStr } }, { merge: true });

    res.json({ success: true, id: docId });
  } catch (e) {
    res.status(500).json({ error: 'failed to save', detail: String(e) });
  }
});

// Get mood history
router.get('/history/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    const q = db.collection('moodEntries').where('uid', '==', uid).orderBy('timestamp', 'desc').limit(30);
    const snap = await q.get();
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ success: true, data: items });
  } catch (e) {
    res.status(500).json({ error: 'failed to fetch', detail: String(e) });
  }
});

export default router;
