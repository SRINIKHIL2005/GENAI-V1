import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { initFirebaseAdmin } from './services/firebaseAdmin.ts';
import moodRoutes from './routes/mood.ts';

dotenv.config();

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

// Initialize Firebase Admin
initFirebaseAdmin();

app.use('/api/mood', moodRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date() }));

const port = process.env.SERVER_PORT || 4000;
app.listen(port, () => console.log(`Embedded server listening on ${port}`));
