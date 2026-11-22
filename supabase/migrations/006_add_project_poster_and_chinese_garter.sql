insert into public.events (slug, name, category, division, sort_order) values
  ('project-poster', 'Project Poster', 'creative', 'open', 22),
  ('chinese-garter', 'Chinese Garter', 'games', 'open', 23)
on conflict (slug) do nothing;
