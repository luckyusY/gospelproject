import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import type { ArticleRow } from "@/types/database";
import styles from "./dashboard.module.css";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
    const admin = supabaseAdmin();

    const [
        { count: articleCount },
        { count: eventCount },
        { count: testimonyCount },
        recentResult,
    ] = await Promise.all([
        admin.from("articles").select("*", { count: "exact", head: true }),
        admin.from("events").select("*", { count: "exact", head: true }),
        admin.from("testimonies").select("*", { count: "exact", head: true }),
        admin.from("articles")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5),
    ]);

    const recentArticles = (recentResult.data ?? []) as ArticleRow[];

    const stats = [
        { label: "Inyandiko", count: articleCount ?? 0, href: "/admin/articles", color: "#B80000" },
        { label: "Ibikorwa",  count: eventCount ?? 0,   href: "/admin/events",   color: "#B80000" },
        { label: "Ubuhamya",  count: testimonyCount ?? 0, href: "/admin/testimonies", color: "#EB0000" },
    ];

    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Dashboard</h1>

            {/* Stat cards */}
            <div className={styles.statsGrid}>
                {stats.map(s => (
                    <a key={s.label} href={s.href} className={styles.statCard}>
                        <span className={styles.statCount} style={{ color: s.color }}>
                            {s.count}
                        </span>
                        <span className={styles.statLabel}>{s.label}</span>
                    </a>
                ))}
            </div>

            {/* Quick actions */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Ibintu bishya</h2>
                <div className={styles.quickActions}>
                    <a href="/admin/articles/new" className={styles.actionBtn}>
                        + Inyandiko nshya
                    </a>
                    <a href="/admin/events/new" className={styles.actionBtn}>
                        + Igikorwa gishya
                    </a>
                    <a href="/admin/testimonies/new" className={styles.actionBtn}>
                        + Ubuhamya bushya
                    </a>
                </div>
            </div>

            {/* Recent articles */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Inyandiko za vuba</h2>
                <div className={styles.table}>
                    <div className={styles.tableHead}>
                        <span>Umutwe</span>
                        <span>Icyiciro</span>
                        <span>Igenamiterere</span>
                        <span></span>
                    </div>
                    {recentArticles.map(a => (
                        <div key={a.id} className={styles.tableRow}>
                            <span className={styles.tableTitle}>{a.title}</span>
                            <span className={styles.tableCategory}>{a.category}</span>
                            <span className={a.is_published ? styles.published : styles.draft}>
                                {a.is_published ? "Yashyizwe" : "Draft"}
                            </span>
                            <a href={`/admin/articles/${a.id}/edit`} className={styles.editLink}>
                                Hindura
                            </a>
                        </div>
                    ))}
                    {recentArticles.length === 0 && (
                        <p className={styles.empty}>Nta nyandiko zibonetse.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
