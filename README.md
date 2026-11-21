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
2. Pick the event from the dropdown in the roster manager.
3. Add names one of three ways: Single Add, Bulk Paste, or Event CSV. The CSV only needs a list of names, one per line.
4. Choose Append to keep existing names, or Replace to overwrite that event's roster.
5. Deploy. The public roster updates right away.

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon/public API key
