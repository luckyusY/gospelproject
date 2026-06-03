-- Add required article categories to an existing Supabase project.
insert into public.categories (name, slug, color, nav_group, sort_order)
values
    ('Sport',            'sport',            '#047857', 'amakuru', 5),
    ('Inkuru yanjye',    'inkuru-yanjye',    '#B80000', 'amakuru', 7),
    ('Ibaruwa',          'ibaruwa',          '#7C2D12', 'amakuru', 8),
    ('Tumenye Bibiliya', 'tumenye-bibiliya', '#1E40AF', 'tumenye-bibiliya', 0)
on conflict (slug) do update set
    nav_group = excluded.nav_group,
    sort_order = excluded.sort_order;
