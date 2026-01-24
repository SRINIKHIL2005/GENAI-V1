# Saathi Backend (archived)

This backend supports credentialed or privacy-sensitive features for the Saathi app: AI (Gemini), Google Cloud services (Translate, Vision), migration scripts and batch jobs.

Quick start (local development)

1. Copy `.env.example` to `.env` and populate values you have. If you don't have credentials the server will warn and fall back to mock implementations for Gemini/Google services.

2. Install dependencies:

```powershell
cd saathi-backend
npm install
```

3. Run in dev mode:

```powershell
npm run dev
```

Migration: dedupe mood entries and initialize streaks

This repository includes a migration script to dedupe existing mood documents and create deterministic `userId_YYYY-MM-DD` documents and update each user's `wellness.streak` and `wellness.lastMoodDate`.

Run the migration (requires Firebase Admin service account):

```powershell
cd saathi-backend
ts-node scripts/migrate_dedupe_moods.ts
```

Notes
- The server is intentionally tolerant of missing external credentials for local development. When you add a `GEMINI_API_KEY` and Google credentials the server will enable full AI and translation features.
- The translation service includes a mock fallback so you can still run translation routes without credentials.
