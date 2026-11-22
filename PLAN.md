# PLAN.md: CITE DAY 2026 Marines Roster Site

> Audience: AI coding agents (Claude Code, Codex, OpenCode, Hermes) and the human owner (Lloyd).
> Read this file first, then read `TASKS.md`. Work one task at a time and stop after each phase for review.

## 1. Project Summary

**Plain English:** A small public website that shows who from team MARINES is joining each competition at CITE DAY 2026. One admin uploads a CSV of names. Everyone else just views the page. No pictures, no logins for visitors.

| Item | Value |
|---|---|
| Event | CITE DAY 2026 |
| Theme | One Piece |
| Team shown | MARINES only (other teams: Pirates, Fishman, Army are out of scope) |
| Hosting | Vercel |
| Backend | Supabase (Postgres + Auth) |
| Dev tooling | Supabase MCP server |
| Users | 1 admin (upload) + public visitors (read only) |
| Data | Participant names only, grouped by event |

## 2. Goals and Non-Goals

**Goals**
- Public page listing every event with the Marines participants under it.
- Admin page (login required) to upload a CSV and update the roster.
- Retro One Piece x Marines look (navy and white, wanted-poster style, pixel text).
- Simple, cheap, easy to maintain.

**Non-Goals (do NOT build these)**
- Photos or avatars.
- Multiple admins, roles, or public sign up.
- Other teams' rosters, scoring, brackets, or live results.
- Complex animation or heavy dependencies.

## 3. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js (App Router, TypeScript) | Works well on Vercel |
| Styling | Tailwind CSS + a few custom CSS classes | Fast, small, easy retro theming |
| Database | Supabase Postgres | Free tier is enough |
| Auth | Supabase Auth (email + password, one admin user) | Simple and secure |
| CSV parsing | `papaparse` | Small and reliable |
| Fonts | Google Fonts: `Press Start 2P` (headings), `VT323` (body) | Retro feel |
| Hosting | Vercel (connect GitHub repo) | Auto deploy |

Keep dependencies minimal. Do not add a UI kit.

## 4. Event List (seed data)

Store these exactly. `sort_order` follows this order. `slug` is lowercase with hyphens.

| # | Name | Slug | Category | Division |
|---|---|---|---|---|
| 1 | Cheering | cheering | performing | open |
| 2 | Street Dance | street-dance | performing | open |
| 3 | Cosplay | cosplay | performing | open |
| 4 | Tech Talk | tech-talk | tech | open |
| 5 | Start Up Pitching | start-up-pitching | tech | open |
| 6 | Programming | programming | tech | open |
| 7 | Hackathon | hackathon | tech | open |
| 8 | Typing Master | typing-master | tech | open |
| 9 | Logo Making | logo-making | creative | open |
| 10 | Video Editing | video-editing | creative | open |
| 11 | Artistic Photography | artistic-photography | creative | open |
| 12 | Mobile Legends (Male) | mobile-legends-male | esports | male |
| 13 | Mobile Legends (Female) | mobile-legends-female | esports | female |
| 14 | CODM (Male) | codm-male | esports | male |
| 15 | CODM (Female) | codm-female | esports | female |
| 16 | Crossfire (Mix) | crossfire-mix | esports | mix |
| 17 | Block Blast | block-blast | esports | open |
| 18 | Amazing Race | amazing-race | games | open |
| 19 | Squid Game | squid-game | games | open |
| 20 | Sack Race | sack-race | games | open |
| 21 | Big Volleyball | big-volleyball | games | open |
| 22 | Project Poster | project-poster | creative | open |
| 23 | Chinese Garter | chinese-garter | games | open |

Category display labels: performing = "Stage", tech = "Tech and Business", creative = "Creative", esports = "Esports", games = "Games and Sports".

## 5. Data Model

Two tables. Keep it boring.

```sql
create table public.events (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  category    text not null check (category in ('performing','tech','creative','esports','games')),
  division    text not null default 'open' check (division in ('open','male','female','mix')),
  sort_order  int  not null
);

create table public.participants (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references public.events(id) on delete cascade,
  full_name   text not null,
  created_at  timestamptz not null default now(),
  unique (event_id, full_name)
);

create index participants_event_id_idx on public.participants(event_id);
```

There is no `team` column because this site is Marines only.

### Row Level Security (RLS)
- Enable RLS on both tables.
- `events`: anyone can `select`. Only `authenticated` can insert, update, delete.
- `participants`: anyone can `select`. Only `authenticated` can insert, update, delete.
- Public sign up must be **disabled** in Supabase Auth settings. The one admin user is created manually in the Supabase dashboard.
- Never expose the `service_role` key to the browser. Prefer the logged-in admin session for writes so the service key is not needed at all.

## 6. CSV Format

Two columns, header row required, UTF-8.

```csv
event,name
Cheering,Juan Dela Cruz
Cheering,Maria Santos
Mobile Legends (Male),Pedro Reyes
Crossfire (Mix),Ana Lopez
```

Rules the importer must follow:
- Match `event` to an event by `slug` or by `name`, case-insensitive, trimmed.
- Trim spaces, collapse repeated spaces in names.
- Skip blank rows. Remove duplicates within the file.
- Rows with an unknown event are reported as errors and are NOT imported.
- Show a **preview** (counts per event, list of errors) before saving.
- Import mode: **Replace all**. On confirm, delete all existing participants then insert the new rows, inside one database transaction (use a Postgres function via RPC) so a failed upload never leaves the roster half empty.
- Offer a downloadable `sample.csv` and an "events list" so the admin spells events correctly.

## 7. Pages and Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Hero banner, category filter, event cards with participant names, search box |
| `/events/[slug]` | Public | Optional detail page for one event (can be skipped in v1) |
| `/admin/login` | Public | Email + password login |
| `/admin` | Admin only | Upload CSV, preview, confirm, see last upload time and totals |

Redirect any unauthenticated visit to `/admin` over to `/admin/login`. Use Supabase SSR helpers (`@supabase/ssr`) with middleware to guard `/admin`.

## 8. Design Direction

**Vibe:** retro arcade meets a Marines recruitment board, with a One Piece "Wanted poster" feel.

- **Palette:** Navy `#0B1F3A`, Marine blue `#1E4D8C`, off-white `#F4EFE0`, parchment `#E8D9B0`, accent red `#C8312B`, gold `#E0B040`.
- **Fonts:** `Press Start 2P` for titles and labels, `VT323` for names and body text.
- **Hero:** big pixel title "CITE DAY 2026", subtitle "TEAM MARINES", tagline "JUSTICE" in a banner. Use a simple original CSS or SVG anchor or seagull-style emblem.
- **Event cards:** parchment "wanted poster" look with a thick dark border, event name on top, category tag, participant count, names listed below. Slight pixel drop shadow.
- **Effects (keep light):** subtle CRT scanline overlay with CSS, wave pattern divider, hover lift on cards.
- **Accessibility:** keep text contrast readable, respect `prefers-reduced-motion`, make it mobile first (most visitors will use phones).
- **Copyright note:** do not copy official One Piece or Marine logos, characters, or images. Use original shapes, colors, and wording inspired by the theme.

## 9. Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Set the same two variables in Vercel (Project Settings > Environment Variables). Do not commit `.env.local`. Add `.env.example` with empty values.

## 10. Supabase MCP Workflow

**Plain English:** The MCP lets the AI agent talk to your Supabase project directly (create tables, run SQL, check data) instead of you copying and pasting.

Setup:
1. Create a new Supabase project for this site (name it something like `cite-day-2026`).
2. Add the Supabase MCP server to your agent, scoped to that single project. The hosted server URL looks like `https://mcp.supabase.com/mcp?project_ref=<PROJECT_REF>`. Follow the current Supabase MCP docs for your specific agent, since the setup command differs per tool.
3. Authenticate when prompted.

Safety rules for agents:
- Use the MCP only on this project, never on another one.
- Use migrations (`apply_migration`) for schema changes so they are tracked. Save a copy of every migration in `supabase/migrations/` in the repo.
- Show the SQL to the user and wait for approval before running anything destructive (`drop`, `delete`, `truncate`).
- After creating tables, run the Supabase security advisor check and fix any RLS warnings.
- Do not paste secrets or keys into chat output or committed files.

## 11. Project Structure (target)

```
cite-day-2026/
  AGENTS.md
  PLAN.md
  TASKS.md
  .env.example
  supabase/
    migrations/
    seed.sql
  public/
    sample.csv
  src/
    app/
      layout.tsx
      page.tsx
      globals.css
      admin/
        login/page.tsx
        page.tsx
        actions.ts
    components/
      Hero.tsx
      EventCard.tsx
      CategoryFilter.tsx
      CsvUploader.tsx
    lib/
      supabase/{client.ts,server.ts,middleware.ts}
      csv.ts
      events.ts
    middleware.ts
```

## 12. Definition of Done (v1)

- [ ] Public page shows all 23 events with Marines names, readable on a phone.
- [ ] Admin can log in, upload a valid CSV, preview it, confirm, and see the public page update.
- [ ] Bad CSV rows are reported clearly and never break the roster.
- [ ] Non-admin visitors cannot write to the database (verified).
- [ ] Deployed on Vercel with env vars set.
- [ ] Retro One Piece x Marines theme applied consistently.
- [ ] `README.md` explains how to upload a roster in under 10 lines.

## 13. Assumptions (confirm or change)

1. "Replace all" is the upload mode. An "Add and update" mode can come later.
2. A person may appear in several events (for example one name in both Cheering and Programming).
3. Names are shown as typed in the CSV, no sorting by surname unless asked.
4. Participants within an event are sorted A to Z.
5. No separate "team name" input is needed. The site title already says Marines.
6. Admin account is created manually in Supabase. There is no "forgot password" flow in v1 (reset from the Supabase dashboard).

## 14. Open Questions for Lloyd

1. Do you want a count of total Marines participants shown in the hero?
2. Should events with zero names show "No participants yet" or be hidden?
3. Will the CSV come with one name per row (as planned) or one row per event with names in one cell?
4. Do you want a schedule or venue field per event later?
