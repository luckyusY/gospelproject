"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { HomepageSectionRow, ArticleRow } from "@/types/database";
import styles from "../../crud.module.css";
import form from "../../form.module.css";

type ArticleLite = Pick<ArticleRow, "id" | "title" | "slug" | "is_featured" | "is_published" | "published_at">;

type Props = {
    sections: HomepageSectionRow[];
    articles: ArticleLite[];
    verseText: string;
    verseReference: string;
    tickerLines: string;
};

export default function HomepageManager({ sections, articles, verseText, verseReference, tickerLines }: Props) {
    const router = useRouter();
    const [, startTransition] = useTransition();
    const refresh = () => startTransition(() => router.refresh());

    // ── Sections (toggle + order) ───────────────────────────
    const [rows, setRows] = useState(() => [...sections].sort((a, b) => a.sort_order - b.sort_order));
    const [savingSections, setSavingSections] = useState(false);
    const [sectionMsg, setSectionMsg] = useState<string | null>(null);

    function move(index: number, dir: -1 | 1) {
        const next = [...rows];
        const target = index + dir;
        if (target < 0 || target >= next.length) return;
        const a = next[index];
        const b = next[target];
        if (!a || !b) return;
        next[index] = b;
        next[target] = a;
        setRows(next);
    }

    function toggle(id: number) {
        setRows(rows.map(r => r.id === id ? { ...r, is_enabled: !r.is_enabled } : r));
    }

    async function saveSections() {
        setSavingSections(true);
        setSectionMsg(null);
        const payload = rows.map((r, i) => ({ id: r.id, is_enabled: r.is_enabled, sort_order: i }));
        const res = await fetch("/api/admin/homepage-sections", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sections: payload }),
        });
        setSavingSections(false);
        setSectionMsg(res.ok ? "Layout saved." : "Could not save the layout.");
        if (res.ok) refresh();
    }

    // ── Verse + ticker (site_settings) ──────────────────────
    const [verse, setVerse] = useState(verseText);
    const [ref, setRef] = useState(verseReference);
    const [ticker, setTicker] = useState(tickerLines);
    const [savingContent, setSavingContent] = useState(false);
    const [contentMsg, setContentMsg] = useState<string | null>(null);

    async function saveContent(e: React.FormEvent) {
        e.preventDefault();
        setSavingContent(true);
        setContentMsg(null);
        const res = await fetch("/api/admin/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ verse_text: verse, verse_reference: ref, ticker_lines: ticker }),
        });
        setSavingContent(false);
        setContentMsg(res.ok ? "Saved." : "Could not save.");
    }

    // ── Featured stories ────────────────────────────────────
    const [feat, setFeat] = useState(articles);
    const [busyId, setBusyId] = useState<number | null>(null);

    async function toggleFeatured(a: ArticleLite) {
        setBusyId(a.id);
        const res = await fetch(`/api/admin/articles/${a.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_featured: !a.is_featured }),
        });
        setBusyId(null);
        if (res.ok) {
            setFeat(feat.map(x => x.id === a.id ? { ...x, is_featured: !x.is_featured } : x));
        } else {
            alert("Could not update the article.");
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>Homepage</h1>
                <a href="/admin" className={form.backBtn}>Back</a>
            </div>

            {/* ── Sections ─────────────────────────────── */}
            <section className={form.form} style={{ marginBottom: "2.5rem" }}>
                <h2 className={styles.heading} style={{ fontSize: "1.05rem" }}>Sections — show, hide &amp; reorder</h2>
                <p className={styles.catHint} style={{ marginTop: 0 }}>
                    Turn homepage sections on/off and change the order they appear in.
                </p>
                <div className={styles.table}>
                    {rows.map((r, i) => (
                        <div key={r.id} className={styles.tableRow} style={{ gridTemplateColumns: "auto 1fr auto", alignItems: "center" }}>
                            <label className={form.checkLabel} style={{ margin: 0 }}>
                                <input
                                    type="checkbox"
                                    className={form.checkbox}
                                    checked={r.is_enabled}
                                    onChange={() => toggle(r.id)}
                                />
                            </label>
                            <span className={styles.rowTitle}>{r.label}</span>
                            <div className={styles.rowActions}>
                                <button type="button" className={styles.viewBtn} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                                <button type="button" className={styles.viewBtn} onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label="Move down">↓</button>
                            </div>
                        </div>
                    ))}
                    {rows.length === 0 && (
                        <p className={styles.empty}>
                            No sections found. Run <code>supabase/content_driven.sql</code> in Supabase.
                        </p>
                    )}
                </div>
                <button type="button" className={form.submitBtn} style={{ maxWidth: 220, marginTop: "1rem" }} onClick={saveSections} disabled={savingSections}>
                    {savingSections ? "Saving..." : "Save layout"}
                </button>
                {sectionMsg && <p className={styles.catHint}>{sectionMsg}</p>}
            </section>

            {/* ── Verse + ticker ───────────────────────── */}
            <form className={form.form} onSubmit={saveContent} style={{ marginBottom: "2.5rem" }}>
                <h2 className={styles.heading} style={{ fontSize: "1.05rem" }}>Verse of the day &amp; news ticker</h2>
                <label className={form.label}>
                    Verse text
                    <textarea className={form.textarea} rows={3} value={verse} onChange={e => setVerse(e.target.value)} />
                </label>
                <label className={form.label}>
                    Verse reference
                    <input className={form.input} value={ref} onChange={e => setRef(e.target.value)} placeholder="— Yeremiya 29:11" />
                </label>
                <label className={form.label}>
                    Breaking-news ticker (one line per item)
                    <textarea className={form.textarea} rows={4} value={ticker} onChange={e => setTicker(e.target.value)} />
                </label>
                <button type="submit" className={form.submitBtn} style={{ maxWidth: 220 }} disabled={savingContent}>
                    {savingContent ? "Saving..." : "Save content"}
                </button>
                {contentMsg && <p className={styles.catHint}>{contentMsg}</p>}
            </form>

            {/* ── Featured stories ─────────────────────── */}
            <section className={form.form}>
                <h2 className={styles.heading} style={{ fontSize: "1.05rem" }}>Featured stories (hero slideshow)</h2>
                <p className={styles.catHint} style={{ marginTop: 0 }}>
                    Featured articles lead the homepage hero. Toggle the star to feature or un-feature a story.
                </p>
                <div className={styles.table}>
                    {feat.map(a => (
                        <div key={a.id} className={`${styles.tableRow} ${busyId === a.id ? styles.rowBusy : ""}`} style={{ gridTemplateColumns: "1fr auto auto", alignItems: "center" }}>
                            <span className={styles.rowTitle}>{a.title}</span>
                            <span className={a.is_published ? styles.published : styles.draft}>
                                {a.is_published ? "Published" : "Draft"}
                            </span>
                            <button
                                type="button"
                                onClick={() => toggleFeatured(a)}
                                disabled={busyId === a.id}
                                className={a.is_featured ? styles.published : styles.viewBtn}
                                title={a.is_featured ? "Featured" : "Not featured"}
                            >
                                {a.is_featured ? "★ Featured" : "☆ Feature"}
                            </button>
                        </div>
                    ))}
                    {feat.length === 0 && <p className={styles.empty}>No articles yet.</p>}
                </div>
            </section>
        </div>
    );
}
