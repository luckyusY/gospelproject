import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import type { ArticleRow, EventRow, TestimonyRow } from "@/types/database";
import styles from "./dashboard.module.css";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
    const admin = supabaseAdmin();

    const [
        articlesTotal,
        articlesPublished,
        eventsTotal,
        eventsPublished,
        testimoniesTotal,
        testimoniesPublished,
        pendingComments,
        recentArticlesResult,
        recentEventsResult,
        recentTestimoniesResult,
    ] = await Promise.all([
        admin.from("articles").select("*", { count: "exact", head: true }),
        admin.from("articles").select("*", { count: "exact", head: true }).eq("is_published", true),
        admin.from("events").select("*", { count: "exact", head: true }),
        admin.from("events").select("*", { count: "exact", head: true }).eq("is_published", true),
        admin.from("testimonies").select("*", { count: "exact", head: true }),
        admin.from("testimonies").select("*", { count: "exact", head: true }).eq("is_published", true),
        admin.from("radio_comments").select("*", { count: "exact", head: true }).eq("is_approved", false),
        admin.from("articles").select("*").order("created_at", { ascending: false }).limit(5),
        admin.from("events").select("*").order("event_date", { ascending: false }).limit(4),
        admin.from("testimonies").select("*").order("created_at", { ascending: false }).limit(4),
    ]);

    const recentArticles    = (recentArticlesResult.data ?? []) as ArticleRow[];
    const recentEvents       = (recentEventsResult.data ?? []) as EventRow[];
    const recentTestimonies  = (recentTestimoniesResult.data ?? []) as TestimonyRow[];

    const stats = [
        {
            label: "Inyandiko",
            count: articlesTotal.count ?? 0,
            published: articlesPublished.count ?? 0,
            href: "/admin/articles",
            color: "#B80000",
        },
        {
            label: "Ibikorwa",
            count: eventsTotal.count ?? 0,
            published: eventsPublished.count ?? 0,
            href: "/admin/events",
            color: "#1F3A8A",
        },
        {
            label: "Ubuhamya",
            count: testimoniesTotal.count ?? 0,
            published: testimoniesPublished.count ?? 0,
            href: "/admin/testimonies",
            color: "#EB0000",
        },
    ];

    const pending = pendingComments.count ?? 0;

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
                        <span className={styles.statSub}>
                            {s.published} zashyizwe · {s.count - s.published} draft
                        </span>
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
                {pending > 0 && (
                    <a href="/admin/media" className={styles.alertBanner}>
                        💬 Hari {pending} {pending === 1 ? "igitekerezo gitegereje" : "ibitekerezo bitegereje"} kwemezwa kuri radiyo.
                    </a>
                )}
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

            {/* Recent events + testimonies side by side */}
            <div className={styles.twoCol}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Ibikorwa bya vuba</h2>
                    <div className={styles.table}>
                        {recentEvents.map(ev => (
                            <div key={ev.id} className={styles.tableRowSimple}>
                                <span className={styles.tableTitle}>{ev.title}</span>
                                <span className={ev.is_published ? styles.published : styles.draft}>
                                    {ev.is_published ? "Yashyizwe" : "Draft"}
                                </span>
                                <a href={`/admin/events/${ev.id}/edit`} className={styles.editLink}>
                                    Hindura
                                </a>
                            </div>
                        ))}
                        {recentEvents.length === 0 && (
                            <p className={styles.empty}>Nta bikorwa birabonetse.</p>
                        )}
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Ubuhamya bwa vuba</h2>
                    <div className={styles.table}>
                        {recentTestimonies.map(t => (
                            <div key={t.id} className={styles.tableRowSimple}>
                                <span className={styles.tableTitle}>{t.title}</span>
                                <span className={t.is_published ? styles.published : styles.draft}>
                                    {t.is_published ? "Yashyizwe" : "Draft"}
                                </span>
                                <a href={`/admin/testimonies/${t.id}/edit`} className={styles.editLink}>
                                    Hindura
                                </a>
                            </div>
                        ))}
                        {recentTestimonies.length === 0 && (
                            <p className={styles.empty}>Nta buhamya buraboneka.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
