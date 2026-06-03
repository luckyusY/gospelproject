-- ============================================================
-- Urugero Media — "Content-driven" migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Safe to run multiple times (idempotent: create-if-not-exists,
-- add-column-if-not-exists, on-conflict-do-nothing, drop-policy-if-exists).
-- Requires the base schema (supabase/schema.sql) to have run first,
-- which creates public.set_updated_at().
-- ============================================================

-- ── 1. Extend categories into a hierarchy ────────────────────
alter table public.categories
    add column if not exists parent_id   bigint references public.categories(id) on delete set null,
    add column if not exists nav_group   text,
    add column if not exists icon        text,
    add column if not exists description text,
    add column if not exists hero_image  text,
    add column if not exists sort_order  integer not null default 0,
    add column if not exists show_in_nav boolean not null default true;

-- Existing Amakuru sub-categories
update public.categories set nav_group = 'amakuru'
 where slug in ('abahanzi','amakorali','amatorero','abanyempano','ibitaramo','sport','hanze-yu-rwanda','inkuru-yanjye','ibaruwa')
   and nav_group is null;

insert into public.categories (name, slug, color, nav_group, icon, description, sort_order) values
    ('Sport',            'sport',             '#047857', 'amakuru', null, 'Amakuru ya sport n''ibivugwa mu mikino.', 5),
    ('Inkuru yanjye',    'inkuru-yanjye',     '#B80000', 'amakuru', null, 'Inkuru n''ubuhamya bwihariye bw''abasomyi.', 7),
    ('Ibaruwa',          'ibaruwa',           '#7C2D12', 'amakuru', null, 'Amabaruwa, ibitekerezo n''ubutumwa bwubaka.', 8),
    ('Tumenye Bibiliya', 'tumenye-bibiliya',  '#1E40AF', 'tumenye-bibiliya', '📖', 'Inkuru, inyigisho n''ibisobanuro bifasha gusobanukirwa Bibiliya neza.', 0)
on conflict (slug) do update set
    nav_group = excluded.nav_group,
    sort_order = excluded.sort_order,
    description = coalesce(public.categories.description, excluded.description);

-- Inyigisho (teaching) sub-categories
insert into public.categories (name, slug, color, nav_group, icon, description, sort_order) values
    ('Umuryango',          'umuryango',       '#1E40AF', 'inyigisho', '👨‍👩‍👧', 'Inyigisho z''umuryango',            0),
    ('Abana',              'abana',            '#B80000', 'inyigisho', '👶',     'Inyigisho zigenewe abana',          1),
    ('Urubyiruko',         'urubyiruko',       '#7C3AED', 'inyigisho', '🌟',     'Inyigisho z''urubyiruko',           2),
    ('Abagabo',            'abagabo',          '#047857', 'inyigisho', '👔',     'Inyigisho z''abagabo',              3),
    ('Abagore',            'abagore',          '#DC2626', 'inyigisho', '👩',     'Inyigisho z''abagore',              4),
    ('Ubuzima bw''Umwuka', 'ubuzima-bwumwuka', '#0891B2', 'inyigisho', '🕊️',     'Inyigisho z''ubuzima bw''umwuka',   5)
on conflict (slug) do nothing;

update public.categories set nav_group = 'inyigisho'
 where slug in ('umuryango','abana','urubyiruko','abagabo','abagore','ubuzima-bwumwuka')
   and nav_group is distinct from 'inyigisho';

-- Give the existing Amakuru sub-categories a stable order + icons
update public.categories set sort_order = 0 where slug = 'abahanzi';
update public.categories set sort_order = 1 where slug = 'amakorali';
update public.categories set sort_order = 2 where slug = 'amatorero';
update public.categories set sort_order = 3 where slug = 'abanyempano';
update public.categories set sort_order = 4 where slug = 'ibitaramo';
update public.categories set sort_order = 5 where slug = 'sport';
update public.categories set sort_order = 6 where slug = 'hanze-yu-rwanda';
update public.categories set sort_order = 7 where slug = 'inkuru-yanjye';
update public.categories set sort_order = 8 where slug = 'ibaruwa';

-- ── 2. Pages (rich editable content pages) ───────────────────
create table if not exists public.pages (
    id           bigint generated always as identity primary key,
    slug         text not null unique,
    title        text not null,
    subtitle     text not null default '',
    hero_image   text,
    icon         text,
    color        text not null default '#B80000',
    content      text not null default '',
    nav_group    text,           -- e.g. 'media-group' for Urugero Media Group children
    is_published boolean not null default true,
    sort_order   integer not null default 0,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

drop trigger if exists pages_updated_at on public.pages;
create trigger pages_updated_at
    before update on public.pages
    for each row execute function public.set_updated_at();

-- Top-level standalone pages
insert into public.pages (slug, title, subtitle, icon, color, content, nav_group, sort_order) values
    ('abo-turibo', 'Abo Turibo', 'URUGERO MEDIA GROUP', '✝', '#B80000',
     '<p>Urugero Media Group ni urubuga rw''itangazamakuru rishingiye ku Ijambo ry''Imana, rugamije gukwirakwiza ubutumwa bwiza, inyigisho, ubuhamya n''indirimbo z''Imana mu Rwanda no ku isi yose.</p>',
     null, 0),
    ('ibigwi', 'Ibigwi', 'URUGERO MEDIA', '⭐', '#B80000',
     '<p>Ibigwi n''inkuru z''ibyamamare bya Gospel — abahanzi, abakozi b''Imana n''abandi bagize uruhare mu kwamamaza ubutumwa bwiza.</p>',
     null, 0),
    ('urugero-tv-radio', 'Urugero TV & Radio', 'AMASHUSHO N''AMAJWI', '📺', '#B80000',
     '<p>Reba ibiganiro, ubuhamya, sport n''amakuru ya Gospel kuri Urugero TV & Radio.</p>',
     null, 0),
    ('tumenye-bibiliya', 'Tumenye Bibiliya', 'IJAMBO RY''IMANA', '📖', '#1E40AF',
     '<p>Shakisha imirongo ya Bibiliya, wige Ijambo ry''Imana kandi umenye byinshi ku Byanditswe Byera.</p>',
     null, 0),
    ('urugero-media-group', 'Urugero Media Group', 'ABO TURIBO', '🎬', '#B80000',
     '<p>Urugero Media Group ihuza serivisi nyinshi: Music Academy, Films, Records, Online Radio, Bible Quiz n''ibindi.</p>',
     null, 0)
on conflict (slug) do nothing;

-- Urugero Media Group child pages
insert into public.pages (slug, title, subtitle, icon, color, content, nav_group, sort_order) values
    ('music-academy', 'Urugero Music Academy', 'URUGERO MEDIA GROUP', '🎵', '#7C3AED',
     '<p>Amasomo yo kwigisha indirimbo z''Imana: worship training, vocal n''ibikoresho by''umuziki.</p>', 'media-group', 0),
    ('films', 'Urugero Films', 'URUGERO MEDIA GROUP', '🎬', '#B80000',
     '<p>Gukora amashusho: Video Production, Editing, Event Coverage na Documentary.</p>', 'media-group', 1),
    ('records', 'Urugero Records', 'URUGERO MEDIA GROUP', '🎙️', '#1E40AF',
     '<p>Studio yo gufata amajwi no gukora umuziki w''Imana.</p>', 'media-group', 2),
    ('music-talent', 'Urugero Music Talent', 'URUGERO MEDIA GROUP', '🌟', '#F59E0B',
     '<p>Gushaka no guteza imbere impano mu muziki — talent search na competitions.</p>', 'media-group', 3),
    ('online-radio', 'Urugero Online Radio', 'URUGERO MEDIA GROUP', '📻', '#059669',
     '<p>Radio kuri internet: ibiganiro, umuziki n''inyigisho buri munsi.</p>', 'media-group', 4),
    ('bible-quiz', 'Urugero Bible Quiz', 'URUGERO MEDIA GROUP', '📖', '#1E40AF',
     '<p>Imikino y''ubumenyi bwa Bibiliya: amashuri, amatorero na porogaramu ya YouTube.</p>', 'media-group', 5),
    ('practice-room', 'Urugero Practice Room', 'URUGERO MEDIA GROUP', '🎹', '#0891B2',
     '<p>Aho kwitoza: rehearsals, training na sessions za YouTube.</p>', 'media-group', 6),
    ('podcast', 'Urugero Podcast', 'URUGERO MEDIA GROUP', '🎧', '#7C3AED',
     '<p>Ibiganiro, interviews n''impaka ku ngingo zinyuranye.</p>', 'media-group', 7)
on conflict (slug) do nothing;

-- ── 3. Videos (YouTube embeds, per section) ──────────────────
create table if not exists public.videos (
    id           bigint generated always as identity primary key,
    title        text not null,
    description  text not null default '',
    youtube_id   text not null,
    section      text not null default 'homepage',   -- 'homepage' | 'tv-radio'
    sort_order   integer not null default 0,
    is_published boolean not null default true,
    created_at   timestamptz not null default now()
);

create index if not exists videos_section_sort_idx
    on public.videos (section, sort_order asc, created_at desc);

insert into public.videos (title, description, youtube_id, section, sort_order)
select * from (values
    ('Amakuru mashya ya Gospel yo ku mugoroba', 'Amakuru ya Gospel yo mu Rwanda, Uganda no mu karere kuri Urugero Gospel News TV.', 'u5TFSRPjUdE', 'homepage', 0),
    ('Ibaruwa ifunguye: ubutumwa bwa Murokore', 'Ikiganiro cya Urugero TV ku bahanzi, ubuzima bwa Gospel n''ibivugwa mu bakunzi b''umuziki.', 'a1IfX2-RIrk', 'homepage', 1),
    ('Ibyahishwe: Vestine na Dorcas', 'Ikiganiro gisesengura amakuru ya Gospel n''ibitekerezo by''abakunzi ba Urugero TV & Radio.', 'j2mcUosjKKc', 'homepage', 2),
    ('Ibaruwa ifunguye ivuye ku mutima', 'Ikiganiro cyubaka ku rukundo, umuryango n''ubuzima bwa buri munsi.', 'BlhLoe_YYP4', 'homepage', 3),
    ('Ibiganiro bya Gospel na Sport', 'Amakuru n''ibiganiro byo kuri Urugero TV & Radio Official.', 'yhK2yce8kfs', 'homepage', 4),
    ('Inshundura Sports News', 'Amakuru ya sport n''ibivugwa mu mikino kuri Urugero TV.', 'hdcWJLKejn0', 'homepage', 5)
) as v(title, description, youtube_id, section, sort_order)
where not exists (select 1 from public.videos where section = 'homepage');

-- ── 4. Navigation menu items ─────────────────────────────────
create table if not exists public.nav_items (
    id          bigint generated always as identity primary key,
    label       text not null,
    href        text not null default '',
    parent_id   bigint references public.nav_items(id) on delete cascade,
    sort_order  integer not null default 0,
    is_mega     boolean not null default false,
    is_visible  boolean not null default true,
    created_at  timestamptz not null default now()
);

create index if not exists nav_items_sort_idx
    on public.nav_items (sort_order asc, id asc);

-- Seed the menu only if empty (mirrors the current hardcoded Header).
do $$
declare
    amakuru_id   bigint;
    inyigisho_id bigint;
    media_id     bigint;
begin
    if not exists (select 1 from public.nav_items) then
        insert into public.nav_items (label, href, sort_order) values ('Ahabanza', '/', 0);

        insert into public.nav_items (label, href, sort_order) values ('Amakuru', '/amakuru', 1)
            returning id into amakuru_id;
        insert into public.nav_items (label, href, parent_id, sort_order) values
            ('Abahanzi',         '/amakuru/abahanzi',        amakuru_id, 0),
            ('Amakorali',        '/amakuru/amakorali',       amakuru_id, 1),
            ('Amatorero',        '/amakuru/amatorero',       amakuru_id, 2),
            ('Abanyempano',      '/amakuru/abanyempano',     amakuru_id, 3),
            ('Ibitaramo',        '/amakuru/ibitaramo',       amakuru_id, 4),
            ('Sport',            '/amakuru/sport',           amakuru_id, 5),
            ('Hanze y''u Rwanda', '/amakuru/hanze-yu-rwanda', amakuru_id, 6),
            ('Inkuru yanjye',     '/amakuru/inkuru-yanjye',   amakuru_id, 7),
            ('Ibaruwa',           '/amakuru/ibaruwa',         amakuru_id, 8);

        insert into public.nav_items (label, href, sort_order) values ('Ubuhamya', '/ubuhamya', 2);
        insert into public.nav_items (label, href, sort_order) values ('Ibigwi', '/ibigwi', 3);

        insert into public.nav_items (label, href, sort_order) values ('Inyigisho', '/inyigisho', 4)
            returning id into inyigisho_id;
        insert into public.nav_items (label, href, parent_id, sort_order) values
            ('Umuryango',          '/inyigisho/umuryango',       inyigisho_id, 0),
            ('Abana',              '/inyigisho/abana',            inyigisho_id, 1),
            ('Urubyiruko',         '/inyigisho/urubyiruko',       inyigisho_id, 2),
            ('Abagabo',            '/inyigisho/abagabo',          inyigisho_id, 3),
            ('Abagore',            '/inyigisho/abagore',          inyigisho_id, 4),
            ('Ubuzima bw''Umwuka', '/inyigisho/ubuzima-bwumwuka', inyigisho_id, 5),
            ('Bible Quiz',         '/inyigisho/bible-quiz',       inyigisho_id, 6);

        insert into public.nav_items (label, href, sort_order) values ('Tumenye Bibiliya', '/tumenye-bibiliya', 5);
        insert into public.nav_items (label, href, sort_order) values ('Urugero TV & Radio', '/urugero-tv-radio', 6);

        insert into public.nav_items (label, href, is_mega, sort_order) values ('Urugero Media Group', '/urugero-media-group', true, 7)
            returning id into media_id;
        insert into public.nav_items (label, href, parent_id, sort_order) values
            ('🎵 Urugero Music Academy', '/urugero-media-group/music-academy', media_id, 0),
            ('🎬 Urugero Films',          '/urugero-media-group/films',         media_id, 1),
            ('🎙️ Urugero Records',        '/urugero-media-group/records',       media_id, 2),
            ('🌟 Urugero Music Talent',   '/urugero-media-group/music-talent',  media_id, 3),
            ('📻 Urugero Online Radio',   '/urugero-media-group/online-radio',  media_id, 4),
            ('📖 Urugero Bible Quiz',     '/urugero-media-group/bible-quiz',    media_id, 5),
            ('🎹 Urugero Practice Room',  '/urugero-media-group/practice-room', media_id, 6),
            ('🎧 Urugero Podcast',        '/urugero-media-group/podcast',       media_id, 7);

        insert into public.nav_items (label, href, sort_order) values ('Abo Turibo', '/abo-turibo', 8);
        insert into public.nav_items (label, href, sort_order) values ('Contact', '/contact', 9);
    end if;
end $$;

-- ── 5. Homepage sections (toggle + order) ────────────────────
do $$
declare
    amakuru_id bigint;
begin
    select id into amakuru_id
      from public.nav_items
     where parent_id is null and href = '/amakuru'
     order by id
     limit 1;

    if amakuru_id is not null then
        insert into public.nav_items (label, href, parent_id, sort_order)
        select 'Inkuru yanjye', '/amakuru/inkuru-yanjye', amakuru_id, 7
        where not exists (select 1 from public.nav_items where href = '/amakuru/inkuru-yanjye');

        insert into public.nav_items (label, href, parent_id, sort_order)
        select 'Ibaruwa', '/amakuru/ibaruwa', amakuru_id, 8
        where not exists (select 1 from public.nav_items where href = '/amakuru/ibaruwa');
    end if;
end $$;

create table if not exists public.homepage_sections (
    id         bigint generated always as identity primary key,
    key        text not null unique,
    label      text not null,
    is_enabled boolean not null default true,
    sort_order integer not null default 0
);

insert into public.homepage_sections (key, label, sort_order) values
    ('categories',  'Category filter strip',   0),
    ('hero',        'Hero stories + sidebar',  1),
    ('verse',       'Verse of the day',        2),
    ('latest',      'Latest stories',          3),
    ('testimonies', 'Testimonies',             4),
    ('videos',      'Featured videos',         5)
on conflict (key) do nothing;

-- ── 6. New site_settings singletons (verse + ticker) ─────────
insert into public.site_settings (key, value, label, description) values
    ('verse_text',
     'Kuko nzi imigambi ndimo ndibanza kuri wewe, ni Uhoraho uvuga, imigambi y''amahoro si iy''ibibazo, kugira ngo nkuhe amaherezo n''icyiringiro.',
     'Verse of the day text', 'Umurongo wa Bibiliya ugaragara ku rupapuro rubanza'),
    ('verse_reference', '— Yeremiya 29:11',
     'Verse reference', 'Aho umurongo uboneka muri Bibiliya'),
    ('ticker_lines',
     'Urugero Music Academy yarakoze ibitaramo by''abakunzi b''Imana mu Rwanda' || chr(10) ||
     'Urugero Online Radio ikomeza guturika n''amajwi y''Imana buri munsi' || chr(10) ||
     'Urugero Bible Quiz ifungura amashuri n''amatorero mu Rwanda hose',
     'Breaking-news ticker', 'Amakuru ahinduka hejuru ku rubuga — umurongo umwe = inkuru imwe')
on conflict (key) do nothing;

-- ── 7. Row Level Security for the new tables ─────────────────
alter table public.pages             enable row level security;
alter table public.videos            enable row level security;
alter table public.nav_items         enable row level security;
alter table public.homepage_sections enable row level security;

drop policy if exists "read published pages" on public.pages;
create policy "read published pages" on public.pages
    for select using (is_published = true);

drop policy if exists "read published videos" on public.videos;
create policy "read published videos" on public.videos
    for select using (is_published = true);

drop policy if exists "read nav items" on public.nav_items;
create policy "read nav items" on public.nav_items
    for select using (true);

drop policy if exists "read homepage sections" on public.homepage_sections;
create policy "read homepage sections" on public.homepage_sections
    for select using (true);
