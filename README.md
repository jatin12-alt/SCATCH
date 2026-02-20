# SCATCH Project

This is my local build of the SCATCH vegan e-commerce app. It's built on React/Vite with Supabase handling the backend heavy lifting (auth, products, etc.).

## How to get it running:

1.  **Clone and Prep:**
    Make sure you're in the right directory:
    ```bat
    cd /d "C:\Users\jatin\OneDrive\Desktop\All_Projects\SCATCH"
    npm install
    ```

2.  **Environment Setup:**
    You'll need a `.env` file in the root. Don't forget to add your Supabase keys:
    - `VITE_SUPABASE_URL`=...
    - `VITE_SUPABASE_ANON_KEY`=...

3.  **Launch:**
    ```bat
    npm run dev
    ```
    Should pop up on `http://localhost:5173`.

---
*Note: If you run into auth issues, double check the RLS policies in Supabase.*
