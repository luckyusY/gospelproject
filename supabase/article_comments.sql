-- Article reader comments
-- Run this in the Supabase SQL Editor before using article comments in production.

create table if not exists public.article_comments (
    id           bigint generated always as identity primary key,
    article_id   bigint not null references public.articles(id) on delete cascade,
    author_name  text not null,
    author_email text,
    message      text not null,
    is_approved  boolean not null default false,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

create index if not exists article_comments_article_created_idx
    on public.article_comments (article_id, created_at desc);

create index if not exists article_comments_approval_created_idx
    on public.article_comments (is_approved, created_at desc);

alter table public.article_comments enable row level security;

drop policy if exists "read approved article comments" on public.article_comments;
create policy "read approved article comments"
    on public.article_comments for select
    using (is_approved = true);

drop policy if exists "service role manages article comments" on public.article_comments;
create policy "service role manages article comments"
    on public.article_comments
    using (false)
    with check (false);
