"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "../form.module.css";
import mediaStyles from "./media.module.css";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const AUDIO_FOLDER = "gospel-news/radio";
const MAX_AUDIO_SIZE = 100 * 1024 * 1024;

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
    const [uploadProgress, setUploadProgress] = useState(0);
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
        void loadTracks();
    }, []);

    async function handleUpload(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const file = fileRef.current?.files?.[0];
        if (!file) {
            setMessage({ type: "err", text: "Hitamo audio file ubanze." });
            return;
        }

        if (!isAudioFile(file)) {
            setMessage({ type: "err", text: "File igomba kuba audio." });
            return;
        }

        if (file.size > MAX_AUDIO_SIZE) {
            setMessage({ type: "err", text: "Audio ntigomba kurenza 100 MB." });
            return;
        }

        if (!CLOUD_NAME || !API_KEY) {
            setMessage({ type: "err", text: "Cloudinary settings ntizuzuye." });
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setMessage(null);

        try {
            const timestamp = Math.round(Date.now() / 1000).toString();
            const filename = safeFileName(file.name).replace(/\.[^.]+$/, "") || "radio-track";
            const publicId = `${Date.now()}-${filename}`;
            const signResponse = await fetch("/api/cloudinary/sign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    paramsToSign: {
                        folder: AUDIO_FOLDER,
                        public_id: publicId,
                        timestamp,
                    },
                }),
            });
            const signData = await signResponse.json().catch(() => ({})) as { signature?: string; error?: string };

            if (!signResponse.ok || !signData.signature) {
                throw new Error(signData.error ?? "Signature yananitse.");
            }

            const uploadForm = new FormData();
            uploadForm.append("file", file);
            uploadForm.append("api_key", API_KEY);
            uploadForm.append("timestamp", timestamp);
            uploadForm.append("signature", signData.signature);
            uploadForm.append("folder", AUDIO_FOLDER);
            uploadForm.append("public_id", publicId);

            const uploadData = await uploadAudio(CLOUD_NAME, uploadForm, setUploadProgress);
            setUploadProgress(100);

            const response = await fetch("/api/admin/radio-tracks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title || file.name.replace(/\.[^.]+$/, ""),
                    sort_order: sortOrder,
                    file_url: uploadData.secure_url,
                    storage_path: uploadData.public_id,
                }),
            });
            const data = await response.json().catch(() => ({})) as TracksResponse;

            if (!response.ok || !data.track) {
                throw new Error(data.error ?? "Upload yanze.");
            }

            setTracks(current => [data.track as RadioTrack, ...current]);
            setTitle("");
            setSortOrder("0");
            if (fileRef.current) fileRef.current.value = "";
            setMessage({ type: "ok", text: "Indirimbo yashyizwe kuri fallback playlist." });
        } catch (error) {
            setMessage({ type: "err", text: error instanceof Error ? error.message : "Upload yanze." });
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
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
                    {uploading ? `Irimo gushyirwa... ${uploadProgress}%` : "Upload music"}
                </button>
            </form>

            {uploading && (
                <div
                    className={mediaStyles.progressBar}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={uploadProgress}
                >
                    <div className={mediaStyles.progressFill} style={{ width: `${uploadProgress}%` }} />
                    <span className={mediaStyles.progressLabel}>{uploadProgress}%</span>
                </div>
            )}

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

function safeFileName(name: string) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function isAudioFile(file: File) {
    if (file.type.startsWith("audio/")) return true;
    return /\.(aac|aif|aiff|flac|m4a|mp3|mp4|oga|ogg|opus|wav|weba)$/i.test(file.name);
}

function uploadAudio(cloudName: string, form: FormData, onProgress: (progress: number) => void) {
    return new Promise<{ secure_url: string; public_id?: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                onProgress(Math.round((event.loaded / event.total) * 100));
            }
        };

        xhr.onload = () => {
            try {
                const data = JSON.parse(xhr.responseText) as {
                    secure_url?: string;
                    public_id?: string;
                    error?: { message?: string };
                };

                if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
                    resolve({ secure_url: data.secure_url, public_id: data.public_id });
                    return;
                }

                reject(new Error(data.error?.message ?? "Cloudinary upload yanze."));
            } catch {
                reject(new Error("Server yatanze inyishu mbi."));
            }
        };

        xhr.onerror = () => reject(new Error("Ikibazo cya network."));
        xhr.send(form);
    });
}
