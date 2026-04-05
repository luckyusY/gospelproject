import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import type { ArticleRow } from "@/types/database";
import styles from "../crud.module.css";

export const metadata: Metadata = { title: "Inyandiko" };

export default async function AdminArticlesPage() {
    const result = await supabaseAdmin()
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
    const articles = (result.data ?? []) as ArticleRow[];

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>Inyandiko</h1>
                <Link href="/admin/articles/new" className={styles.newBtn}>
                    + Inyandiko nshya
                </Link>
            </div>

            <div className={styles.table}>
                <div className={styles.tableHead}>
                    <span>Umutwe</span>
                    <span>Icyiciro</span>
                    <span>Igenamiterere</span>
                    <span>Bikomeye</span>
                    <span>Ibikorwa</span>
                </div>

                {articles.map(a => (
                    <div key={a.id} className={styles.tableRow}>
                        <span className={styles.rowTitle}>{a.title}</span>
                        <span
                            className={styles.catChip}
                            style={{ backgroundColor: a.category_color + "22", color: a.category_color }}
                        >
                            {a.category}
                        </span>
                        <span className={a.is_published ? styles.published : styles.draft}>
                            {a.is_published ? "Yashyizwe" : "Draft"}
                        </span>
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
                        </div>
                    </div>
                ))}

                {articles.length === 0 && (
                    <p className={styles.empty}>Nta nyandiko zibonetse.</p>
                )}
            </div>
        </div>
    );
}
