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
