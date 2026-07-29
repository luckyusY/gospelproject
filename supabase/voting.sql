-- Talent / contest voting
-- Run this in the Supabase SQL Editor.

-- ── Contests ────────────────────────────────────────────────
create table if not exists public.contests (
    id           bigserial primary key,
    title        text not null,
    slug         text not null unique,
    description  text not null default '',
    image_url    text,
    is_active    boolean not null default true,   -- open for voting & visible publicly
    show_results boolean not null default true,   -- show live counts to voters
    ends_at      timestamptz,                      -- optional auto-close time
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

-- ── Entries (the contestants people vote for) ───────────────
create table if not exists public.contest_entries (
    id          bigserial primary key,
    contest_id  bigint not null references public.contests (id) on delete cascade,
    name        text not null,
    subtitle    text not null default '',
    image_url   text,
    youtube_id  text,
    vote_count  integer not null default 0,
    sort_order  integer not null default 0,
    created_at  timestamptz not null default now()
);

create index if not exists contest_entries_contest_id_idx
    on public.contest_entries (contest_id);

-- ── Votes (one row per cast vote) ───────────────────────────
create table if not exists public.contest_votes (
    id          bigserial primary key,
    contest_id  bigint not null references public.contests (id) on delete cascade,
    entry_id    bigint not null references public.contest_entries (id) on delete cascade,
    voter_id    text not null,            -- random per-browser id
    ip_hash     text,
    created_at  timestamptz not null default now(),
    unique (contest_id, voter_id)         -- one vote per browser per contest
);

create index if not exists contest_votes_entry_id_idx
    on public.contest_votes (entry_id);

-- ── Atomic vote: insert + bump cached count in one call ─────
create or replace function public.cast_contest_vote(
    p_contest_id bigint,
    p_entry_id   bigint,
    p_voter_id   text,
    p_ip_hash    text
) returns text language plpgsql as $$
begin
    insert into public.contest_votes (contest_id, entry_id, voter_id, ip_hash)
    values (p_contest_id, p_entry_id, p_voter_id, p_ip_hash);

    update public.contest_entries
       set vote_count = vote_count + 1
     where id = p_entry_id;

    return 'ok';
exception when unique_violation then
    return 'already_voted';
end;
$$;

-- ── Row level security ──────────────────────────────────────
alter table public.contests        enable row level security;
alter table public.contest_entries enable row level security;
alter table public.contest_votes   enable row level security;

-- Public can read contests and entries (anon key, for the public pages).
drop policy if exists "Public reads contests" on public.contests;
create policy "Public reads contests"
    on public.contests for select using (true);

drop policy if exists "Public reads contest entries" on public.contest_entries;
create policy "Public reads contest entries"
    on public.contest_entries for select using (true);

-- Everything else (writes, vote rows) is service-role only; the app writes
-- through server routes using the service key.
drop policy if exists "Service role manages contests" on public.contests;
create policy "Service role manages contests"
    on public.contests for all
    using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');

drop policy if exists "Service role manages contest entries" on public.contest_entries;
create policy "Service role manages contest entries"
    on public.contest_entries for all
    using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');

drop policy if exists "Service role manages contest votes" on public.contest_votes;
create policy "Service role manages contest votes"
    on public.contest_votes for all
    using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');
