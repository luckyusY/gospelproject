"use client";

import { useEffect, useState } from "react";
import {
    FacebookLogo,
    ImageSquare,
    InstagramLogo,
    RadioButton,
    TwitterLogo,
    YoutubeLogo,
} from "@phosphor-icons/react";
import styles from "../form.module.css";
import settStyles from "./settings.module.css";
import { SETTING_DEFINITIONS, type SettingGroup } from "@/lib/siteSettings";

type Setting = { key: string; value: string; label: string; description?: string | null };
type SettingsResponse = Setting[] | { error?: string; warning?: string; settings?: Setting[] };

const ICONS: Record<string, React.ElementType> = {
    social_youtube: YoutubeLogo,
    social_facebook: FacebookLogo,
    social_instagram: InstagramLogo,
    social_twitter: TwitterLogo,
    radio_stream_url: RadioButton,
    radio_station_name: RadioButton,
    ad_home_top_image: ImageSquare,
    ad_home_top_link: ImageSquare,
    ad_home_sidebar_image: ImageSquare,
    ad_home_sidebar_link: ImageSquare,
};

const GROUPS: Array<{ id: SettingGroup; title: string; description: string }> = [
    {
        id: "social",
        title: "Social media",
        description: "Update the links to your social media pages.",
    },
    {
        id: "radio",
        title: "Live radio",
        description: "Set the radio stream and the player name shown on the site.",
    },
    {
        id: "ads",
        title: "Ads",
        description: "Set the ad images and where they link. Use a full URL or a path like /ads/image.png.",
    },
    {
        id: "homepage",
        title: "Homepage content",
        description: "Edit the verse of the day and the scrolling breaking-news ticker shown on the site.",
    },
];

export default function SettingsPage() {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [values, setValues] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    useEffect(() => {
        fetch("/api/admin/settings")
            .then(async r => {
                const data = await r.json().catch(() => null) as SettingsResponse | null;
                if (!r.ok) {
                    const error = data && !Array.isArray(data) ? data.error : null;
                    throw new Error(error ?? "Could not load settings.");
                }
                return data;
            })
            .then((data) => {
                const rows = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.settings)
                        ? data.settings
                        : [];

                setSettings(rows);
                const map: Record<string, string> = {};
                rows.forEach(s => { map[s.key] = s.value; });
                SETTING_DEFINITIONS.forEach(s => {
                    if (map[s.key] === undefined) map[s.key] = s.value;
                });
                setValues(map);
                if (!Array.isArray(data) && data?.warning) {
                    setMessage({ type: "err", text: data.warning });
                }
            })
            .catch(error => {
                setValues(Object.fromEntries(SETTING_DEFINITIONS.map(s => [s.key, s.value])));
                setMessage({
                    type: "err",
                    text: error instanceof Error ? error.message : "Could not load settings.",
                });
            })
            .finally(() => setLoading(false));
    }, []);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const payload: Record<string, string> = {};
        SETTING_DEFINITIONS.forEach(setting => {
            const value = values[setting.key];
            if (value !== undefined) payload[setting.key] = value;
        });

        const res = await fetch("/api/admin/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const json = await res.json().catch(() => ({}));
        if (res.ok) {
            setMessage({ type: "ok", text: "Settings saved." });
        } else {
            setMessage({ type: "err", text: (json as { error?: string }).error ?? "Something went wrong." });
        }
        setSaving(false);
    }

    function settingsForGroup(group: SettingGroup) {
        return SETTING_DEFINITIONS
            .filter(definition => definition.group === group)
            .map(definition => settings.find(s => s.key === definition.key) ?? {
                key: definition.key,
                value: definition.value,
                label: definition.label,
                description: definition.description,
            });
    }

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>Settings</h1>
                <a href="/admin" className={styles.backBtn}>Back</a>
            </div>

            {loading && <p style={{ color: "var(--text-muted)", padding: "2rem 0" }}>Loading...</p>}

            {!loading && (
                <form onSubmit={handleSave}>
                    {message && (
                        <div
                            className={message.type === "ok" ? settStyles.successMsg : styles.error}
                            role="alert"
                        >
                            {message.text}
                        </div>
                    )}

                    {GROUPS.map(group => (
                        <section key={group.id} className={settStyles.section}>
                            <h2 className={settStyles.sectionTitle}>{group.title}</h2>
                            <p className={settStyles.sectionDesc}>{group.description}</p>

                            <div className={settStyles.grid}>
                                {settingsForGroup(group.id).map(setting => {
                                    const definition = SETTING_DEFINITIONS.find(item => item.key === setting.key);
                                    const Icon = ICONS[setting.key];
                                    const inputType = definition?.input === "url" ? "url" : "text";
                                    const isTextarea = definition?.input === "textarea";
                                    const placeholder = definition?.group === "ads"
                                        ? "/ads/..."
                                        : definition?.group === "homepage"
                                            ? ""
                                            : "https://...";
                                    const required = definition?.group !== "ads";

                                    return (
                                        <label key={setting.key} className={settStyles.field}>
                                            <span className={settStyles.fieldLabel}>
                                                {Icon && <Icon size={16} weight="fill" className={settStyles.fieldIcon} />}
                                                {definition?.label ?? setting.label}
                                            </span>
                                            {(definition?.description ?? setting.description) && (
                                                <span className={styles.hint}>{definition?.description ?? setting.description}</span>
                                            )}
                                            {isTextarea ? (
                                                <textarea
                                                    value={values[setting.key] ?? setting.value ?? ""}
                                                    onChange={event => setValues(v => ({
                                                        ...v,
                                                        [setting.key]: event.target.value,
                                                    }))}
                                                    className={styles.input}
                                                    rows={4}
                                                    placeholder={placeholder}
                                                    required={required}
                                                />
                                            ) : (
                                                <input
                                                    type={inputType}
                                                    value={values[setting.key] ?? setting.value ?? ""}
                                                    onChange={event => setValues(v => ({
                                                        ...v,
                                                        [setting.key]: event.target.value,
                                                    }))}
                                                    className={styles.input}
                                                    placeholder={placeholder}
                                                    required={required}
                                                />
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        </section>
                    ))}

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={saving}
                        style={{ marginTop: "0.25rem", maxWidth: 220 }}
                    >
                        {saving ? "Saving..." : "Save changes"}
                    </button>

                    {settings.length === 0 && (
                        <div className={settStyles.noTable}>
                            <p>The <code>site_settings</code> table may not exist in Supabase yet.</p>
                            <p>Run the SQL in <code>supabase/site_settings.sql</code> if saving doesn&apos;t work.</p>
                        </div>
                    )}
                </form>
            )}
        </div>
    );
}
