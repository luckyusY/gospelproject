"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ArticleRow } from "@/types/database";
import styles from "../../crud.module.css";

type Filter = "all" | "published" | "draft";

export default function ArticleListClient({ articles }: { articles: ArticleRow[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [query, setQuery]   = useState("");
    const [filter, setFilter] = useState<Filter>("all");
    const [busyId, setBusyId] = useState<number | null>(null);

    const categories = useMemo(
        () => Array.from(new Set(articles.map(a => a.category))).sort(),
        [articles],
    );
    const [category, setCategory] = useState<string>("");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return articles.filter(a => {
            if (filter === "published" && !a.is_published) return false;
            if (filter === "draft" && a.is_published) return false;
            if (category && a.category !== category) return false;
            if (q && !(`${a.title} ${a.excerpt} ${a.author}`.toLowerCase().includes(q))) return false;
            return true;
        });
    }, [articles, query, filter, category]);

    const publishedCount = articles.filter(a => a.is_published).length;
    const draftCount = articles.length - publishedCount;

    async function togglePublish(a: ArticleRow) {
        setBusyId(a.id);
        const next = !a.is_published;
        await fetch(`/api/admin/articles/${a.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                is_published: next,
                published_at: next ? (a.published_at ?? new Date().toISOString()) : null,
            }),
        });
        setBusyId(null);
        startTransition(() => router.refresh());
    }

    async function remove(a: ArticleRow) {
        if (!confirm(`Wifuza guhanagura "${a.title}"?`)) return;
        setBusyId(a.id);
        await fetch(`/api/admin/articles/${a.id}`, { method: "DELETE" });
        setBusyId(null);
        startTransition(() => router.refresh());
    }

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>Inyandiko</h1>
                <Link href="/admin/articles/new" className={styles.newBtn}>
                    + Inyandiko nshya
                </Link>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <input
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Shakisha umutwe, incamake, umwanditsi…"
                    className={styles.searchInput}
                />

                {categories.length > 0 && (
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="">Ibyiciro byose</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                )}

                <div className={styles.segmented}>
                    <button
                        className={filter === "all" ? styles.segActive : styles.seg}
                        onClick={() => setFilter("all")}
                    >
                        Byose ({articles.length})
                    </button>
                    <button
                        className={filter === "published" ? styles.segActive : styles.seg}
                        onClick={() => setFilter("published")}
                    >
                        Zashyizwe ({publishedCount})
                    </button>
                    <button
                        className={filter === "draft" ? styles.segActive : styles.seg}
                        onClick={() => setFilter("draft")}
                    >
                        Draft ({draftCount})
                    </button>
                </div>
            </div>

            <div className={styles.table}>
                <div className={styles.tableHead}>
                    <span>Umutwe</span>
                    <span>Icyiciro</span>
                    <span>Igenamiterere</span>
                    <span>Bikomeye</span>
                    <span>Ibikorwa</span>
                </div>

                {filtered.map(a => (
                    <div key={a.id} className={`${styles.tableRow} ${busyId === a.id ? styles.rowBusy : ""}`}>
                        <span className={styles.rowTitle}>{a.title}</span>
                        <span
                            className={styles.catChip}
                            style={{ backgroundColor: a.category_color + "22", color: a.category_color }}
                        >
                            {a.category}
                        </span>
                        <button
                            type="button"
                            onClick={() => togglePublish(a)}
                            disabled={busyId === a.id || isPending}
                            className={a.is_published ? styles.published : styles.draft}
                            title="Kanda uhindure imiterere"
                            style={{ cursor: "pointer", border: "none" }}
                        >
                            {a.is_published ? "Yashyizwe" : "Draft"}
                        </button>
                        <span className={styles.featured}>
                            {a.is_featured ? "⭐" : "—"}
                        </span>
                        <div className={styles.rowActions}>
                            <Link href={`/admin/articles/${a.id}/edit`} className={styles.editBtn}>
                                Hindura
                            </Link>
                            <Link href={`/amakuru/${a.slug}`} className={styles.viewBtn} target="_blank">
                                Reba
                            </Link>
                            <button
                                type="button"
                                onClick={() => remove(a)}
                                disabled={busyId === a.id || isPending}
                                className={styles.deleteRowBtn}
                            >
                                Siba
                            </button>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <p className={styles.empty}>
                        {articles.length === 0
                            ? "Nta nyandiko zibonetse."
                            : "Nta nyandiko ihuye n'ibyo ushaka."}
                    </p>
                )}
            </div>
        </div>
    );
}
