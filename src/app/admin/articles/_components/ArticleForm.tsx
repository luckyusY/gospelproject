"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ArticleRow } from "@/types/database";
import styles from "../../form.module.css";

type Category = { slug: string; name: string; color: string };
type Props = { article?: ArticleRow; categories: Category[] };

export default function ArticleForm({ article, categories }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const isEdit = Boolean(article);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const form = e.currentTarget;
        const data = new FormData(form);

        const payload = {
            title:          data.get("title") as string,
            slug:           data.get("slug") as string,
            excerpt:        data.get("excerpt") as string,
            content:        data.get("content") as string,
            image_url:      (data.get("image_url") as string) || null,
            category:       data.get("category") as string,
            category_color: categories.find(c => c.slug === data.get("category"))?.color ?? "#B80000",
            author:         data.get("author") as string,
            read_time:      data.get("read_time") as string,
            is_published:   data.get("is_published") === "1",
            is_featured:    data.get("is_featured") === "1",
            published_at:   data.get("is_published") === "1" ? new Date().toISOString() : null,
        };

        const url = isEdit
            ? `/api/admin/articles/${article!.id}`
            : "/api/admin/articles";
        const method = isEdit ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            setError((json as { error?: string }).error ?? "Hari ikibazo. Gerageza nanone.");
            return;
        }

        startTransition(() => router.push("/admin/articles"));
    }

    function slugify(val: string) {
        return val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>
                    {isEdit ? "Hindura inyandiko" : "Inyandiko nshya"}
                </h1>
                <a href="/admin/articles" className={styles.backBtn}>← Subira</a>
            </div>

            {error && <div className={styles.error} role="alert">{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>

                    {/* Left column — main content */}
                    <div className={styles.mainCol}>
                        <label className={styles.label}>
                            Umutwe <span className={styles.req}>*</span>
                            <input
                                name="title"
                                defaultValue={article?.title}
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
                                defaultValue={article?.slug}
                                required
                                className={styles.input}
                                pattern="[a-z0-9-]+"
                                title="Gusa inyuguti nto, imibare, na -"
                            />
                        </label>

                        <label className={styles.label}>
                            Incamake <span className={styles.req}>*</span>
                            <textarea
                                name="excerpt"
                                defaultValue={article?.excerpt}
                                required
                                rows={3}
                                className={styles.textarea}
                            />
                        </label>

                        <label className={styles.label}>
                            Ibiri mu nyandiko <span className={styles.req}>*</span>
                            <textarea
                                name="content"
                                defaultValue={article?.content}
                                required
                                rows={16}
                                className={styles.textarea}
                                placeholder={"## Umutwe w'igice\n\nIngingo za mbere...\n\n## Igice cya 2\n\nIngingo..."}
                            />
                            <span className={styles.hint}>Koresha ## kugira ngo wongere imitwe y&apos;ibice</span>
                        </label>
                    </div>

                    {/* Right column — meta */}
                    <div className={styles.metaCol}>
                        <label className={styles.label}>
                            Icyiciro <span className={styles.req}>*</span>
                            <select name="category" defaultValue={article?.category} required className={styles.select}>
                                {categories.map(c => (
                                    <option key={c.slug} value={c.slug}>{c.name}</option>
                                ))}
                            </select>
                        </label>

                        <label className={styles.label}>
                            Wanditse na <span className={styles.req}>*</span>
                            <input
                                name="author"
                                defaultValue={article?.author ?? "Urugero Media"}
                                required
                                className={styles.input}
                            />
                        </label>

                        <label className={styles.label}>
                            Igihe cyo gusoma
                            <input
                                name="read_time"
                                defaultValue={article?.read_time ?? "3 min"}
                                className={styles.input}
                                placeholder="3 min"
                            />
                        </label>

                        <label className={styles.label}>
                            Ifoto (URL)
                            <input
                                name="image_url"
                                defaultValue={article?.image_url ?? ""}
                                className={styles.input}
                                type="url"
                                placeholder="https://..."
                            />
                        </label>

                        <div className={styles.checkRow}>
                            <input
                                type="checkbox"
                                name="is_published"
                                value="1"
                                id="is_published"
                                defaultChecked={article?.is_published}
                                className={styles.checkbox}
                            />
                            <label htmlFor="is_published" className={styles.checkLabel}>
                                Shyira ku rubuga
                            </label>
                        </div>

                        <div className={styles.checkRow}>
                            <input
                                type="checkbox"
                                name="is_featured"
                                value="1"
                                id="is_featured"
                                defaultChecked={article?.is_featured}
                                className={styles.checkbox}
                            />
                            <label htmlFor="is_featured" className={styles.checkLabel}>
                                Inyandiko ikomeye
                            </label>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={isPending}>
                            {isPending ? "Biga..." : isEdit ? "Bika impinduka" : "Shyiraho inyandiko"}
                        </button>

                        {isEdit && (
                            <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={async () => {
                                    if (!confirm("Wifuza guhanagura iyi nyandiko?")) return;
                                    await fetch(`/api/admin/articles/${article!.id}`, { method: "DELETE" });
                                    router.push("/admin/articles");
                                }}
                            >
                                Hanagura
                            </button>
                        )}
                    </div>

                </div>
            </form>
        </div>
    );
}
