create or replace function public.replace_event_roster(p_event_id uuid, p_names text[])
returns int
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  inserted_count int;
begin
  delete from public.participants where event_id = p_event_id;

  with ins as (
    insert into public.participants (event_id, full_name)
    select p_event_id, trim(regexp_replace(name, '\s+', ' ', 'g'))
    from unnest(p_names) as name
    where trim(name) <> ''
    on conflict (event_id, full_name) do nothing
    returning 1
  )
  select count(*) into inserted_count from ins;

  return inserted_count;
end;
$$;

create or replace function public.append_event_roster(p_event_id uuid, p_names text[])
returns int
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  inserted_count int;
begin
  with ins as (
    insert into public.participants (event_id, full_name)
    select p_event_id, trim(regexp_replace(name, '\s+', ' ', 'g'))
    from unnest(p_names) as name
    where trim(name) <> ''
    on conflict (event_id, full_name) do nothing
    returning 1
  )
  select count(*) into inserted_count from ins;

  return inserted_count;
end;
$$;

revoke execute on function public.replace_event_roster(uuid, text[]) from public;
grant execute on function public.replace_event_roster(uuid, text[]) to authenticated;

revoke execute on function public.append_event_roster(uuid, text[]) from public;
grant execute on function public.append_event_roster(uuid, text[]) to authenticated;
