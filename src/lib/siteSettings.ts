import { supabase } from "@/lib/supabase";
import type { SiteSettingRow } from "@/types/database";

export type SettingGroup = "social" | "radio" | "ads" | "videos";
export type SettingInput = "url" | "text";

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
        description: "Aho YouTube channel yawe iherereye",
        group: "social",
        input: "url",
    },
    {
        key: "social_facebook",
        value: "https://www.facebook.com/profile.php?id=61589904326903",
        label: "Facebook",
        description: "Aho Facebook page yawe iherereye",
        group: "social",
        input: "url",
    },
    {
        key: "social_instagram",
        value: "https://www.instagram.com/rwandagospelnews/",
        label: "Instagram",
        description: "Aho Instagram account yawe iherereye",
        group: "social",
        input: "url",
    },
    {
        key: "social_twitter",
        value: "https://x.com/UrugeroR98356",
        label: "Twitter / X",
        description: "Aho Twitter/X account yawe iherereye",
        group: "social",
        input: "url",
    },
    {
        key: "radio_stream_url",
        value: DEFAULT_RADIO_STREAM_URL,
        label: "Live radio stream URL",
        description: "Stream ya radio ikoreshwa kuri player ya live radio",
        group: "radio",
        input: "url",
    },
    {
        key: "radio_station_name",
        value: "Urugero Live Radio",
        label: "Izina rya radio",
        description: "Izina rigaragara kuri live radio player",
        group: "radio",
        input: "text",
    },
    {
        key: "radio_embed_url",
        value: "https://urugerogospelradio.radio12345.com/",
        label: "Radio embed URL (webpage player)",
        description: "URL ya webpage ya radio (urugero radio12345 / listen2myradio). Izakoreshwa nka player yuzuye (iframe) ku rupapuro rubanza, ihindure stream nyayo. Siba niba ushaka gukoresha gusa stream itaziguye.",
        group: "radio",
        input: "url",
    },
    {
        key: "ad_home_top_image",
        value: "/ads/urugero-live-radio-banner.png",
        label: "Homepage banner ad image",
        description: "Ifoto ya ad igaragara hagati y'inkuru na live radio",
        group: "ads",
        input: "text",
    },
    {
        key: "ad_home_top_link",
        value: "/urugero-tv-radio",
        label: "Homepage banner ad link",
        description: "Aho umuntu ajya iyo akanze kuri banner ad",
        group: "ads",
        input: "text",
    },
    {
        key: "ad_home_sidebar_image",
        value: "/ads/urugero-media-square.png",
        label: "Sidebar ad image",
        description: "Ifoto ya ad igaragara muri sidebar yo ku rupapuro rubanza",
        group: "ads",
        input: "text",
    },
    {
        key: "ad_home_sidebar_link",
        value: "/contact",
        label: "Sidebar ad link",
        description: "Aho umuntu ajya iyo akanze kuri sidebar ad",
        group: "ads",
        input: "text",
    },
];

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
