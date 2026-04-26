"use client";

import { useEffect, useState } from "react";
import {
    YoutubeLogo,
    InstagramLogo,
    FacebookLogo,
    TwitterLogo,
} from "@phosphor-icons/react";
import styles from "../form.module.css";
import settStyles from "./settings.module.css";

type Setting = { key: string; value: string; label: string; description?: string };

const SOCIAL_KEYS = ["social_youtube", "social_facebook", "social_instagram", "social_twitter"];

const ICONS: Record<string, React.ElementType> = {
    social_youtube:   YoutubeLogo,
    social_facebook:  FacebookLogo,
    social_instagram: InstagramLogo,
    social_twitter:   TwitterLogo,
};

export default function SettingsPage() {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [values, setValues]     = useState<Record<string, string>>({});
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState(false);
    const [message, setMessage]   = useState<{ type: "ok" | "err"; text: string } | null>(null);

    useEffect(() => {
        fetch("/api/admin/settings")
            .then(r => r.json())
            .then((data: Setting[]) => {
                setSettings(data);
                const map: Record<string, string> = {};
                data.forEach(s => { map[s.key] = s.value; });
                setValues(map);
            })
            .finally(() => setLoading(false));
    }, []);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const socialPayload: Record<string, string> = {};
        SOCIAL_KEYS.forEach(k => { if (values[k] !== undefined) socialPayload[k] = values[k]; });

        const res = await fetch("/api/admin/settings", {
            method:  "PUT",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(socialPayload),
        });

        const json = await res.json().catch(() => ({}));
        if (res.ok) {
            setMessage({ type: "ok", text: "Ibisobanuro byabitswe neza. ✓" });
        } else {
            setMessage({ type: "err", text: (json as { error?: string }).error ?? "Hari ikibazo." });
        }
        setSaving(false);
    }

    const socialSettings = settings.filter(s => SOCIAL_KEYS.includes(s.key));

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>Igenamiterere — Settings</h1>
                <a href="/admin" className={styles.backBtn}>← Subira</a>
            </div>

            {loading && <p style={{ color: "var(--text-muted)", padding: "2rem 0" }}>Gutegura…</p>}

            {!loading && (
                <form onSubmit={handleSave}>

                    {/* ── Social Media ─────────────────────── */}
                    <section className={settStyles.section}>
                        <h2 className={settStyles.sectionTitle}>📣 Imbuga Nkoranyambaga</h2>
                        <p className={settStyles.sectionDesc}>
                            Hindura aho imbuga nkoranyambaga zawe ziherereye. Izi kiungo zizagaragara mu mpera y'urubuga.
                        </p>

                        {message && (
                            <div
                                className={message.type === "ok" ? settStyles.successMsg : styles.error}
                                role="alert"
                            >
                                {message.text}
                            </div>
                        )}

                        <div className={settStyles.grid}>
                            {socialSettings.length === 0 ? (
                                <div className={settStyles.noTable}>
                                    <p>⚠️ Imbuga <code>site_settings</code> ntabwo ishyizweho.</p>
                                    <p>Kora SQL iri muri <code>supabase/site_settings.sql</code> mu Supabase Dashboard.</p>
                                </div>
                            ) : (
                                socialSettings.map(s => {
                                    const Icon = ICONS[s.key];
                                    return (
                                        <label key={s.key} className={settStyles.field}>
                                            <span className={settStyles.fieldLabel}>
                                                {Icon && <Icon size={16} weight="fill" className={settStyles.fieldIcon} />}
                                                {s.label}
                                            </span>
                                            {s.description && (
                                                <span className={styles.hint}>{s.description}</span>
                                            )}
                                            <input
                                                type="url"
                                                value={values[s.key] ?? ""}
                                                onChange={e => setValues(v => ({ ...v, [s.key]: e.target.value }))}
                                                className={styles.input}
                                                placeholder="https://..."
                                                required
                                            />
                                        </label>
                                    );
                                })
                            )}
                        </div>

                        {socialSettings.length > 0 && (
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={saving}
                                style={{ marginTop: "1.5rem", maxWidth: 220 }}
                            >
                                {saving ? "Biga…" : "💾  Bika impinduka"}
                            </button>
                        )}
                    </section>

                </form>
            )}
        </div>
    );
}
