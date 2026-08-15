-- Admin-created dashboard accounts. Run in Supabase Dashboard -> SQL Editor.
create table if not exists public.admin_users (
    id uuid primary key default gen_random_uuid(),
    username text not null unique check (username = lower(username)),
    display_name text not null,
    role text not null default 'journalist' check (role in ('admin', 'journalist')),
    password_hash text not null,
    is_active boolean not null default true,
    created_by text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- No browser policies are created. Only the server service-role client can
-- read password hashes or manage dashboard accounts.

create or replace function public.set_admin_users_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists admin_users_updated_at on public.admin_users;
create trigger admin_users_updated_at
    before update on public.admin_users
    for each row execute function public.set_admin_users_updated_at();
