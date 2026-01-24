Saathi Backend (ARCHIVED)
=========================

This folder contains the original `saathi-backend` server code. It has been archived because the frontend (`saathi-wellness-friend`) contains the main production logic using Firebase and client-side features.

Why archived
- The frontend handles auth, storage and chat history via Firebase; the backend was a parallel implementation that duplicated concerns.
- To avoid confusion and accidental deployment, the backend code is archived here.

If you want to re-enable a server later:
1. Move or copy the `saathi-backend` folder back into the repository root.
2. Create a `.env` file in `saathi-backend` with required credentials (GEMINI_API_KEY if server-side AI is needed).
3. Run `npm install` and `npm run dev` inside `saathi-backend`.

Planned next steps
- Implemented frontend upgrades for translation and navigation controls.
- Next: add Progress Dashboard improvements (history & streaks), exercise tracking, and finalize Music Player persistence.

Contact
----
If you need the archived backend restored or trimmed, reply and I will restore or remove it.

Added files & quick ops
- `.env.example` — example environment variables for local runs and testing.
- `scripts/migrate_dedupe_moods.ts` — consolidation/migration script that dedupes mood entries into deterministic `userId_YYYY-MM-DD` documents and initializes user `wellness.streak` and `wellness.lastMoodDate`.

Run migration (example, requires Firebase Admin service account):

```powershell
cd saathi-backend
ts-node scripts/migrate_dedupe_moods.ts
```

Notes
- The server now tolerates missing GEMINI/Google credentials at startup and will warn and fallback to mock implementations where possible. This makes local development simpler while still supporting credentialed runs in production.

