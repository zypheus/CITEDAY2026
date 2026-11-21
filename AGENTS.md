# AGENTS.md

Source of truth: read PLAN.md first, then TASKS.md, before starting any work.

Agent rules:
- Work one phase at a time per TASKS.md.
- Never use em dashes. Use commas, periods, or colons instead.
- Never commit .env.local or any secrets.
- Ask before any destructive database action.
- Use apply_migration for schema changes and save each migration in supabase/migrations/.
- After schema changes, run security advisor and fix any warnings.
- Keep dependencies minimal. No UI kit.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
