-- ============================================================
-- Site Settings table — run in Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
    key         text PRIMARY KEY,
    value       text NOT NULL DEFAULT '',
    label       text NOT NULL DEFAULT '',
    description text,
    updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings (footer, header, etc.)
CREATE POLICY "read site settings"
    ON public.site_settings FOR SELECT
    USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_settings_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION public.set_settings_updated_at();

-- Seed initial values
INSERT INTO public.site_settings (key, value, label, description) VALUES
('social_youtube',   'https://youtube.com',                              'YouTube',        'Aho YouTube channel yawe iherereye'),
('social_facebook',  'https://facebook.com',                             'Facebook',       'Aho Facebook page yawe iherereye'),
('social_instagram', 'https://www.instagram.com/rwandagospelnews/',      'Instagram',      'Aho Instagram account yawe iherereye'),
('social_twitter',   'https://twitter.com',                              'Twitter / X',    'Aho Twitter/X account yawe iherereye')
ON CONFLICT (key) DO NOTHING;
