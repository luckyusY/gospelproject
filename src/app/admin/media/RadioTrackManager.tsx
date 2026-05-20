"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "../form.module.css";
import mediaStyles from "./media.module.css";

type RadioTrack = {
    id: number;
    title: string;
    file_url: string;
    storage_path: string | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
};

type TracksResponse = {
    tracks?: RadioTrack[];
    track?: RadioTrack;
    error?: string;
    warning?: string;
};

export default function RadioTrackManager() {
    const fileRef = useRef<HTMLInputElement>(null);
    const [tracks, setTracks] = useState<RadioTrack[]>([]);
    const [title, setTitle] = useState("");
    const [sortOrder, setSortOrder] = useState("0");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    async function loadTracks() {
        setLoading(true);
        const response = await fetch("/api/admin/radio-tracks", { cache: "no-store" });
        const data = await response.json().catch(() => ({})) as TracksResponse;
        setTracks(data.tracks ?? []);
        if (data.warning) setMessage({ type: "err", text: data.warning });
        setLoading(false);
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void loadTracks();
    }, []);

    async function handleUpload(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const file = fileRef.current?.files?.[0];
        if (!file) {
            setMessage({ type: "err", text: "Hitamo audio file ubanze." });
            return;
        }

        const form = new FormData();
        form.append("file", file);
        form.append("title", title);
        form.append("sort_order", sortOrder);

        setUploading(true);
        setMessage(null);

        const response = await fetch("/api/admin/radio-tracks", {
            method: "POST",
            body: form,
        });
        const data = await response.json().catch(() => ({})) as TracksResponse;

        if (!response.ok || !data.track) {
            setMessage({ type: "err", text: data.error ?? "Upload yanze." });
            setUploading(false);
            return;
        }

        setTracks(current => [data.track as RadioTrack, ...current]);
        setTitle("");
        setSortOrder("0");
        if (fileRef.current) fileRef.current.value = "";
        setMessage({ type: "ok", text: "Indirimbo yashyizwe kuri fallback playlist." });
        setUploading(false);
    }

    async function updateTrack(track: RadioTrack, updates: Partial<Pick<RadioTrack, "is_active" | "sort_order" | "title">>) {
        const response = await fetch("/api/admin/radio-tracks", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: track.id, ...updates }),
        });
        const data = await response.json().catch(() => ({})) as TracksResponse;

        if (!response.ok || !data.track) {
            setMessage({ type: "err", text: data.error ?? "Guhindura byanze." });
            return;
        }

        setTracks(current => current.map(item => item.id === track.id ? data.track as RadioTrack : item));
    }

    async function deleteTrack(track: RadioTrack) {
        const response = await fetch(`/api/admin/radio-tracks?id=${track.id}`, { method: "DELETE" });
        const data = await response.json().catch(() => ({})) as TracksResponse;

        if (!response.ok) {
            setMessage({ type: "err", text: data.error ?? "Gusiba byanze." });
            return;
        }

        setTracks(current => current.filter(item => item.id !== track.id));
        setMessage({ type: "ok", text: "Indirimbo yasibwe." });
    }

    return (
        <section className={mediaStyles.panel}>
            <div className={mediaStyles.panelHeader}>
                <div>
                    <h2>Fallback music ya radio</h2>
                    <p>
                        Shyiraho indirimbo zizajya zikina ku rubuga igihe live stream idafungutse cyangwa iri offline.
                    </p>
                </div>
            </div>

            {message && (
                <div className={message.type === "ok" ? mediaStyles.success : styles.error} role="alert">
                    {message.text}
                </div>
            )}

            <form className={mediaStyles.uploadForm} onSubmit={handleUpload}>
                <label className={styles.label}>
                    Umutwe w&apos;indirimbo
                    <input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className={styles.input}
                        placeholder="Urugero Worship Mix"
                    />
                </label>
                <label className={styles.label}>
                    Umwanya
                    <input
                        value={sortOrder}
                        onChange={(event) => setSortOrder(event.target.value)}
                        className={styles.input}
                        inputMode="numeric"
                        placeholder="0"
                    />
                </label>
                <label className={styles.label}>
                    Audio file
                    <input
                        ref={fileRef}
                        type="file"
                        accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/aac,audio/mp4"
                        className={styles.input}
                    />
                </label>
                <button type="submit" className={styles.submitBtn} disabled={uploading}>
                    {uploading ? "Irimo gushyirwa..." : "Upload music"}
                </button>
            </form>

            <div className={mediaStyles.trackList}>
                {loading ? (
                    <p className={mediaStyles.empty}>Indirimbo zirimo gufunguka...</p>
                ) : tracks.length > 0 ? (
                    tracks.map(track => (
                        <article key={track.id} className={mediaStyles.track}>
                            <div className={mediaStyles.trackMain}>
                                <strong>{track.title}</strong>
                                <a href={track.file_url} target="_blank" rel="noopener noreferrer">
                                    Fungura audio
                                </a>
                            </div>
                            <label className={mediaStyles.toggle}>
                                <input
                                    type="checkbox"
                                    checked={track.is_active}
                                    onChange={(event) => updateTrack(track, { is_active: event.target.checked })}
                                />
                                Active
                            </label>
                            <input
                                className={mediaStyles.orderInput}
                                value={track.sort_order}
                                inputMode="numeric"
                                aria-label={`Sort order for ${track.title}`}
                                onChange={(event) => {
                                    const value = Number(event.target.value);
                                    setTracks(current => current.map(item => (
                                        item.id === track.id ? { ...item, sort_order: Number.isFinite(value) ? value : 0 } : item
                                    )));
                                }}
                                onBlur={(event) => updateTrack(track, { sort_order: Number(event.target.value) || 0 })}
                            />
                            <button
                                type="button"
                                className={mediaStyles.deleteButton}
                                onClick={() => deleteTrack(track)}
                            >
                                Siba
                            </button>
                        </article>
                    ))
                ) : (
                    <p className={mediaStyles.empty}>Nta ndirimbo za fallback zirashyirwaho.</p>
                )}
            </div>
        </section>
    );
}
