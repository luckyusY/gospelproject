-- ── Newsletter subscribers ───────────────────────────────
-- Run in Supabase SQL Editor after schema.sql

create table if not exists public.subscribers (
    id           bigint generated always as identity primary key,
    email        text not null unique,
    name         text,
    is_confirmed boolean not null default false,
    token        text not null default gen_random_uuid()::text,
    created_at   timestamptz not null default now()
);

alter table public.subscribers enable row level security;

-- Only service role can read/write subscribers
create policy "service role only subscribers"
    on public.subscribers
    using (false);
