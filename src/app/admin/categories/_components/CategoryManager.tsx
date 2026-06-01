"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CategoryRow } from "@/types/database";
import styles from "../../crud.module.css";

const PRESET_COLORS = [
    "#B80000", "#EB0000", "#7C3AED", "#059669", "#047857",
    "#1E40AF", "#0D1B2E", "#F59E0B", "#DC2626", "#0891B2",
];

function slugify(val: string) {
    return val.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function CategoryManager({ categories }: { categories: CategoryRow[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [name, setName]   = useState("");
    const [slug, setSlug]   = useState("");
    const [color, setColor] = useState(PRESET_COLORS[0]);
    const [slugTouched, setSlugTouched] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);

    function refresh() {
        startTransition(() => router.refresh());
    }

    async function addCategory(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        const finalSlug = slug.trim() || slugify(name);
        if (!name.trim() || !finalSlug) {
            setError("Andika izina ry'icyiciro.");
            return;
        }

        const res = await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name.trim(), slug: finalSlug, color }),
        });

        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            setError((json as { error?: string }).error ?? "Hari ikibazo. Gerageza nanone.");
            return;
        }

        setName("");
        setSlug("");
        setSlugTouched(false);
        setColor(PRESET_COLORS[0]);
        refresh();
    }

    async function updateColor(cat: CategoryRow, newColor: string) {
        setBusyId(cat.id);
        await fetch(`/api/admin/categories/${cat.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ color: newColor }),
        });
        setBusyId(null);
        refresh();
    }

    async function remove(cat: CategoryRow) {
        if (!confirm(`Wifuza guhanagura icyiciro "${cat.name}"?`)) return;
        setBusyId(cat.id);
        const res = await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
        setBusyId(null);
        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            alert((json as { error?: string }).error ?? "Ntibishobotse gusiba icyiciro.");
            return;
        }
        refresh();
    }

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>Ibyiciro by&apos;amakuru</h1>
            </div>

            {/* Add form */}
            <form onSubmit={addCategory} className={styles.catAddForm}>
                <div className={styles.catAddRow}>
                    <input
                        value={name}
                        onChange={e => {
                            setName(e.target.value);
                            if (!slugTouched) setSlug(slugify(e.target.value));
                        }}
                        placeholder="Izina (urugero: Sport)"
                        className={styles.searchInput}
                        aria-label="Izina ry'icyiciro"
                    />
                    <input
                        value={slug}
                        onChange={e => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
                        placeholder="slug (sport)"
                        className={styles.searchInput}
                        pattern="[a-z0-9-]+"
                        aria-label="Slug"
                    />
                    <input
                        type="color"
                        value={color}
                        onChange={e => setColor(e.target.value)}
                        className={styles.catColorPicker}
                        aria-label="Ibara"
                    />
                    <button type="submit" className={styles.newBtn} disabled={isPending}>
                        + Ongeraho
                    </button>
                </div>
                <div className={styles.catPresets}>
                    {PRESET_COLORS.map(c => (
                        <button
                            type="button"
                            key={c}
                            className={styles.catSwatch}
                            style={{ backgroundColor: c, outline: color === c ? "2px solid var(--text)" : "none" }}
                            onClick={() => setColor(c)}
                            aria-label={`Hitamo ibara ${c}`}
                        />
                    ))}
                </div>
                {error && <div className={styles.error} role="alert">{error}</div>}
            </form>

            {/* List */}
            <div className={styles.table}>
                <div className={styles.tableHead} style={{ gridTemplateColumns: "auto 1fr auto auto" }}>
                    <span>Ibara</span><span>Izina</span><span>Slug</span><span>Ibikorwa</span>
                </div>
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        className={`${styles.tableRow} ${busyId === cat.id ? styles.rowBusy : ""}`}
                        style={{ gridTemplateColumns: "auto 1fr auto auto" }}
                    >
                        <label className={styles.catColorCell} style={{ backgroundColor: cat.color }}>
                            <input
                                type="color"
                                defaultValue={cat.color}
                                onChange={e => updateColor(cat, e.target.value)}
                                aria-label={`Hindura ibara rya ${cat.name}`}
                            />
                        </label>
                        <span className={styles.rowTitle}>{cat.name}</span>
                        <span className={styles.catSlug}>/amakuru/{cat.slug}</span>
                        <div className={styles.rowActions}>
                            <a href={`/amakuru/${cat.slug}`} target="_blank" className={styles.viewBtn} rel="noreferrer">
                                Reba
                            </a>
                            <button
                                type="button"
                                onClick={() => remove(cat)}
                                disabled={busyId === cat.id || isPending}
                                className={styles.deleteRowBtn}
                            >
                                Siba
                            </button>
                        </div>
                    </div>
                ))}
                {categories.length === 0 && (
                    <p className={styles.empty}>Nta byiciro bibonetse.</p>
                )}
            </div>

            <p className={styles.catHint}>
                Ibyiciro byongerwaho hano bigaragara mu ihitamo ry&apos;inyandiko nshya. Icyiciro gikoreshwa n&apos;inyandiko ntigishobora gusibwa.
            </p>
        </div>
    );
}
