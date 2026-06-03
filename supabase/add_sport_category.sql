-- Add required article categories to an existing Supabase project.
insert into public.categories (name, slug, color, nav_group, sort_order)
values
    ('Sport',            'sport',            '#047857', 'amakuru', 5),
    ('Inkuru yanjye',    'inkuru-yanjye',    '#B80000', 'amakuru', 7),
    ('Ibaruwa',          'ibaruwa',          '#7C2D12', 'amakuru', 8),
    ('Tumenye Bibiliya', 'tumenye-bibiliya', '#1E40AF', 'tumenye-bibiliya', 0),
    ('Urugero Music Academy', 'music-academy', '#7C3AED', 'media-group', 0),
    ('Urugero Films', 'films', '#B80000', 'media-group', 1),
    ('Urugero Records', 'records', '#1E40AF', 'media-group', 2),
    ('Urugero Music Talent', 'music-talent', '#F59E0B', 'media-group', 3),
    ('Urugero Online Radio', 'online-radio', '#059669', 'media-group', 4),
    ('Urugero Bible Quiz', 'bible-quiz', '#1E40AF', 'media-group', 5),
    ('Urugero Practice Room', 'practice-room', '#0891B2', 'media-group', 6),
    ('Urugero Podcast', 'podcast', '#7C3AED', 'media-group', 7)
on conflict (slug) do update set
    nav_group = excluded.nav_group,
    sort_order = excluded.sort_order;
