## SCATCH-4U (local run)

This repo is a **Vite + React** app that uses **Supabase** as the backend.

### Start the app (Windows cmd)

```bat
cd /d "C:\Users\jatin\OneDrive\Desktop\backend all projects\SCATCH-4U\SCATCH-4U-main\SCATCH-4U-main"
npm install
```

Create a file named `.env` in this same folder with:

- `VITE_SUPABASE_URL` (from Supabase Project Settings → API)
- `VITE_SUPABASE_ANON_KEY` (from Supabase Project Settings → API)

Then run:

```bat
npm run dev
```

Vite will print the local URL (typically `http://localhost:5173/`).
