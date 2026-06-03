"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CategoryRow } from "@/types/database";
import styles from "../../crud.module.css";
import form from "../../form.module.css";

const PRESET_COLORS = [
    "#B80000", "#EB0000", "#7C3AED", "#059669", "#047857",
    "#1E40AF", "#0D1B2E", "#F59E0B", "#DC2626", "#0891B2",
];

const GROUPS = [
    { value: "",          label: "— None (top-level)" },
    { value: "amakuru",   label: "Amakuru" },
    { value: "inyigisho", label: "Inyigisho" },
];

function slugify(val: string) {
    return val.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function basePathFor(navGroup: string | null) {
    return navGroup === "inyigisho" ? "/inyigisho" : "/amakuru";
}

export default function CategoryManager({ categories }: { categories: CategoryRow[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const refresh = () => startTransition(() => router.refresh());

    // Add-form state
    const [name, setName]   = useState("");
    const [slug, setSlug]   = useState("");
    const [color, setColor] = useState(PRESET_COLORS[0]);
    const [navGroup, setNavGroup] = useState("");
    const [icon, setIcon] = useState("");
    const [description, setDescription] = useState("");
    const [slugTouched, setSlugTouched] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);

    async function addCategory(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        const finalSlug = slug.trim() || slugify(name);
        if (!name.trim() || !finalSlug) {
            setError("Enter a category name.");
            return;
        }

        const res = await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name.trim(),
                slug: finalSlug,
                color,
                nav_group: navGroup,
                icon: icon.trim(),
                description: description.trim(),
                sort_order: categories.filter(c => (c.nav_group ?? "") === navGroup).length,
            }),
        });

        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            setError((json as { error?: string }).error ?? "Something went wrong. Please try again.");
            return;
        }

        setName(""); setSlug(""); setSlugTouched(false);
        setColor(PRESET_COLORS[0]); setNavGroup(""); setIcon(""); setDescription("");
        refresh();
    }

    async function patchCategory(cat: CategoryRow, body: Record<string, unknown>) {
        setBusyId(cat.id);
        const res = await fetch(`/api/admin/categories/${cat.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        setBusyId(null);
        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            alert((json as { error?: string }).error ?? "Could not save the category.");
            return;
        }
        refresh();
    }

    async function remove(cat: CategoryRow) {
        if (!confirm(`Delete the "${cat.name}" category?`)) return;
        setBusyId(cat.id);
        const res = await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
        setBusyId(null);
        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            alert((json as { error?: string }).error ?? "Could not delete the category.");
            return;
        }
        refresh();
    }

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>Categories</h1>
                <a href="/admin" className={form.backBtn}>Back</a>
            </div>

            {/* Add form */}
            <form onSubmit={addCategory} className={styles.catAddForm}>
                <div className={form.formGrid} style={{ gap: "0.75rem" }}>
                    <input
                        value={name}
                        onChange={e => { setName(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }}
                        placeholder="Name (e.g. Sport)"
                        className={form.input}
                        aria-label="Category name"
                    />
                    <input
                        value={slug}
                        onChange={e => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
                        placeholder="slug (e.g. sport)"
                        className={form.input}
                        pattern="[a-z0-9-]+"
                        aria-label="Slug"
                    />
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <select value={navGroup} onChange={e => setNavGroup(e.target.value)} className={form.input} aria-label="Menu group">
                            {GROUPS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                        </select>
                        <input
                            value={icon}
                            onChange={e => setIcon(e.target.value)}
                            placeholder="Icon (emoji)"
                            className={form.input}
                            style={{ maxWidth: 110 }}
                            aria-label="Icon"
                        />
                        <input
                            type="color"
                            value={color}
                            onChange={e => setColor(e.target.value)}
                            className={styles.catColorPicker}
                            aria-label="Colour"
                        />
                    </div>
                    <input
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Short description (shown on the section page)"
                        className={form.input}
                        aria-label="Description"
                    />
                    <button type="submit" className={styles.newBtn} disabled={isPending} style={{ maxWidth: 160 }}>
                        + Add category
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
                            aria-label={`Pick colour ${c}`}
                        />
                    ))}
                </div>
                {error && <div className={form.error} role="alert">{error}</div>}
            </form>

            {/* List as editable cards */}
            <div className={styles.table}>
                <div className={styles.tableHead} style={{ gridTemplateColumns: "auto 1fr auto auto auto auto" }}>
                    <span>Colour</span><span>Name</span><span>Group</span><span>Order</span><span>In menu</span><span>Actions</span>
                </div>
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        className={`${styles.tableRow} ${busyId === cat.id ? styles.rowBusy : ""}`}
                        style={{ gridTemplateColumns: "auto 1fr auto auto auto auto", alignItems: "center" }}
                    >
                        <label className={styles.catColorCell} style={{ backgroundColor: cat.color }}>
                            <input
                                type="color"
                                defaultValue={cat.color}
                                onChange={e => patchCategory(cat, { color: e.target.value })}
                                aria-label={`Change colour for ${cat.name}`}
                            />
                        </label>
                        <div style={{ minWidth: 0 }}>
                            <input
                                defaultValue={cat.name}
                                onBlur={e => { if (e.target.value.trim() && e.target.value !== cat.name) patchCategory(cat, { name: e.target.value.trim() }); }}
                                className={form.input}
                                aria-label={`Name for ${cat.slug}`}
                            />
                            <span className={styles.catSlug}>{basePathFor(cat.nav_group)}/{cat.slug}</span>
                        </div>
                        <select
                            defaultValue={cat.nav_group ?? ""}
                            onChange={e => patchCategory(cat, { nav_group: e.target.value })}
                            className={form.input}
                            aria-label={`Group for ${cat.name}`}
                        >
                            {GROUPS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                        </select>
                        <input
                            type="number"
                            defaultValue={cat.sort_order}
                            onBlur={e => { const n = Number(e.target.value) || 0; if (n !== cat.sort_order) patchCategory(cat, { sort_order: n }); }}
                            className={form.input}
                            style={{ width: 64 }}
                            aria-label={`Order for ${cat.name}`}
                        />
                        <input
                            type="checkbox"
                            defaultChecked={cat.show_in_nav}
                            onChange={e => patchCategory(cat, { show_in_nav: e.target.checked })}
                            className={form.checkbox}
                            aria-label={`Show ${cat.name} in menu`}
                        />
                        <div className={styles.rowActions}>
                            <a href={`${basePathFor(cat.nav_group)}/${cat.slug}`} target="_blank" className={styles.viewBtn} rel="noreferrer">
                                View
                            </a>
                            <button
                                type="button"
                                onClick={() => remove(cat)}
                                disabled={busyId === cat.id || isPending}
                                className={styles.deleteRowBtn}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                {categories.length === 0 && (
                    <p className={styles.empty}>No categories yet.</p>
                )}
            </div>

            <p className={styles.catHint}>
                The <strong>Group</strong> controls which menu a category lives under (Amakuru or Inyigisho) and which page
                its listing appears on. Categories appear in the article editor&apos;s category dropdown. A category in use
                by articles can&apos;t be deleted.
            </p>
        </div>
    );
}
