"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PageRow } from "@/types/database";
import styles from "../../form.module.css";
import RichTextEditor from "../../articles/_components/RichTextEditor";
import CloudinaryUploader from "../../articles/_components/CloudinaryUploader";

const GROUPS = [
    { value: "", label: "Standalone page" },
    { value: "media-group-home", label: "Urugero Media Group landing" },
    { value: "media-group", label: "Urugero Media Group child" },
];

type Props = { page?: PageRow };

function slugify(val: string) {
    return val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function PageForm({ page }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [content, setContent] = useState(page?.content ?? "");
    const [heroImage, setHeroImage] = useState(page?.hero_image ?? "");

    const isEdit = Boolean(page);
    const defaultPageType = page?.slug === "urugero-media-group"
        ? "media-group-home"
        : page?.nav_group ?? "";

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const data = new FormData(e.currentTarget);

        const pageType = data.get("nav_group") as string;
        const isMediaGroupHome = pageType === "media-group-home";

        const payload = {
            title:        data.get("title") as string,
            slug:         isMediaGroupHome ? "urugero-media-group" : data.get("slug") as string,
            subtitle:     data.get("subtitle") as string,
            content,
            icon:         data.get("icon") as string,
            color:        data.get("color") as string,
            hero_image:   heroImage || null,
            nav_group:    pageType === "media-group" ? "media-group" : "",
            is_published: data.get("is_published") === "1",
            sort_order:   Number(data.get("sort_order")) || 0,
        };

        const url = isEdit ? `/api/admin/pages/${page!.id}` : "/api/admin/pages";
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

        startTransition(() => router.push("/admin/pages"));
    }

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>{isEdit ? "Edit page" : "New page"}</h1>
                <a href="/admin/pages" className={styles.backBtn}>← Back</a>
            </div>

            {error && <div className={styles.error} role="alert">{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                    <div className={styles.mainCol}>
                        <label className={styles.label}>
                            Title <span className={styles.req}>*</span>
                            <input
                                name="title"
                                defaultValue={page?.title}
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
                                defaultValue={page?.slug}
                                required
                                className={styles.input}
                                pattern="[a-z0-9-]+"
                                title="Lowercase letters, numbers and - only"
                            />
                            {page?.slug === "urugero-media-group" && (
                                <span className={styles.hint}>
                                    Keep this slug for the main Urugero Media Group page.
                                </span>
                            )}
                        </label>

                        <label className={styles.label}>
                            Subtitle / tagline
                            <input
                                name="subtitle"
                                defaultValue={page?.subtitle}
                                className={styles.input}
                                placeholder="Short tagline shown under the title"
                            />
                        </label>

                        <div className={styles.label}>
                            <span>Content</span>
                            <RichTextEditor value={content} onChange={setContent} />
                        </div>
                    </div>

                    <div className={styles.metaCol}>
                        <label className={styles.label}>
                            Type
                            <select name="nav_group" defaultValue={defaultPageType} className={styles.select}>
                                {GROUPS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                            </select>
                            <span className={styles.hint}>
                                Landing edits <strong>/urugero-media-group</strong>; child pages appear as cards and open under that page.
                            </span>
                        </label>

                        <label className={styles.label}>
                            Icon (emoji)
                            <input name="icon" defaultValue={page?.icon ?? ""} className={styles.input} placeholder="🎬" />
                        </label>

                        <label className={styles.label}>
                            Accent colour
                            <input type="color" name="color" defaultValue={page?.color ?? "#B80000"} className={styles.input} />
                        </label>

                        <label className={styles.label}>
                            Sort order
                            <input type="number" name="sort_order" defaultValue={page?.sort_order ?? 0} className={styles.input} />
                        </label>

                        <div className={styles.label}>
                            Hero image
                            <CloudinaryUploader value={heroImage} onChange={setHeroImage} />
                        </div>

                        <div className={styles.checkRow}>
                            <input
                                type="checkbox"
                                name="is_published"
                                value="1"
                                id="is_published"
                                defaultChecked={page ? page.is_published : true}
                                className={styles.checkbox}
                            />
                            <label htmlFor="is_published" className={styles.checkLabel}>
                                Publish to site
                            </label>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={isPending}>
                            {isPending ? "Saving..." : isEdit ? "Save changes" : "Create page"}
                        </button>

                        {isEdit && (
                            <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={async () => {
                                    if (!confirm("Delete this page? This cannot be undone.")) return;
                                    await fetch(`/api/admin/pages/${page!.id}`, { method: "DELETE" });
                                    router.push("/admin/pages");
                                }}
                            >
                                Delete page
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
