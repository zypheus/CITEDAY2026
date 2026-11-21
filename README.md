# CITE DAY 2026: Team Marines Roster Site

A public roster tracking website for Team Marines competitions at CITE DAY 2026. Built with Next.js App Router, Tailwind CSS, and Supabase.

## Tech Stack
- Framework: Next.js (TypeScript, App Router)
- Database and Auth: Supabase Postgres with Row Level Security
- Theme: Retro arcade One Piece x Marines aesthetic

## Local Development
1. Clone this repository.
2. Copy `.env.example` to `.env.local` and add your Supabase credentials.
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`

## How to upload a roster
1. Navigate to `/admin/login` and sign in with officer credentials.
2. Download `sample.csv` or prepare a CSV with `event,name` columns.
3. Select your CSV file and inspect the preview table for any flagged rows.
4. Click "Confirm and Replace Roster" to deploy the manifest.
5. All participant records are replaced atomically and the public roster updates.

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon/public API key
