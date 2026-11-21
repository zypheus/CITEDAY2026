# TASKS.md: CITE DAY 2026 Marines Roster Site

> Audience: AI coding agents and the human owner (Lloyd).
> Source of truth for scope and decisions: `PLAN.md`. Read it before starting.

## How to Work (rules for agents)

1. Work **one phase at a time**. Finish every task in the phase, run its checks, then **stop and report** to the user. Do not start the next phase until the user says go.
2. Tick the checkbox `[x]` when a task is done. Add a short note under it if something changed.
3. Explain what you did in **plain English** after each phase (2 to 5 sentences, no jargon dump).
4. Do not add features outside `PLAN.md` (no photos, scores, other teams, extra admins).
5. Ask before any destructive database action.
6. In written text and docs, do not use em dashes. Use commas, periods, or colons.

Status legend: `[ ]` todo, `[x]` done, `[~]` in progress, `[!]` blocked.

---

## Phase 0: Setup and Accounts

**Goal:** Empty project, Supabase project, and MCP connected.

- [x] 0.1 Create a GitHub repo `cite-day-2026` and clone it locally (local git repository initialized).
- [x] 0.2 Scaffold Next.js (App Router, TypeScript, Tailwind, ESLint, `src/` directory).
- [x] 0.3 Copy `PLAN.md` and `TASKS.md` into the repo root. Create a short `AGENTS.md` that points to both files and repeats the agent rules above.
- [x] 0.4 Create a new Supabase project (`cite-day-2026`). Project ref: `rnlchpadkgreidvkaxcf`.
- [x] 0.5 Connect the Supabase MCP to the agent, scoped to this project only.
- [x] 0.6 Verify MCP works by listing tables.
- [x] 0.7 Add `.env.example` and `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Confirm `.env.local` is in `.gitignore`.

**Check:** `npm run dev` shows the default Next.js page. MCP can list tables.

---

## Phase 1: Database

**Goal:** Tables, seed data, and security rules in place.

- [x] 1.1 Create migration `001_create_tables.sql` with the `events` and `participants` tables from PLAN section 5. Applied via MCP `apply_migration` and saved in `supabase/migrations/`.
- [x] 1.2 Create migration `002_rls_policies.sql`: enable RLS on both tables, public `select`, authenticated-only write. Applied via MCP and saved.
- [x] 1.3 Create `supabase/seed.sql` with all 21 events from PLAN section 4 and apply it. All 21 seeded and verified.
- [x] 1.4 Create migration `003_replace_roster_fn.sql`: a Postgres function `replace_roster(rows jsonb)` that deletes all participants and inserts the new rows in one transaction. Runs as security invoker with fixed search_path.
- [x] 1.5 Supabase Auth settings: admin user creation in dashboard instructions documented.
- [x] 1.6 Run the Supabase security advisor and fix any warnings (fixed role mutable search_path on function).
- [x] 1.7 Insert fake test participants to verify sorting and grouping, then cleared so database is ready for real data.

**Check:** `select count(*) from events` returns 21. Anonymous `insert` into `participants` is rejected. Anonymous `select` works.

---

## Phase 2: Public Roster Page (no theme yet)

**Goal:** Working data display with plain styling.

- [x] 2.1 Add Supabase client helpers in `src/lib/supabase/` (browser client, server client).
- [x] 2.2 Add `src/lib/events.ts` and `src/lib/constants.ts` with category labels and typed fetch function returning events with participants sorted by `sort_order`, names A to Z.
- [x] 2.3 Build `/` as a server component that lists every event and its names with participant count per event.
- [x] 2.4 Empty state: show "No participants yet" for events with zero names.
- [x] 2.5 Add `CategoryFilter` (All, Stage, Tech and Business, Creative, Esports, Games and Sports) and name search box.
- [x] 2.6 Page updates dynamically with server actions revalidating `/`.

**Check:** Test data appears under the right events. Filter and search work. Page loads with no console errors.

---

## Phase 3: Admin Login and Protection

**Goal:** Only the admin can reach `/admin`.

- [x] 3.1 Install `@supabase/ssr`. Add `src/middleware.ts` and `src/lib/supabase/middleware.ts` to refresh sessions.
- [x] 3.2 Build `/admin/login` with email and password form and clear error message for wrong credentials.
- [x] 3.3 Protect `/admin`: redirect to `/admin/login` when not logged in.
- [x] 3.4 Add a logout button on `/admin`.
- [x] 3.5 Do not add any sign up page or link.

**Check:** Logged out visit to `/admin` redirects to login. Correct login lands on `/admin`. Logout works.

---

## Phase 4: CSV Upload

**Goal:** Admin can upload, preview, and confirm a roster.

- [x] 4.1 Install `papaparse` and `@types/papaparse`. Create `src/lib/csv.ts` to parse and validate per PLAN section 6 (trim, collapse spaces, skip blanks, dedupe, match event by slug or name case-insensitively, strip BOM).
- [x] 4.2 Build `CsvUploader` on `/admin`: file picker, parse in the browser, show preview table with counts per event and list of error rows.
- [x] 4.3 Block confirm button if the file has zero valid rows. Show warning if rows have errors with skipped count.
- [x] 4.4 Add server action in `src/app/admin/actions.ts` calling `replace_roster` through logged-in admin session with server-side re-validation.
- [x] 4.5 Call `revalidatePath('/')` on success, show confirmation with count and link to public page.
- [x] 4.6 Add `public/sample.csv` with download link and valid events directory on `/admin`.
- [x] 4.7 Show last upload time and current total participants on `/admin`.
- [x] 4.8 Edge case handling verified (unknown events, BOM, duplicate rows, whitespace normalization).

**Check:** Uploading `sample.csv` updates the public page. A bad file shows clear errors and leaves the old roster unchanged.

---

## Phase 5: Retro One Piece x Marines Theme

**Goal:** Make it look great without making it complex.

- [x] 5.1 Add fonts `Press Start 2P` and `VT323` using `next/font/google`.
- [x] 5.2 Define colors in CSS variables from PLAN section 8 (Navy #0B1F3A, Marine blue #1E4D8C, off-white #F4EFE0, parchment #E8D9B0, accent red #C8312B, gold #E0B040).
- [x] 5.3 Build `Hero`: pixel title "CITE DAY 2026", "TEAM MARINES", "JUSTICE" banner, original SVG anchor emblem, total participants count.
- [x] 5.4 Style `EventCard` as wanted-poster card: parchment background, thick dark border, pixel shadow, category tag, count badge.
- [x] 5.5 Style `CategoryFilter` as retro arcade buttons with active states.
- [x] 5.6 Add light effects: subtle CRT scanline overlay, wave divider, hover lift respecting `prefers-reduced-motion`.
- [x] 5.7 Apply theme to `/admin/login` and `/admin` pages.
- [x] 5.8 Mobile pass: tested and formatted down to 360px width.
- [x] 5.9 Text contrast verified on parchment and navy backgrounds.

**Check:** Looks consistent on phone and desktop. No official One Piece or Marine logos or images used.

---

## Phase 6: Polish and QA

**Goal:** Ready for real data.

- [x] 6.1 Add page metadata: title "CITE DAY 2026 | Team Marines", description, Open Graph tags, and dynamic favicon icon.
- [x] 6.2 Add loading and error states (`loading.tsx`, `error.tsx`).
- [x] 6.3 Confirm in database that RLS is active on both tables and anonymous writes fail.
- [x] 6.4 Clean test data from database.
- [x] 6.5 Run `npm run lint` and `npm run build` with all issues fixed (both exit 0).
- [x] 6.6 Write `README.md` with "How to upload a roster" in under 10 lines.

**Check:** Build passes. Database clean and ready for real CSV upload.

---

## Phase 7: Deploy to Vercel

**Goal:** Live site.

- [x] 7.1 Push the repo to GitHub. Pushed `master` to https://github.com/zypheus/CITEDAY2026.git.
- [ ] 7.2 Import the repo in Vercel. Framework preset: Next.js.
- [ ] 7.3 Add the two env vars in Vercel for Production and Preview.
- [ ] 7.4 In Supabase Auth settings, set the Site URL and redirect URLs to the Vercel domain.
- [ ] 7.5 Deploy. Test the public page, admin login, and a real upload on the live URL.
- [ ] 7.6 (Optional) Add a custom domain or share the `*.vercel.app` link with the team.
- [ ] 7.7 Back up the final roster by exporting `participants` as CSV from Supabase.

**Check:** Live URL works on a phone over mobile data. Admin upload works in production.

---

## Phase 8: Later Ideas (only if the owner asks)

- [ ] 8.1 Per event detail page `/events/[slug]`.
- [ ] 8.2 "Add and update" import mode alongside "Replace all".
- [ ] 8.3 Event schedule, venue, or time fields.
- [ ] 8.4 Reuse the roster for the CITE Discord team verification bot (see the Discord bot project).
- [ ] 8.5 Dark or light theme toggle.

---

## Progress Log (agents append here)

| Date | Phase | Note |
|---|---|---|
| 2026-11-21 | Phase 0 | Initialized git, scaffolded Next.js App Router, configured .env.local, .env.example, .gitignore, and AGENTS.md. |
| 2026-11-21 | Phase 1 | Created tables, applied RLS policies, seeded all 21 events, added replace_roster function, fixed security advisor warnings. |
| 2026-11-21 | Phase 2 | Built public roster page at / with hero, event cards, category filter, name search, and empty state. |
| 2026-11-21 | Phase 3 | Configured @supabase/ssr, middleware route guarding, /admin/login page, /admin dashboard, and logout action. |
| 2026-11-21 | Phase 4 | Built CSV parser with BOM and space normalization, browser preview, server action validation, sample.csv download, and metrics. |
| 2026-11-21 | Phase 5 | Applied retro One Piece x Marines theme (Press Start 2P, VT323, parchment wanted-poster cards, CRT overlay, wave divider). |
| 2026-11-21 | Phase 6 | Added metadata, favicon, loading.tsx, error.tsx, README with upload guide. Passed lint and build cleanly. Cleaned test data. |
| 2026-11-21 | Fix | Made `/` and `/admin` request-time with `connection()` so a logged-in Supabase session no longer trips the `Date.now()` prerender error. Added migration 005 giving `replace_roster` a WHERE clause so Supabase safe update allows the bulk upload. |
| 2026-11-21 | Pagination | Added per-event roster pagination on the public page: 10 names per card, Prev/Next, page kept in the URL as `p-<slug>`. Category filter and search reset the page params. |
| 2026-11-21 | Phase 7 | Pushed `master` to https://github.com/zypheus/CITEDAY2026.git (task 7.1). |
