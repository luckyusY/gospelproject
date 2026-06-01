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
            setError("Andika ubuhamya mbere yo kububika.");
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
            setError((json as { error?: string }).error ?? "Hari ikibazo. Gerageza nanone.");
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
                    {isEdit ? "Hindura ubuhamya" : "Ubuhamya bushya"}
                </h1>
                <a href="/admin/testimonies" className={styles.backBtn}>← Subira</a>
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
                                title="Gusa inyuguti nto, imibare, na -"
                            />
                        </label>

                        <label className={styles.label}>
                            Incamake <span className={styles.req}>*</span>
                            <textarea
                                name="excerpt"
                                defaultValue={testimony?.excerpt}
                                required
                                rows={3}
                                className={styles.textarea}
                            />
                        </label>

                        <label className={styles.label}>
                            Ubuhamya <span className={styles.req}>*</span>
                            <textarea
                                name="content"
                                defaultValue={testimony?.content ?? ""}
                                required
                                rows={16}
                                className={styles.textarea}
                                placeholder={"Andika ubuhamya hano.\n\n## Umutwe w'igice\nIgice cy'ubuhamya...\n\n## Indi ngingo\nIbindi..."}
                            />
                            <span className={styles.hint}>
                                Koresha <code>## Umutwe</code> mu murongo wihariye kugira ngo utandukanye ibice. Buri paragarafu mu murongo wayo.
                            </span>
                        </label>
                    </div>

                    {/* Right column — meta */}
                    <div className={styles.metaCol}>
                        <label className={styles.label}>
                            Uwatanze ubuhamya <span className={styles.req}>*</span>
                            <input
                                name="person_name"
                                defaultValue={testimony?.person_name}
                                required
                                className={styles.input}
                                placeholder="Jean Bosco"
                            />
                        </label>

                        <label className={styles.label}>
                            Itorero / Kiliziya
                            <input
                                name="person_church"
                                defaultValue={testimony?.person_church ?? ""}
                                className={styles.input}
                                placeholder="ADEPR Kigali"
                            />
                        </label>

                        <div className={styles.label}>
                            Ifoto y&apos;uwatanze ubuhamya
                            <CloudinaryUploader value={avatarUrl} onChange={setAvatarUrl} />
                        </div>

                        <div className={styles.label}>
                            Ifoto y&apos;ingenzi
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
                                Shyira ku rubuga
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
                                Ubuhamya bukomeye
                            </label>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={isPending}>
                            {isPending ? "Biga..." : isEdit ? "Bika impinduka" : "Shyiraho ubuhamya"}
                        </button>

                        {isEdit && (
                            <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={async () => {
                                    if (!confirm("Wifuza guhanagura ubu buhamya?")) return;
                                    await fetch(`/api/admin/testimonies/${testimony!.id}`, { method: "DELETE" });
                                    router.push("/admin/testimonies");
                                    router.refresh();
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
