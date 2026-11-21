alter table public.events enable row level security;
alter table public.participants enable row level security;

-- events: anyone can select
create policy "events_select_public" on public.events
  for select to anon, authenticated using (true);

-- events: only authenticated can insert, update, delete
create policy "events_insert_auth" on public.events
  for insert to authenticated with check (true);

create policy "events_update_auth" on public.events
  for update to authenticated using (true) with check (true);

create policy "events_delete_auth" on public.events
  for delete to authenticated using (true);

-- participants: anyone can select
create policy "participants_select_public" on public.participants
  for select to anon, authenticated using (true);

-- participants: only authenticated can insert, update, delete
create policy "participants_insert_auth" on public.participants
  for insert to authenticated with check (true);

create policy "participants_update_auth" on public.participants
  for update to authenticated using (true) with check (true);

create policy "participants_delete_auth" on public.participants
  for delete to authenticated using (true);

-- grant access
grant select on public.events to anon, authenticated;
grant select on public.participants to anon, authenticated;
grant insert, update, delete on public.events to authenticated;
grant insert, update, delete on public.participants to authenticated;
