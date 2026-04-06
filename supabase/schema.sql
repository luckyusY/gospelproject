-- ============================================================
-- Urugero Media Group — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
create extension if not exists "unaccent";

-- ── Categories ───────────────────────────────────────────────
create table if not exists public.categories (
    id         bigint generated always as identity primary key,
    name       text not null,
    slug       text not null unique,
    color      text not null default '#1E40AF',
    created_at timestamptz not null default now()
);

insert into public.categories (name, slug, color) values
    ('Abahanzi',         'abahanzi',         '#7C3AED'),
    ('Amakorali',        'amakorali',         '#059669'),
    ('Amatorero',        'amatorero',         '#1E40AF'),
    ('Abanyempano',      'abanyempano',       '#DC2626'),
    ('Ibitaramo',        'ibitaramo',         '#F59E0B'),
    ('Hanze y''u Rwanda','hanze-yu-rwanda',   '#0D1B2E'),
    ('Ubuhamya',         'ubuhamya',          '#DC2626'),
    ('Inyigisho',        'inyigisho',         '#1E40AF')
on conflict (slug) do nothing;

-- ── Articles ─────────────────────────────────────────────────
create table if not exists public.articles (
    id             bigint generated always as identity primary key,
    title          text not null,
    slug           text not null unique,
    excerpt        text not null default '',
    content        text not null default '',
    image_url      text,
    category       text not null references public.categories(slug) on update cascade,
    category_color text not null default '#1E40AF',
    author         text not null default 'Urugero Media',
    author_avatar  text,
    read_time      text not null default '3 min',
    is_published   boolean not null default false,
    is_featured    boolean not null default false,
    published_at   timestamptz,
    created_at     timestamptz not null default now(),
    updated_at     timestamptz not null default now()
);

-- auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger articles_updated_at
    before update on public.articles
    for each row execute function public.set_updated_at();

-- ── Events ───────────────────────────────────────────────────
create table if not exists public.events (
    id           bigint generated always as identity primary key,
    title        text not null,
    slug         text not null unique,
    description  text not null default '',
    content      text,
    image_url    text,
    event_date   date not null,
    location     text not null default 'Kigali, Rwanda',
    price        text,
    is_free      boolean not null default true,
    tag          text not null default 'Inteko',
    is_published boolean not null default false,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

create trigger events_updated_at
    before update on public.events
    for each row execute function public.set_updated_at();

-- ── Testimonies ──────────────────────────────────────────────
create table if not exists public.testimonies (
    id             bigint generated always as identity primary key,
    title          text not null,
    slug           text not null unique,
    excerpt        text not null default '',
    content        text not null default '',
    person_name    text not null,
    person_church  text,
    person_avatar  text,
    image_url      text,
    is_published   boolean not null default false,
    is_featured    boolean not null default false,
    published_at   timestamptz,
    created_at     timestamptz not null default now(),
    updated_at     timestamptz not null default now()
);

create trigger testimonies_updated_at
    before update on public.testimonies
    for each row execute function public.set_updated_at();

-- ── Row Level Security ────────────────────────────────────────
-- Public can read published content; writes require service role key.
alter table public.categories  enable row level security;
alter table public.articles     enable row level security;
alter table public.events       enable row level security;
alter table public.testimonies  enable row level security;

-- Anyone can read published articles
create policy "read published articles"
    on public.articles for select
    using (is_published = true);

-- Anyone can read published events
create policy "read published events"
    on public.events for select
    using (is_published = true);

-- Anyone can read published testimonies
create policy "read published testimonies"
    on public.testimonies for select
    using (is_published = true);

-- Anyone can read categories
create policy "read categories"
    on public.categories for select
    using (true);

-- ── Storage bucket for media uploads ─────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Allow public reads from media bucket
create policy "public media read"
    on storage.objects for select
    using (bucket_id = 'media');

-- Allow service role (admin) to upload
create policy "admin media upload"
    on storage.objects for insert
    with check (bucket_id = 'media');

-- ── Sample seed data ─────────────────────────────────────────
insert into public.articles
    (title, slug, excerpt, content, image_url, category, category_color, author, read_time, is_published, is_featured, published_at)
values
(
    'Urugero Music Academy ifungura amashuri mashya',
    'urugero-music-academy-ifungura-amashuri-mashya',
    'Urugero Music Academy yatangije porogaramu nshya zo kwigisha indirimbo z''Imana mu Rwanda hose.',
    '## Intangiriro\n\nUrugero Music Academy ifungura amashuri mashya y''indirimbo z''Imana mu mujyi wa Kigali.\n\nIyi porogaramu igamije gutegura abaririmbye bazashyigikira amatorero mu Rwanda.\n\n## Ibisobanuro\n\nAmasomo azatangira tariki ya 1 Kamena 2026. Abifuza kwiyandikisha barashobora gukoresha urupapuro rwandikiwe hano.',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    'abahanzi',
    '#7C3AED',
    'Urugero Media',
    '4 min',
    true,
    true,
    now()
),
(
    'Ibitaramo by''Urugero birakomeje gutinda abantu benshi',
    'ibitaramo-by-urugero-birakomeje',
    'Ibitaramo by''Urugero Media byagiranye abantu barenga 2000 i Kigali mu kwezi gushize.',
    '## Ibitaramo by''Urugero\n\nIbitaramo by''ubuhamya byateguwe na Urugero Media byagiranye abantu 2000+ i Kigali.\n\nAbaririmbye benshi b''u Rwanda baje gushyigikira iyi nteko nziza.\n\n## Amafoto n''amashusho\n\nAmafoto yose azabonetse kuri YouTube ya Urugero Media.',
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800&auto=format&fit=crop',
    'ibitaramo',
    '#F59E0B',
    'Urugero Media',
    '3 min',
    true,
    false,
    now()
),
(
    'Inyigisho ku Gukunda Imana: Amateka ya Yobu',
    'inyigisho-gukunda-imana-yobu',
    'Inyigisho nziza ku gitabo cya Yobu igaragaza uburyo twashobora kwizera Imana no mu bihe bikomeye.',
    '## Inyigisho\n\nYobu yari umuntu w''ukuri kandi w''ubutungane. Nyamara Imana yemereye Satani kumugwa no kumugirira nabi...\n\n## Icyigwa\n\nNubwo Yobu yahangayikaga, yakomeje kwizera Imana kandi yarongewe ibyiza. Niyo nzira y''ukwizera nyakuri.',
    'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop',
    'inyigisho',
    '#1E40AF',
    'Pasteri wa Urugero',
    '8 min',
    true,
    false,
    now()
),
(
    'Amakorali 10 Azwi Cyane Mu Rwanda Muri 2026',
    'amakorali-10-azwi-mu-rwanda-2026',
    'Reba urutonde rw''amakorali azwi cyane mu Rwanda ari hafi kurekura indirimbo nshya.',
    '## Amakorali azwi\n\nMu Rwanda hari amakorali menshi akora indirimbo z''Imana nziza cyane.\n\n1. Remnant Choir\n2. ADEPR Choir\n3. EER Kigali Choir\n...\n\n## Indirimbo nshya\n\nAmakorali menshi agenda ateguye amasezerano mashya y''indirimbo.',
    'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=800&auto=format&fit=crop',
    'amakorali',
    '#059669',
    'Urugero Music',
    '7 min',
    true,
    false,
    now()
)
on conflict (slug) do nothing;

insert into public.events
    (title, slug, description, image_url, event_date, location, is_free, tag, is_published)
values
(
    'Urugero Worship Night',
    'urugero-worship-night-2026',
    'Ijoro ry''indirimbo z''uburambe bw''Imana. Twese hamwe mu gusenga no gusingiza.',
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800&auto=format&fit=crop',
    '2026-05-15',
    'Kigali Convention Centre',
    true,
    'Indirimbo',
    true
),
(
    'Urugero Bible Quiz — Igice cya 1',
    'urugero-bible-quiz-igice-1',
    'Imikino yo gusuzuma ubumenyi bw''Ibyanditswe Byera. Amashuri n''amatorero bishyira hamwe.',
    'https://images.unsplash.com/photo-1544531585-9847b68c8c86?q=80&w=800&auto=format&fit=crop',
    '2026-06-01',
    'Amahoro Stadium, Kigali',
    true,
    'Bible Quiz',
    true
),
(
    'Urugero Music Academy — Kwiyandikisha 2026',
    'urugero-music-academy-kwiyandikisha-2026',
    'Kwiyandikisha mu mashuri mashya y''Urugero Music Academy — Vocal, Piano, Indirimbo z''Imana.',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
    '2026-07-01',
    'Urugero Media Center, Kigali',
    false,
    'Amashuri',
    true
)
on conflict (slug) do nothing;

insert into public.testimonies
    (title, slug, excerpt, content, image_url, person_name, person_church, is_published, is_featured, published_at)
values
(
    'Imana yambukije indwara ikomeye',
    'imana-yambukije-indwara-ikomeye',
    'Nyuma y''imyaka 3 ndi mu ndwara z''igifu, Imana yarambukije burundu.',
    '## Ubuhamya bwanjye\n\nNyuma y''imyaka 3 ndi mu ndwara z''igifu, Imana yarambukije burundu. Nabonye ubuvuzi bw''Imana nyuma yo gusenga n''amatorero.\n\nNshimira Urugero Media bantondeye aha gutanga ubuhamya bwanjye kugira ngo n''abandi bakomeze kwizera.',
    'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=800&auto=format&fit=crop',
    'Marie Uwase',
    'ADEPR Kimironko',
    true,
    true,
    now()
),
(
    'Imana Yangaragarije Inzira nyuma y''ibihe bikomeye',
    'imana-yangaragarije-inzira',
    'Nyuma yo guhomba akazi kange, Imana yangaragarije inzira nshya y''iterambere.',
    '## Ubuhamya\n\nNyuma yo guhomba akazi kange mu 2024, nabonye ibibazo bikomeye. Ariko Imana yamporeye amahoro...\n\nNyuma y''amezi 6, nabonetse akazi gashya maze nkagira igihe cyo gukorera Imana mu Urugero Media.',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    'Jean Claude Nzeyimana',
    'Eglise Vivante Remera',
    true,
    false,
    now()
)
on conflict (slug) do nothing;
