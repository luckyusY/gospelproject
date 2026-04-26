"use client";

import { useRef, useState }  from "react";
import Image                  from "next/image";
import styles                 from "../../form.module.css";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const API_KEY    = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
const FOLDER     = "gospel-news";

type Props = {
    value:    string;          // current image_url (empty string = none)
    onChange: (url: string) => void;
};

export default function CloudinaryUploader({ value, onChange }: Props) {
    const fileRef               = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress]   = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);

    async function handleFile(file: File) {
        setUploading(true);
        setProgress(0);
        setUploadError(null);

        try {
            const timestamp = Math.round(Date.now() / 1000);

            // 1. Get a server-side signature (API secret stays on server)
            const signRes = await fetch("/api/cloudinary/sign", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({
                    paramsToSign: {
                        folder:    FOLDER,
                        timestamp: String(timestamp),
                    },
                }),
            });

            if (!signRes.ok) throw new Error("Signature yananitse.");
            const { signature } = (await signRes.json()) as { signature: string };

            // 2. Upload directly to Cloudinary REST API
            const fd = new FormData();
            fd.append("file",      file);
            fd.append("api_key",   API_KEY);
            fd.append("timestamp", String(timestamp));
            fd.append("signature", signature);
            fd.append("folder", FOLDER);

            // Use XHR so we can track progress
            const url = await new Promise<string>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) {
                        setProgress(Math.round((e.loaded / e.total) * 100));
                    }
                };

                xhr.onload = () => {
                    try {
                        const data = JSON.parse(xhr.responseText) as {
                            secure_url?: string;
                            error?: { message?: string };
                        };
                        if (data.secure_url) {
                            resolve(data.secure_url);
                        } else {
                            reject(new Error(data.error?.message ?? "Upload yarananiranye."));
                        }
                    } catch {
                        reject(new Error("Server yatanze inyishu mbi."));
                    }
                };

                xhr.onerror = () => reject(new Error("Ikibazo cya network."));
                xhr.send(fd);
            });

            onChange(url);
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : "Upload yarananiranye.");
        } finally {
            setUploading(false);
            setProgress(0);
        }
    }

    const isCloudinary = value.includes("res.cloudinary.com");

    return (
        <div className={styles.imgUploader}>

            {/* ── Image preview ─────────────────────────── */}
            {value ? (
                <div className={styles.imgPreviewWrap}>
                    {isCloudinary || value.startsWith("http") ? (
                        <Image
                            src={value}
                            alt="Featured image preview"
                            fill
                            className={styles.imgPreview}
                            sizes="280px"
                            unoptimized={!isCloudinary}
                        />
                    ) : null}
                    <button
                        type="button"
                        className={styles.imgRemoveBtn}
                        onClick={() => onChange("")}
                        aria-label="Siba ifoto"
                        title="Siba ifoto"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <div className={styles.imgEmpty}>
                    <span className={styles.imgEmptyIcon}>🖼️</span>
                    <span>Nta foto yashyizweho</span>
                </div>
            )}

            {/* ── Progress bar ──────────────────────────── */}
            {uploading && (
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                    />
                    <span className={styles.progressLabel}>{progress}%</span>
                </div>
            )}

            {/* ── Upload button ─────────────────────────── */}
            <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                style={{ display: "none" }}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                    e.target.value = ""; // reset so same file can be re-picked
                }}
            />

            <button
                type="button"
                className={styles.imgUploadBtn}
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
            >
                {uploading
                    ? `Irimo gushyirwa… ${progress}%`
                    : value
                    ? "🔄  Hindura ifoto"
                    : "📤  Shyira ifoto"}
            </button>

            {/* ── URL fallback input ────────────────────── */}
            <details className={styles.urlFallback}>
                <summary>Shyiramo URL y'ifoto (optional)</summary>
                <input
                    type="url"
                    name="image_url"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={styles.input}
                    placeholder="https://res.cloudinary.com/..."
                    style={{ marginTop: "0.5rem" }}
                />
            </details>

            {/* Hidden input so the form always has image_url */}
            {!value && <input type="hidden" name="image_url" value="" />}

            {/* ── Error ─────────────────────────────────── */}
            {uploadError && (
                <span className={styles.imgError}>{uploadError}</span>
            )}

            <span className={styles.hint}>
                JPEG · PNG · WebP · GIF — 10 MB max. Ifoto izabikwa muri Cloudinary.
            </span>
        </div>
    );
}
