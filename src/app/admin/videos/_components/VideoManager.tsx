"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { VideoRow } from "@/types/database";
import styles from "../../crud.module.css";
import form from "../../form.module.css";

const SECTIONS = [
    { value: "homepage", label: "Homepage" },
    { value: "tv-radio-featured", label: "TV & Radio - Featured/Hero" },
    { value: "tv-radio-latest", label: "TV & Radio - Latest videos" },
    { value: "tv-radio-sports", label: "TV & Radio - Sports" },
    { value: "tv-radio-library", label: "TV & Radio - Library" },
    { value: "tv-radio", label: "TV & Radio - Legacy featured" },
];

export default function VideoManager({
    videos,
    initialSection = "",
}: {
    videos: VideoRow[];
    initialSection?: string;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const refresh = () => startTransition(() => router.refresh());

    const [title, setTitle] = useState("");
    const [youtube, setYoutube] = useState("");
    const [description, setDescription] = useState("");
    const [section, setSection] = useState(initialSection || "homepage");
    const [sectionFilter, setSectionFilter] = useState(initialSection);
    const [error, setError] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);
    const [adding, setAdding] = useState(false);
    const filteredVideos = videos.filter(v => !sectionFilter || v.section === sectionFilter);

    async function addVideo(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!title.trim() || !youtube.trim()) {
            setError("Enter a title and a YouTube link or ID.");
            return;
        }
        setAdding(true);
        const res = await fetch("/api/admin/videos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title.trim(),
                youtube_id: youtube.trim(),
                description: description.trim(),
                section,
                sort_order: videos.filter(v => v.section === section).length,
            }),
        });
        setAdding(false);
        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            setError((json as { error?: string }).error ?? "Could not add the video.");
            return;
        }
        setTitle(""); setYoutube(""); setDescription("");
        refresh();
    }

    async function patch(video: VideoRow, body: Record<string, unknown>) {
        setBusyId(video.id);
        const res = await fetch(`/api/admin/videos/${video.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        setBusyId(null);
        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            alert((json as { error?: string }).error ?? "Could not save the video.");
            return;
        }
        refresh();
    }

    async function remove(video: VideoRow) {
        if (!confirm(`Delete "${video.title}"?`)) return;
        setBusyId(video.id);
        const res = await fetch(`/api/admin/videos/${video.id}`, { method: "DELETE" });
        setBusyId(null);
        if (!res.ok) {
            alert("Could not delete the video.");
            return;
        }
        refresh();
    }

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>Videos</h1>
                <a href="/admin" className={form.backBtn}>Back</a>
            </div>

            {/* Add form */}
            <form onSubmit={addVideo} className={styles.catAddForm}>
                <div className={form.formGrid} style={{ gap: "0.75rem" }}>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Video title"
                        className={form.input}
                        aria-label="Video title"
                    />
                    <input
                        value={youtube}
                        onChange={e => setYoutube(e.target.value)}
                        placeholder="YouTube link or ID (e.g. https://youtu.be/xxxx)"
                        className={form.input}
                        aria-label="YouTube link or ID"
                    />
                    <input
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Short description (optional)"
                        className={form.input}
                        aria-label="Description"
                    />
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <select
                            value={section}
                            onChange={e => setSection(e.target.value)}
                            className={form.input}
                            aria-label="Section"
                        >
                            {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                        <button type="submit" className={styles.newBtn} disabled={adding || isPending}>
                            {adding ? "Adding..." : "+ Add video"}
                        </button>
                    </div>
                </div>
                {error && <div className={form.error} role="alert">{error}</div>}
            </form>

            <div className={styles.toolbar}>
                <select
                    value={sectionFilter}
                    onChange={e => setSectionFilter(e.target.value)}
                    className={styles.filterSelect}
                    aria-label="Filter videos by section"
                >
                    <option value="">All video sections</option>
                    {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
            </div>

            {/* List */}
            <div className={styles.table}>
                <div className={styles.tableHead} style={{ gridTemplateColumns: "1.1fr 1fr 1fr 90px 90px 120px" }}>
                    <span>Title</span><span>YouTube</span><span>Section</span><span>Order</span><span>Status</span><span>Actions</span>
                </div>
                {filteredVideos.map(v => (
                    <div
                        key={v.id}
                        className={`${styles.tableRow} ${busyId === v.id ? styles.rowBusy : ""}`}
                        style={{ gridTemplateColumns: "1.1fr 1fr 1fr 90px 90px 120px", alignItems: "center" }}
                    >
                        <div style={{ display: "grid", gap: "0.4rem" }}>
                            <input
                                defaultValue={v.title}
                                onBlur={e => {
                                    const next = e.target.value.trim();
                                    if (next && next !== v.title) patch(v, { title: next });
                                }}
                                className={form.input}
                                aria-label={`Title for ${v.title}`}
                            />
                            <input
                                defaultValue={v.description}
                                onBlur={e => {
                                    const next = e.target.value.trim();
                                    if (next !== v.description) patch(v, { description: next });
                                }}
                                className={form.input}
                                aria-label={`Description for ${v.title}`}
                                placeholder="Description"
                            />
                        </div>
                        <input
                            defaultValue={v.youtube_id}
                            onBlur={e => {
                                const next = e.target.value.trim();
                                if (next && next !== v.youtube_id) patch(v, { youtube_id: next });
                            }}
                            className={form.input}
                            aria-label={`YouTube link for ${v.title}`}
                        />
                        <select
                            defaultValue={v.section}
                            onChange={e => patch(v, { section: e.target.value })}
                            className={form.input}
                            aria-label={`Section for ${v.title}`}
                        >
                            {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                        <input
                            type="number"
                            defaultValue={v.sort_order}
                            onBlur={e => {
                                const n = Number(e.target.value) || 0;
                                if (n !== v.sort_order) patch(v, { sort_order: n });
                            }}
                            className={form.input}
                            style={{ width: 64 }}
                            aria-label={`Sort order for ${v.title}`}
                        />
                        <button
                            type="button"
                            onClick={() => patch(v, { is_published: !v.is_published })}
                            className={v.is_published ? styles.published : styles.draft}
                            disabled={busyId === v.id}
                        >
                            {v.is_published ? "Published" : "Hidden"}
                        </button>
                        <div className={styles.rowActions}>
                            <a href={`https://youtu.be/${v.youtube_id}`} target="_blank" rel="noreferrer" className={styles.viewBtn}>
                                View
                            </a>
                            <button
                                type="button"
                                onClick={() => remove(v)}
                                disabled={busyId === v.id || isPending}
                                className={styles.deleteRowBtn}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                {filteredVideos.length === 0 && (
                    <p className={styles.empty}>No videos yet.</p>
                )}
            </div>

            <p className={styles.catHint}>
                Homepage videos appear in the &quot;Indirimbo z&apos;Imana — Ibiganiro&quot; grid on the front page (lowest order first).
            </p>
        </div>
    );
}
