"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { TestimonyRow } from "@/types/database";
import styles from "../../form.module.css";
import CloudinaryUploader from "../../articles/_components/CloudinaryUploader";

type Props = { testimony?: TestimonyRow };

export default function TestimonyForm({ testimony }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError]         = useState<string | null>(null);
    const [imageUrl, setImageUrl]   = useState(testimony?.image_url ?? "");
    const [avatarUrl, setAvatarUrl] = useState(testimony?.person_avatar ?? "");

    const isEdit = Boolean(testimony);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const form = e.currentTarget;
        const data = new FormData(form);

        const content = (data.get("content") as string).trim();
        if (!content) {
            setError("Add the testimony before saving.");
            return;
        }

        const isPublished = data.get("is_published") === "1";
        const payload = {
            title:         (data.get("title") as string).trim(),
            slug:          (data.get("slug") as string).trim(),
            excerpt:       (data.get("excerpt") as string).trim(),
            content,
            person_name:   (data.get("person_name") as string).trim(),
            person_church: ((data.get("person_church") as string) || "").trim() || null,
            person_avatar: avatarUrl || null,
            image_url:     imageUrl || null,
            is_published:  isPublished,
            is_featured:   data.get("is_featured") === "1",
            published_at:  isPublished ? (testimony?.published_at ?? new Date().toISOString()) : null,
        };

        const url = isEdit ? `/api/admin/testimonies/${testimony!.id}` : "/api/admin/testimonies";
        const method = isEdit ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            setError((json as { error?: string }).error ?? "Something went wrong. Please try again.");
            return;
        }

        startTransition(() => {
            router.push("/admin/testimonies");
            router.refresh();
        });
    }

    function slugify(val: string) {
        return val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>
                    {isEdit ? "Edit testimony" : "New testimony"}
                </h1>
                <a href="/admin/testimonies" className={styles.backBtn}>← Back</a>
            </div>

            {error && <div className={styles.error} role="alert">{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>

                    {/* Left column — main content */}
                    <div className={styles.mainCol}>
                        <label className={styles.label}>
                            Title <span className={styles.req}>*</span>
                            <input
                                name="title"
                                defaultValue={testimony?.title}
                                required
                                className={styles.input}
                                onChange={e => {
                                    if (!isEdit) {
                                        const slugInput = document.querySelector<HTMLInputElement>('[name="slug"]');
                                        if (slugInput) slugInput.value = slugify(e.target.value);
                                    }
                                }}
                            />
                        </label>

                        <label className={styles.label}>
                            Slug <span className={styles.req}>*</span>
                            <input
                                name="slug"
                                defaultValue={testimony?.slug}
                                required
                                className={styles.input}
                                pattern="[a-z0-9-]+"
                                title="Lowercase letters, numbers and - only"
                            />
                        </label>

                        <label className={styles.label}>
                            Excerpt <span className={styles.req}>*</span>
                            <textarea
                                name="excerpt"
                                defaultValue={testimony?.excerpt}
                                required
                                rows={3}
                                className={styles.textarea}
                            />
                        </label>

                        <label className={styles.label}>
                            Testimony <span className={styles.req}>*</span>
                            <textarea
                                name="content"
                                defaultValue={testimony?.content ?? ""}
                                required
                                rows={16}
                                className={styles.textarea}
                                placeholder={"Write the testimony here.\n\n## Section heading\nSection text...\n\n## Another point\nMore..."}
                            />
                            <span className={styles.hint}>
                                Use <code>## Heading</code> on its own line to split into sections. One paragraph per line.
                            </span>
                        </label>
                    </div>

                    {/* Right column — meta */}
                    <div className={styles.metaCol}>
                        <label className={styles.label}>
                            Person&apos;s name <span className={styles.req}>*</span>
                            <input
                                name="person_name"
                                defaultValue={testimony?.person_name}
                                required
                                className={styles.input}
                                placeholder="Jean Bosco"
                            />
                        </label>

                        <label className={styles.label}>
                            Church
                            <input
                                name="person_church"
                                defaultValue={testimony?.person_church ?? ""}
                                className={styles.input}
                                placeholder="ADEPR Kigali"
                            />
                        </label>

                        <div className={styles.label}>
                            Person&apos;s photo
                            <CloudinaryUploader value={avatarUrl} onChange={setAvatarUrl} />
                        </div>

                        <div className={styles.label}>
                            Featured image
                            <CloudinaryUploader value={imageUrl} onChange={setImageUrl} />
                        </div>

                        <div className={styles.checkRow}>
                            <input
                                type="checkbox"
                                name="is_published"
                                value="1"
                                id="is_published"
                                defaultChecked={testimony?.is_published}
                                className={styles.checkbox}
                            />
                            <label htmlFor="is_published" className={styles.checkLabel}>
                                Publish to site
                            </label>
                        </div>

                        <div className={styles.checkRow}>
                            <input
                                type="checkbox"
                                name="is_featured"
                                value="1"
                                id="is_featured"
                                defaultChecked={testimony?.is_featured}
                                className={styles.checkbox}
                            />
                            <label htmlFor="is_featured" className={styles.checkLabel}>
                                Featured testimony
                            </label>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={isPending}>
                            {isPending ? "Saving..." : isEdit ? "Save changes" : "Publish testimony"}
                        </button>

                        {isEdit && (
                            <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={async () => {
                                    if (!confirm("Delete this testimony? This cannot be undone.")) return;
                                    await fetch(`/api/admin/testimonies/${testimony!.id}`, { method: "DELETE" });
                                    router.push("/admin/testimonies");
                                    router.refresh();
                                }}
                            >
                                Delete testimony
                            </button>
                        )}
                    </div>

                </div>
            </form>
        </div>
    );
}
