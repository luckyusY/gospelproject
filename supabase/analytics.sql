create table if not exists public.analytics_page_views (
    id bigserial primary key,
    path text not null,
    title text,
    referrer text,
    visitor_id text,
    session_id text,
    country text,
    user_agent text,
    ip_hash text,
    created_at timestamptz not null default now()
);

create index if not exists analytics_page_views_created_at_idx
    on public.analytics_page_views (created_at desc);

create index if not exists analytics_page_views_path_idx
    on public.analytics_page_views (path);

alter table public.analytics_page_views enable row level security;

drop policy if exists "Service role manages analytics page views" on public.analytics_page_views;
create policy "Service role manages analytics page views"
    on public.analytics_page_views
    for all
    using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');
