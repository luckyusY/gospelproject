"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { EventRow } from "@/types/database";
import styles from "../../form.module.css";
import CloudinaryUploader from "../../articles/_components/CloudinaryUploader";

type Props = { event?: EventRow };

const TAG_SUGGESTIONS = [
    "AMAKONFERANSI",
    "IBITARAMO BY'INDIRIMBO",
    "BIBLE QUIZ",
    "URUBYIRUKO",
    "ABAGORE",
    "UMURYANGO",
    "NOHELI",
    "IMIKORERE",
];

export default function EventForm({ event }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError]       = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState(event?.image_url ?? "");
    const [isFree, setIsFree]     = useState(event?.is_free ?? true);

    const isEdit = Boolean(event);

    function toLocalInput(value: string | null | undefined) {
        if (!value) return "";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "";
        // Format as yyyy-MM-ddThh:mm for <input type="datetime-local">
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const form = e.currentTarget;
        const data = new FormData(form);

        const rawDate = data.get("event_date") as string;
        if (!rawDate) {
            setError("Choose an event date.");
            return;
        }

        const payload = {
            title:        (data.get("title") as string).trim(),
            slug:         (data.get("slug") as string).trim(),
            description:  (data.get("description") as string).trim(),
            content:      ((data.get("content") as string) || "").trim() || null,
            image_url:    imageUrl || null,
            event_date:   new Date(rawDate).toISOString(),
            location:     (data.get("location") as string).trim(),
            price:        isFree ? null : ((data.get("price") as string).trim() || null),
            is_free:      isFree,
            tag:          (data.get("tag") as string).trim(),
            is_published: data.get("is_published") === "1",
        };

        const url = isEdit ? `/api/admin/events/${event!.id}` : "/api/admin/events";
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
            router.push("/admin/events");
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
                    {isEdit ? "Edit event" : "New event"}
                </h1>
                <a href="/admin/events" className={styles.backBtn}>← Back</a>
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
                                defaultValue={event?.title}
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
                                defaultValue={event?.slug}
                                required
                                className={styles.input}
                                pattern="[a-z0-9-]+"
                                title="Lowercase letters, numbers and - only"
                            />
                        </label>

                        <label className={styles.label}>
                            Short description <span className={styles.req}>*</span>
                            <textarea
                                name="description"
                                defaultValue={event?.description}
                                required
                                rows={3}
                                className={styles.textarea}
                            />
                        </label>

                        <label className={styles.label}>
                            Full details
                            <textarea
                                name="content"
                                defaultValue={event?.content ?? ""}
                                rows={10}
                                className={styles.textarea}
                                placeholder="Write the full event details. One paragraph per line."
                            />
                            <span className={styles.hint}>
                                One paragraph per line. This shows as the body on the site.
                            </span>
                        </label>
                    </div>

                    {/* Right column — meta */}
                    <div className={styles.metaCol}>
                        <label className={styles.label}>
                            Date &amp; time <span className={styles.req}>*</span>
                            <input
                                type="datetime-local"
                                name="event_date"
                                defaultValue={toLocalInput(event?.event_date)}
                                required
                                className={styles.input}
                            />
                        </label>

                        <label className={styles.label}>
                            Location <span className={styles.req}>*</span>
                            <input
                                name="location"
                                defaultValue={event?.location}
                                required
                                className={styles.input}
                                placeholder="Kigali Arena, Kigali"
                            />
                        </label>

                        <label className={styles.label}>
                            Event type <span className={styles.req}>*</span>
                            <input
                                name="tag"
                                defaultValue={event?.tag}
                                required
                                list="event-tags"
                                className={styles.input}
                                placeholder="AMAKONFERANSI"
                            />
                            <datalist id="event-tags">
                                {TAG_SUGGESTIONS.map(t => <option key={t} value={t} />)}
                            </datalist>
                        </label>

                        <div className={styles.checkRow}>
                            <input
                                type="checkbox"
                                id="is_free"
                                checked={isFree}
                                onChange={e => setIsFree(e.target.checked)}
                                className={styles.checkbox}
                            />
                            <label htmlFor="is_free" className={styles.checkLabel}>
                                Free entry
                            </label>
                        </div>

                        {!isFree && (
                            <label className={styles.label}>
                                Price
                                <input
                                    name="price"
                                    defaultValue={event?.price ?? ""}
                                    className={styles.input}
                                    placeholder="RWF 5,000"
                                />
                            </label>
                        )}

                        <div className={styles.label}>
                            Event image
                            <CloudinaryUploader value={imageUrl} onChange={setImageUrl} />
                        </div>

                        <div className={styles.checkRow}>
                            <input
                                type="checkbox"
                                name="is_published"
                                value="1"
                                id="is_published"
                                defaultChecked={event?.is_published}
                                className={styles.checkbox}
                            />
                            <label htmlFor="is_published" className={styles.checkLabel}>
                                Publish to site
                            </label>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={isPending}>
                            {isPending ? "Saving..." : isEdit ? "Save changes" : "Publish event"}
                        </button>

                        {isEdit && (
                            <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={async () => {
                                    if (!confirm("Delete this event? This cannot be undone.")) return;
                                    await fetch(`/api/admin/events/${event!.id}`, { method: "DELETE" });
                                    router.push("/admin/events");
                                    router.refresh();
                                }}
                            >
                                Delete event
                            </button>
                        )}
                    </div>

                </div>
            </form>
        </div>
    );
}
