-- Add the Sport news category to an existing Supabase project.
insert into public.categories (name, slug, color)
values ('Sport', 'sport', '#047857')
on conflict (slug) do nothing;
