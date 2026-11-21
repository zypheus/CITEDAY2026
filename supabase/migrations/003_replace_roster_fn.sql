create or replace function public.replace_roster(rows jsonb)
returns void
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  delete from public.participants;

  insert into public.participants (event_id, full_name)
  select
    e.id,
    trim(regexp_replace(r->>'full_name', '\s+', ' ', 'g')) as full_name
  from jsonb_array_elements(rows) as r
  join public.events e on (
    lower(trim(e.slug)) = lower(trim(r->>'event_slug'))
    or lower(trim(e.name)) = lower(trim(r->>'event_name'))
  )
  where trim(r->>'full_name') <> ''
  on conflict (event_id, full_name) do nothing;
end;
$$;

revoke execute on function public.replace_roster(jsonb) from public;
grant execute on function public.replace_roster(jsonb) to authenticated;
