"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { NavItemRow } from "@/types/database";
import styles from "../../crud.module.css";
import form from "../../form.module.css";

export default function MenuManager({ items }: { items: NavItemRow[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const refresh = () => startTransition(() => router.refresh());
    const [busyId, setBusyId] = useState<number | null>(null);

    const tops = items.filter(i => i.parent_id == null);
    const childrenOf = (id: number) => items.filter(i => i.parent_id === id);

    // Add-top-level form
    const [label, setLabel] = useState("");
    const [href, setHref] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function create(body: Record<string, unknown>) {
        const res = await fetch("/api/admin/nav", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            setError((json as { error?: string }).error ?? "Could not add the item.");
            return false;
        }
        refresh();
        return true;
    }

    async function addTop(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!label.trim()) { setError("Enter a label."); return; }
        const ok = await create({ label: label.trim(), href: href.trim(), sort_order: tops.length });
        if (ok) { setLabel(""); setHref(""); }
    }

    async function patch(item: NavItemRow, body: Record<string, unknown>) {
        setBusyId(item.id);
        await fetch(`/api/admin/nav/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        setBusyId(null);
        refresh();
    }

    async function remove(item: NavItemRow) {
        const childCount = childrenOf(item.id).length;
        const msg = childCount > 0
            ? `Delete "${item.label}" and its ${childCount} sub-item(s)?`
            : `Delete "${item.label}"?`;
        if (!confirm(msg)) return;
        setBusyId(item.id);
        await fetch(`/api/admin/nav/${item.id}`, { method: "DELETE" });
        setBusyId(null);
        refresh();
    }

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>Menu</h1>
                <a href="/admin" className={form.backBtn}>Back</a>
            </div>

            {/* Add top-level item */}
            <form onSubmit={addTop} className={styles.catAddForm}>
                <div className={styles.catAddRow}>
                    <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Menu label (e.g. Amakuru)" className={form.input} aria-label="Menu label" />
                    <input value={href} onChange={e => setHref(e.target.value)} placeholder="Link (e.g. /amakuru)" className={form.input} aria-label="Menu link" />
                    <button type="submit" className={styles.newBtn} disabled={isPending}>+ Add menu item</button>
                </div>
                {error && <div className={form.error} role="alert">{error}</div>}
            </form>

            {tops.length === 0 && (
                <p className={styles.empty}>
                    No menu items. The site is using its built-in default menu. Run <code>supabase/content_driven.sql</code> to seed an editable menu, or add items above.
                </p>
            )}

            {/* Top-level items with their children */}
            {tops.map(top => (
                <div key={top.id} className={form.form} style={{ marginBottom: "1.5rem", opacity: busyId === top.id ? 0.6 : 1 }}>
                    <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
                        <input
                            defaultValue={top.label}
                            onBlur={e => { if (e.target.value.trim() && e.target.value !== top.label) patch(top, { label: e.target.value.trim() }); }}
                            className={form.input}
                            style={{ flex: "1 1 160px" }}
                            aria-label="Label"
                        />
                        <input
                            defaultValue={top.href}
                            onBlur={e => { if (e.target.value !== top.href) patch(top, { href: e.target.value.trim() }); }}
                            className={form.input}
                            style={{ flex: "1 1 160px" }}
                            placeholder="/path"
                            aria-label="Link"
                        />
                        <input
                            type="number"
                            defaultValue={top.sort_order}
                            onBlur={e => { const n = Number(e.target.value) || 0; if (n !== top.sort_order) patch(top, { sort_order: n }); }}
                            className={form.input}
                            style={{ width: 64 }}
                            aria-label="Order"
                            title="Order"
                        />
                        <label className={form.checkLabel} style={{ margin: 0 }}>
                            <input type="checkbox" className={form.checkbox} defaultChecked={top.is_mega} onChange={e => patch(top, { is_mega: e.target.checked })} /> Mega
                        </label>
                        <label className={form.checkLabel} style={{ margin: 0 }}>
                            <input type="checkbox" className={form.checkbox} defaultChecked={top.is_visible} onChange={e => patch(top, { is_visible: e.target.checked })} /> Visible
                        </label>
                        <button type="button" className={styles.deleteRowBtn} onClick={() => remove(top)}>Delete</button>
                    </div>

                    {/* Children */}
                    <div style={{ marginTop: "0.75rem", paddingLeft: "1.25rem", borderLeft: "2px solid var(--border, #D8D8D8)" }}>
                        {childrenOf(top.id).map(child => (
                            <div key={child.id} style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap", opacity: busyId === child.id ? 0.6 : 1 }}>
                                <input
                                    defaultValue={child.label}
                                    onBlur={e => { if (e.target.value.trim() && e.target.value !== child.label) patch(child, { label: e.target.value.trim() }); }}
                                    className={form.input}
                                    style={{ flex: "1 1 150px" }}
                                    aria-label="Sub-item label"
                                />
                                <input
                                    defaultValue={child.href}
                                    onBlur={e => { if (e.target.value !== child.href) patch(child, { href: e.target.value.trim() }); }}
                                    className={form.input}
                                    style={{ flex: "1 1 150px" }}
                                    placeholder="/path"
                                    aria-label="Sub-item link"
                                />
                                <input
                                    type="number"
                                    defaultValue={child.sort_order}
                                    onBlur={e => { const n = Number(e.target.value) || 0; if (n !== child.sort_order) patch(child, { sort_order: n }); }}
                                    className={form.input}
                                    style={{ width: 60 }}
                                    aria-label="Sub-item order"
                                />
                                <button type="button" className={styles.deleteRowBtn} onClick={() => remove(child)}>✕</button>
                            </div>
                        ))}
                        <AddChild parentId={top.id} childCount={childrenOf(top.id).length} onAdd={create} />
                    </div>
                </div>
            ))}
        </div>
    );
}

function AddChild({ parentId, childCount, onAdd }: { parentId: number; childCount: number; onAdd: (body: Record<string, unknown>) => Promise<boolean> }) {
    const [label, setLabel] = useState("");
    const [href, setHref] = useState("");

    async function add(e: React.FormEvent) {
        e.preventDefault();
        if (!label.trim()) return;
        const ok = await onAdd({ label: label.trim(), href: href.trim(), parent_id: parentId, sort_order: childCount });
        if (ok) { setLabel(""); setHref(""); }
    }

    return (
        <form onSubmit={add} style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.4rem", flexWrap: "wrap" }}>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="+ sub-item label" className={form.input} style={{ flex: "1 1 150px" }} aria-label="New sub-item label" />
            <input value={href} onChange={e => setHref(e.target.value)} placeholder="/path" className={form.input} style={{ flex: "1 1 150px" }} aria-label="New sub-item link" />
            <button type="submit" className={styles.viewBtn}>Add</button>
        </form>
    );
}
