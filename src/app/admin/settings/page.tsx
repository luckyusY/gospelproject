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
        title: "Imbuga Nkoranyambaga",
        description: "Hindura aho imbuga nkoranyambaga zawe ziherereye.",
    },
    {
        id: "radio",
        title: "Live Radio",
        description: "Hindura stream ya radio n'izina rya player rigaragara ku rubuga.",
    },
    {
        id: "ads",
        title: "Ads / Kwamamaza",
        description: "Hindura amafoto ya ads n'aho ajyana. Wakoresha URL yuzuye cyangwa inzira nka /ads/ifoto.svg.",
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
            .then(r => r.json())
            .then((data: Setting[]) => {
                setSettings(data);
                const map: Record<string, string> = {};
                data.forEach(s => { map[s.key] = s.value; });
                SETTING_DEFINITIONS.forEach(s => {
                    if (map[s.key] === undefined) map[s.key] = s.value;
                });
                setValues(map);
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
            setMessage({ type: "ok", text: "Ibisobanuro byabitswe neza." });
        } else {
            setMessage({ type: "err", text: (json as { error?: string }).error ?? "Hari ikibazo." });
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
                <h1 className={styles.heading}>Igenamiterere - Settings</h1>
                <a href="/admin" className={styles.backBtn}>Subira</a>
            </div>

            {loading && <p style={{ color: "var(--text-muted)", padding: "2rem 0" }}>Gutegura...</p>}

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
                                    const placeholder = definition?.group === "ads" ? "/ads/..." : "https://...";

                                    return (
                                        <label key={setting.key} className={settStyles.field}>
                                            <span className={settStyles.fieldLabel}>
                                                {Icon && <Icon size={16} weight="fill" className={settStyles.fieldIcon} />}
                                                {setting.label}
                                            </span>
                                            {setting.description && (
                                                <span className={styles.hint}>{setting.description}</span>
                                            )}
                                            <input
                                                type={inputType}
                                                value={values[setting.key] ?? setting.value ?? ""}
                                                onChange={event => setValues(v => ({
                                                    ...v,
                                                    [setting.key]: event.target.value,
                                                }))}
                                                className={styles.input}
                                                placeholder={placeholder}
                                                required={definition?.group !== "ads"}
                                            />
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
                        {saving ? "Biga..." : "Bika impinduka"}
                    </button>

                    {settings.length === 0 && (
                        <div className={settStyles.noTable}>
                            <p>Imbonerahamwe <code>site_settings</code> ishobora kuba itarashyizweho muri Supabase.</p>
                            <p>Kora SQL iri muri <code>supabase/site_settings.sql</code> niba kubika bidakunze.</p>
                        </div>
                    )}
                </form>
            )}
        </div>
    );
}
