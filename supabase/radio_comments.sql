-- Radio listener comments
-- Run in Supabase SQL Editor after schema.sql

create table if not exists public.radio_comments (
    id            bigint generated always as identity primary key,
    listener_name text not null,
    message       text not null,
    is_approved   boolean not null default true,
    created_at    timestamptz not null default now()
);

alter table public.radio_comments enable row level security;

drop policy if exists "read approved radio comments" on public.radio_comments;
create policy "read approved radio comments"
    on public.radio_comments for select
    using (is_approved = true);

drop policy if exists "service role writes radio comments" on public.radio_comments;
create policy "service role writes radio comments"
    on public.radio_comments
    using (false)
    with check (false);

create index if not exists radio_comments_created_at_idx
    on public.radio_comments (created_at desc);
