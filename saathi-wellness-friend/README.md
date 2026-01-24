# Saathi Wellness Friend

This is the frontend app of Saathi. The frontend is the primary application that interacts with Firebase for auth, chats, mood tracking and progress.

Embedded backend
----------------

This project contains a lightweight embedded backend under `server/` to run credentialed or admin operations (migration, server-side Firestore admin tasks). It's optional — the frontend talks directly to Firebase for end-user flows.

Run the embedded server locally:

```powershell
cd saathi-wellness-friend
npm install
# copy .env.example if present and provide FIREBASE_SERVICE_ACCOUNT_PATH
npm run server
```

Run mood migration (dedupe existing mood entries into deterministic `userId_YYYY-MM-DD` documents):

```powershell
cd saathi-wellness-friend
npm run migrate:moods
```

AI Chat (Gemini)
----------------

The Chat page can talk to Google Gemini directly from the browser when a key is provided. If no key is present, it gracefully falls back to a local helper response (no external calls).

1) Add environment variables (recommended):

	 - Copy `.env.example` to `.env`
	 - Fill in Firebase values
	 - Optional for live AI responses:

		 ```env
		 VITE_GEMINI_API_KEY=your-google-generative-language-key
		 # Optional (defaults to gemini-1.5-flash)
		 VITE_GEMINI_MODEL=gemini-1.5-flash
		 ```

2) Start the app:

```powershell
cd saathi-wellness-friend
npm install
npm run dev
```

Notes
-----
- Your chat history is stored in Firebase Firestore. When `VITE_GEMINI_API_KEY` is set, recent history is sent to Gemini to maintain context.
- Without a key, messages are still saved locally in Firestore and the assistant replies with a safe, empathetic local template.
- To rotate or disable AI access, just add/remove `VITE_GEMINI_API_KEY` and reload the app.
