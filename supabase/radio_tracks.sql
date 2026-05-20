-- Radio fallback tracks
-- Run in Supabase SQL Editor after schema.sql

create table if not exists public.radio_tracks (
    id           bigint generated always as identity primary key,
    title        text not null,
    file_url     text not null,
    storage_path text,
    is_active    boolean not null default true,
    sort_order   integer not null default 0,
    created_at   timestamptz not null default now()
);

alter table public.radio_tracks enable row level security;

drop policy if exists "read active radio tracks" on public.radio_tracks;
create policy "read active radio tracks"
    on public.radio_tracks for select
    using (is_active = true);

create index if not exists radio_tracks_sort_idx
    on public.radio_tracks (sort_order asc, created_at desc);
