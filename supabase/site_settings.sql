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
('social_twitter',   'https://twitter.com',                              'Twitter / X',    'Aho Twitter/X account yawe iherereye'),
('radio_stream_url', 'https://s11.citrus3.com:8604/stream',              'Live radio stream URL', 'Stream ya radio ikoreshwa kuri player ya live radio'),
('radio_station_name','Urugero Live Radio',                              'Izina rya radio', 'Izina rigaragara kuri live radio player'),
('ad_home_top_image','/ads/urugero-live-radio-banner.svg',               'Homepage banner ad image', 'Ifoto ya ad igaragara hagati y''inkuru na live radio'),
('ad_home_top_link', '/urugero-tv-radio',                                'Homepage banner ad link', 'Aho umuntu ajya iyo akanze kuri banner ad'),
('ad_home_sidebar_image','/ads/urugero-gospel-news-square.svg',          'Sidebar ad image', 'Ifoto ya ad igaragara muri sidebar yo ku rupapuro rubanza'),
('ad_home_sidebar_link','/contact',                                      'Sidebar ad link', 'Aho umuntu ajya iyo akanze kuri sidebar ad')
ON CONFLICT (key) DO NOTHING;
