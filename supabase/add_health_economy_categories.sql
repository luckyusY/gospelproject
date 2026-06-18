-- Add Ubuzima (Health) and Ubukungu (Economy) article categories.
-- Run this in the Supabase SQL Editor.
insert into public.categories (name, slug, color, nav_group, sort_order, description, show_in_nav)
values
    ('Ubuzima',  'ubuzima',  '#0D9488', 'amakuru',  9, 'Amakuru n''inama ku buzima bwiza bw''umubiri n''umutima.', true),
    ('Ubukungu', 'ubukungu', '#CA8A04', 'amakuru', 10, 'Amakuru y''ubukungu, ubucuruzi n''iterambere.', true)
on conflict (slug) do update set
    name        = excluded.name,
    color       = excluded.color,
    nav_group   = excluded.nav_group,
    sort_order  = excluded.sort_order,
    description = excluded.description,
    show_in_nav = excluded.show_in_nav;
