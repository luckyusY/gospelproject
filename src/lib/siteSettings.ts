import { supabase } from "@/lib/supabase";
import type { SiteSettingRow } from "@/types/database";

export type SettingGroup = "social" | "radio" | "ads" | "videos" | "homepage";
export type SettingInput = "url" | "text" | "textarea";

export type SettingDefinition = {
    key: string;
    value: string;
    label: string;
    description: string;
    group: SettingGroup;
    input: SettingInput;
};

export const DEFAULT_RADIO_STREAM_URL = "https://s11.citrus3.com:8604/stream";

export const SETTING_DEFINITIONS: SettingDefinition[] = [
    {
        key: "social_youtube",
        value: "https://www.youtube.com/@Urugerotv-r4o",
        label: "YouTube",
        description: "Link to your YouTube channel",
        group: "social",
        input: "url",
    },
    {
        key: "social_facebook",
        value: "https://www.facebook.com/profile.php?id=61589904326903",
        label: "Facebook",
        description: "Link to your Facebook page",
        group: "social",
        input: "url",
    },
    {
        key: "social_instagram",
        value: "https://www.instagram.com/rwandagospelnews/",
        label: "Instagram",
        description: "Link to your Instagram account",
        group: "social",
        input: "url",
    },
    {
        key: "social_twitter",
        value: "https://x.com/UrugeroR98356",
        label: "Twitter / X",
        description: "Link to your Twitter / X account",
        group: "social",
        input: "url",
    },
    {
        key: "radio_stream_url",
        value: DEFAULT_RADIO_STREAM_URL,
        label: "Live radio stream URL",
        description: "The direct audio stream used by the live radio player (e.g. a Zeno.fm stream URL)",
        group: "radio",
        input: "url",
    },
    {
        key: "radio_station_name",
        value: "Urugero Live Radio",
        label: "Radio station name",
        description: "The name shown on the live radio player",
        group: "radio",
        input: "text",
    },
    {
        key: "radio_embed_url",
        value: "",
        label: "Radio embed URL (webpage player)",
        description: "Optional: a radio web page URL (e.g. radio12345 / listen2myradio) to embed as an iframe player on the homepage. Leave empty if you use a direct stream URL above (recommended).",
        group: "radio",
        input: "url",
    },
    {
        key: "ad_home_top_image",
        value: "/ads/urugero-live-radio-banner.png",
        label: "Homepage banner ad image",
        description: "Ad image shown between the stories and the live radio",
        group: "ads",
        input: "text",
    },
    {
        key: "ad_home_top_link",
        value: "/urugero-tv-radio",
        label: "Homepage banner ad link",
        description: "Where the banner ad links to",
        group: "ads",
        input: "text",
    },
    {
        key: "ad_home_sidebar_image",
        value: "/ads/urugero-media-square.png",
        label: "Sidebar ad image",
        description: "Ad image shown in the homepage sidebar",
        group: "ads",
        input: "text",
    },
    {
        key: "ad_home_sidebar_link",
        value: "/contact",
        label: "Sidebar ad link",
        description: "Where the sidebar ad links to",
        group: "ads",
        input: "text",
    },
    {
        key: "verse_text",
        value: "Kuko nzi imigambi ndimo ndibanza kuri wewe, ni Uhoraho uvuga, imigambi y'amahoro si iy'ibibazo, kugira ngo nkuhe amaherezo n'icyiringiro.",
        label: "Verse of the day — text",
        description: "The Bible verse shown in the 'Ijambo ry'umunsi' block on the homepage",
        group: "homepage",
        input: "textarea",
    },
    {
        key: "verse_reference",
        value: "— Yeremiya 29:11",
        label: "Verse of the day — reference",
        description: "Where the verse is found (e.g. — Yeremiya 29:11)",
        group: "homepage",
        input: "text",
    },
    {
        key: "ticker_lines",
        value: [
            "Urugero Music Academy yarakoze ibitaramo by'abakunzi b'Imana mu Rwanda",
            "Urugero Online Radio ikomeza guturika n'amajwi y'Imana buri munsi",
            "Urugero Bible Quiz ifungura amashuri n'amatorero mu Rwanda hose",
        ].join("\n"),
        label: "Breaking-news ticker",
        description: "Lines shown in the scrolling breaking-news bar. One line per news item.",
        group: "homepage",
        input: "textarea",
    },
];

/** Split a newline-separated setting (e.g. ticker_lines) into trimmed, non-empty lines. */
export function settingLines(value: string | undefined): string[] {
    return (value ?? "")
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);
}

export type SiteSettingsMap = Record<string, string>;

export function defaultsAsSettingsMap(): SiteSettingsMap {
    return Object.fromEntries(SETTING_DEFINITIONS.map(setting => [setting.key, setting.value]));
}

export function mergeSettings(rows: Pick<SiteSettingRow, "key" | "value">[] = []): SiteSettingsMap {
    const settings = defaultsAsSettingsMap();
    rows.forEach(row => {
        if (row.value) settings[row.key] = row.value;
    });
    return settings;
}

export function settingsWithDefaults(rows: SiteSettingRow[] = []): SiteSettingRow[] {
    const byKey = new Map(rows.map(row => [row.key, row]));
    return SETTING_DEFINITIONS.map(definition => {
        const row = byKey.get(definition.key);
        return {
            key: definition.key,
            value: row?.value || definition.value,
            label: row?.label || definition.label,
            description: row?.description || definition.description,
            updated_at: row?.updated_at || new Date(0).toISOString(),
        };
    });
}

export async function getPublicSiteSettings() {
    const { data } = await supabase
        .from("site_settings")
        .select("key, value");

    return mergeSettings((data ?? []) as Pick<SiteSettingRow, "key" | "value">[]);
}

export function settingDefinitionFor(key: string) {
    return SETTING_DEFINITIONS.find(setting => setting.key === key);
}
