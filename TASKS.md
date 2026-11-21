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

- [ ] 0.1 Create a GitHub repo `cite-day-2026` and clone it locally.
- [ ] 0.2 Scaffold Next.js (App Router, TypeScript, Tailwind, ESLint, `src/` directory).
- [ ] 0.3 Copy `PLAN.md` and `TASKS.md` into the repo root. Create a short `AGENTS.md` that points to both files and repeats the agent rules above.
- [ ] 0.4 Create a new Supabase project (`cite-day-2026`). Note the project ref.
- [ ] 0.5 Connect the Supabase MCP to the agent, scoped to this project only (see PLAN section 10).
- [ ] 0.6 Verify MCP works by listing tables (should be empty).
- [ ] 0.7 Add `.env.example` and `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Confirm `.env.local` is in `.gitignore`.

**Check:** `npm run dev` shows the default Next.js page. MCP can list tables.

---

## Phase 1: Database

**Goal:** Tables, seed data, and security rules in place.

- [ ] 1.1 Create migration `001_create_tables.sql` with the `events` and `participants` tables from PLAN section 5. Apply via MCP `apply_migration`. Save the file in `supabase/migrations/`.
- [ ] 1.2 Create migration `002_rls_policies.sql`: enable RLS on both tables, public `select`, authenticated-only write.
- [ ] 1.3 Create `supabase/seed.sql` with all 21 events from PLAN section 4 and apply it.
- [ ] 1.4 Create migration `003_replace_roster_fn.sql`: a Postgres function `replace_roster(rows jsonb)` that deletes all participants and inserts the new rows in one transaction. Make it run as the caller (security invoker) so RLS still applies.
- [ ] 1.5 In Supabase Auth settings, disable public sign ups. Create the single admin user in the dashboard (email + strong password).
- [ ] 1.6 Run the Supabase security advisor and fix any warnings.
- [ ] 1.7 Insert 3 to 5 fake test participants to use during development (mark them clearly as test data, delete before launch).

**Check:** `select count(*) from events` returns 21. Anonymous `insert` into `participants` is rejected. Anonymous `select` works.

---

## Phase 2: Public Roster Page (no theme yet)

**Goal:** Working data display with plain styling.

- [ ] 2.1 Add Supabase client helpers in `src/lib/supabase/` (browser client, server client).
- [ ] 2.2 Add `src/lib/events.ts` with category labels and a typed fetch function that returns events with their participants, sorted by `sort_order`, names A to Z.
- [ ] 2.3 Build `/` as a server component that lists every event and its names. Show participant count per event.
- [ ] 2.4 Empty state: show "No participants yet" for events with zero names (change if the owner decides otherwise, see PLAN open question 2).
- [ ] 2.5 Add `CategoryFilter` (All, Stage, Tech and Business, Creative, Esports, Games and Sports) and a simple name search box.
- [ ] 2.6 Set page revalidation so new uploads show up quickly (for example `revalidate = 60`, or call `revalidatePath('/')` after upload).

**Check:** Test data appears under the right events. Filter and search work. Page loads with no console errors.

---

## Phase 3: Admin Login and Protection

**Goal:** Only the admin can reach `/admin`.

- [ ] 3.1 Install `@supabase/ssr`. Add `src/middleware.ts` and `src/lib/supabase/middleware.ts` to refresh sessions.
- [ ] 3.2 Build `/admin/login` with email + password form and a clear error message for wrong credentials.
- [ ] 3.3 Protect `/admin`: redirect to `/admin/login` when not logged in.
- [ ] 3.4 Add a logout button on `/admin`.
- [ ] 3.5 Do not add any sign up page or link.

**Check:** Logged out visit to `/admin` redirects to login. Correct login lands on `/admin`. Logout works.

---

## Phase 4: CSV Upload

**Goal:** Admin can upload, preview, and confirm a roster.

- [ ] 4.1 Install `papaparse` (and its types). Create `src/lib/csv.ts` to parse and validate per PLAN section 6 (trim, collapse spaces, skip blanks, dedupe, match event by slug or name case-insensitively).
- [ ] 4.2 Build `CsvUploader` on `/admin`: file picker, parse in the browser, show a preview table with counts per event and a list of error rows.
- [ ] 4.3 Block the confirm button if the file has zero valid rows. Show a warning if some rows have errors, and say how many will be skipped.
- [ ] 4.4 Add a server action in `src/app/admin/actions.ts` that calls `replace_roster` through the logged-in admin session. Re-validate on the server, never trust the browser only.
- [ ] 4.5 After success, call `revalidatePath('/')` and show a success message with the total imported and a link to view the public page.
- [ ] 4.6 Add `public/sample.csv` and a "Download sample CSV" link. Add a small "Valid event names" list on the admin page.
- [ ] 4.7 Show "Last upload" time and current total participants on `/admin`.
- [ ] 4.8 Test edge cases: wrong event spelling, empty file, duplicate names, extra spaces, file with BOM, same person in two events, very long names.

**Check:** Uploading `sample.csv` updates the public page. A bad file shows clear errors and leaves the old roster unchanged.

---

## Phase 5: Retro One Piece x Marines Theme

**Goal:** Make it look great without making it complex.

- [ ] 5.1 Add fonts `Press Start 2P` and `VT323` using `next/font/google`.
- [ ] 5.2 Define colors in Tailwind config or CSS variables from PLAN section 8.
- [ ] 5.3 Build `Hero`: pixel title "CITE DAY 2026", "TEAM MARINES", "JUSTICE" banner, original SVG or CSS emblem, optional total participants count.
- [ ] 5.4 Restyle `EventCard` as a wanted-poster style card: parchment background, thick border, pixel shadow, category tag, count badge.
- [ ] 5.5 Style `CategoryFilter` as retro buttons (pressed state, pixel border).
- [ ] 5.6 Add light effects: CRT scanline overlay, wave divider, hover lift. Wrap motion in `prefers-reduced-motion`.
- [ ] 5.7 Apply the same theme to `/admin/login` and `/admin`.
- [ ] 5.8 Mobile pass: test at 360px, 390px, and desktop widths. Names must wrap cleanly.
- [ ] 5.9 Check text contrast on parchment and navy backgrounds.

**Check:** Looks consistent on phone and desktop. No official One Piece or Marine logos or images used.

---

## Phase 6: Polish and QA

**Goal:** Ready for real data.

- [ ] 6.1 Add page metadata: title "CITE DAY 2026 | Team Marines", description, favicon, and an Open Graph image (simple original design).
- [ ] 6.2 Add loading and error states for the public page and the upload flow.
- [ ] 6.3 Confirm in the Supabase dashboard that RLS is on for both tables and that anonymous writes fail.
- [ ] 6.4 Remove all test data. Run a final dry run with a realistic CSV (about 150 rows across all 21 events).
- [ ] 6.5 Run `npm run lint` and `npm run build` and fix all issues.
- [ ] 6.6 Write `README.md`: what the site is, how to run locally, env vars, and "How to upload a roster" in under 10 lines.

**Check:** Build passes. Dry run with a large CSV works and the page stays fast.

---

## Phase 7: Deploy to Vercel

**Goal:** Live site.

- [ ] 7.1 Push the repo to GitHub.
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
| | | |
