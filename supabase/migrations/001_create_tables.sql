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
