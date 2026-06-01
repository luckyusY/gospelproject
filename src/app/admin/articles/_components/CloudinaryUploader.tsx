"use client";

import { useRef, useState }  from "react";
import Image                  from "next/image";
import styles                 from "../../form.module.css";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";

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
            const url = await uploadToCloudinary(file, setProgress);
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
                <summary>Shyiramo URL y&apos;ifoto (optional)</summary>
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
