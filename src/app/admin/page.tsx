import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin, isFullAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { AnalyticsPageViewRow, ArticleRow, EventRow, TestimonyRow } from "@/types/database";
import styles from "./dashboard.module.css";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
    const currentAdmin = await getCurrentAdmin();
    if (currentAdmin && !isFullAdmin(currentAdmin)) {
        redirect("/admin/articles");
    }

    const admin = supabaseAdmin();
    // Server component renders per-request; current time is stable within a render.
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const dayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
        articlesTotal,
        articlesPublished,
        eventsTotal,
        eventsPublished,
        testimoniesTotal,
        testimoniesPublished,
        pendingComments,
        pendingArticleComments,
        analyticsTotal,
        analyticsToday,
        analyticsRecentResult,
        analyticsWeekResult,
        analyticsFallbackResult,
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
        admin.from("article_comments").select("*", { count: "exact", head: true }).eq("is_approved", false),
        admin.from("analytics_page_views").select("*", { count: "exact", head: true }),
        admin
            .from("analytics_page_views")
            .select("*", { count: "exact", head: true })
            .gte("created_at", dayAgo),
        admin
            .from("analytics_page_views")
            .select("path, title, referrer, visitor_id, session_id, country, user_agent, created_at")
            .order("created_at", { ascending: false })
            .limit(12),
        admin
            .from("analytics_page_views")
            .select("path, title, referrer, visitor_id, session_id, country, user_agent, created_at")
            .gte("created_at", weekAgo)
            .order("created_at", { ascending: false })
            .limit(500),
        admin
            .from("site_settings")
            .select("value")
            .eq("key", "analytics_recent_views")
            .maybeSingle(),
        admin.from("articles").select("*").order("created_at", { ascending: false }).limit(5),
        admin.from("events").select("*").order("event_date", { ascending: false }).limit(4),
        admin.from("testimonies").select("*").order("created_at", { ascending: false }).limit(4),
    ]);

    const recentArticles    = (recentArticlesResult.data ?? []) as ArticleRow[];
    const recentEvents       = (recentEventsResult.data ?? []) as EventRow[];
    const recentTestimonies  = (recentTestimoniesResult.data ?? []) as TestimonyRow[];
    const fallbackViews = parseFallbackAnalyticsViews(
        typeof analyticsFallbackResult.data?.value === "string"
            ? analyticsFallbackResult.data.value
            : "[]"
    );
    const tableViews = (analyticsRecentResult.data ?? []) as AnalyticsViewSummary[];
    const recentViews = tableViews.length > 0 ? tableViews : fallbackViews;
    const weekViews = analyticsWeekResult.error
        ? fallbackViews
        : (analyticsWeekResult.data ?? []) as AnalyticsViewSummary[];
    const analyticsReady = (!analyticsTotal.error && !analyticsToday.error && !analyticsRecentResult.error)
        || fallbackViews.length > 0;
    const analyticsUsingFallback = Boolean(analyticsTotal.error || analyticsToday.error || analyticsRecentResult.error);
    const uniqueVisitorsToday = new Set(
        recentViews
            .filter(view => new Date(view.created_at).getTime() >= now - 24 * 60 * 60 * 1000)
            .map(view => view.visitor_id)
            .filter(Boolean)
    ).size;
    const topPages = Array.from(
        weekViews.reduce((map, view) => {
            map.set(view.path, (map.get(view.path) ?? 0) + 1);
            return map;
        }, new Map<string, number>())
    )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    const topCountries = countBy(weekViews, view => countryLabel(view.country)).slice(0, 6);
    const topDevices = countBy(weekViews, view => detectDevice(view.user_agent)).slice(0, 5);
    const topBrowsers = countBy(weekViews, view => detectBrowser(view.user_agent)).slice(0, 5);
    const topReferrers = countBy(weekViews, view => referrerLabel(view.referrer)).slice(0, 5);

    const stats = [
        {
            label: "Articles",
            count: articlesTotal.count ?? 0,
            published: articlesPublished.count ?? 0,
            href: "/admin/articles",
            color: "#B80000",
        },
        {
            label: "Events",
            count: eventsTotal.count ?? 0,
            published: eventsPublished.count ?? 0,
            href: "/admin/events",
            color: "#1F3A8A",
        },
        {
            label: "Testimonies",
            count: testimoniesTotal.count ?? 0,
            published: testimoniesPublished.count ?? 0,
            href: "/admin/testimonies",
            color: "#EB0000",
        },
    ];

    const pending = pendingComments.count ?? 0;
    const pendingArticleTotal = pendingArticleComments.count ?? 0;

    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Dashboard</h1>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Analytics</h2>
                {analyticsReady ? (
                    <>
                        <div className={styles.analyticsGrid}>
                            <div className={styles.analyticsCard}>
                                <span className={styles.analyticsCount}>
                                    {analyticsUsingFallback
                                        ? recentViews.filter(view => new Date(view.created_at).getTime() >= now - 24 * 60 * 60 * 1000).length
                                        : analyticsToday.count ?? 0}
                                </span>
                                <span className={styles.analyticsLabel}>Visits in 24h</span>
                            </div>
                            <div className={styles.analyticsCard}>
                                <span className={styles.analyticsCount}>{uniqueVisitorsToday}</span>
                                <span className={styles.analyticsLabel}>Visitors in 24h</span>
                            </div>
                            <div className={styles.analyticsCard}>
                                <span className={styles.analyticsCount}>
                                    {analyticsUsingFallback ? recentViews.length : analyticsTotal.count ?? 0}
                                </span>
                                <span className={styles.analyticsLabel}>
                                    {analyticsUsingFallback ? "Recent stored visits" : "Total visits"}
                                </span>
                            </div>
                        </div>
                        {analyticsUsingFallback && (
                            <div className={styles.setupNotice}>
                                <strong>Using fallback analytics storage.</strong>
                                <span>
                                    Run <code>supabase/analytics.sql</code> in Supabase SQL Editor for permanent full analytics history.
                                </span>
                            </div>
                        )}

                        <div className={styles.analyticsColumns}>
                            <div className={styles.table}>
                                <div className={styles.analyticsTableHead}>
                                    <span>Recent page</span>
                                    <span>Visitor</span>
                                    <span>Time</span>
                                </div>
                                {recentViews.map((view, index) => (
                                    <div key={`${view.created_at}-${index}`} className={styles.analyticsRow}>
                                        <span>
                                            <strong>{view.title || view.path}</strong>
                                            <small>{view.path}</small>
                                            <small>
                                                {referrerLabel(view.referrer)} · {detectBrowser(view.user_agent)}
                                            </small>
                                        </span>
                                        <span>
                                            <strong>{countryLabel(view.country)}</strong>
                                            <small>{detectDevice(view.user_agent)}</small>
                                        </span>
                                        <time dateTime={view.created_at}>
                                            {new Date(view.created_at).toLocaleString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </time>
                                    </div>
                                ))}
                                {recentViews.length === 0 && (
                                    <p className={styles.empty}>No visits recorded yet.</p>
                                )}
                            </div>

                            <div className={styles.table}>
                                <div className={styles.analyticsTableHead}>
                                    <span>Top pages this week</span>
                                    <span>Visits</span>
                                </div>
                                {topPages.map(([path, count]) => (
                                    <div key={path} className={styles.topPageRow}>
                                        <span>{path}</span>
                                        <strong>{count}</strong>
                                    </div>
                                ))}
                                {topPages.length === 0 && (
                                    <p className={styles.empty}>Top pages will appear after visits are recorded.</p>
                                )}
                            </div>
                        </div>

                        <div className={styles.breakdownGrid}>
                            <AnalyticsBreakdown title="Visitor locations" rows={topCountries} empty="Locations will appear after visits." />
                            <AnalyticsBreakdown title="Devices" rows={topDevices} empty="Devices will appear after visits." />
                            <AnalyticsBreakdown title="Browsers" rows={topBrowsers} empty="Browsers will appear after visits." />
                            <AnalyticsBreakdown title="Traffic sources" rows={topReferrers} empty="Sources will appear after visits." />
                        </div>
                    </>
                ) : (
                    <div className={styles.setupNotice}>
                        <strong>Analytics table needs setup.</strong>
                        <span>
                            Run <code>supabase/analytics.sql</code> in Supabase SQL Editor, then refresh this dashboard.
                        </span>
                    </div>
                )}
            </div>

            {/* Stat cards */}
            <div className={styles.statsGrid}>
                {stats.map(s => (
                    <a key={s.label} href={s.href} className={styles.statCard}>
                        <span className={styles.statCount} style={{ color: s.color }}>
                            {s.count}
                        </span>
                        <span className={styles.statLabel}>{s.label}</span>
                        <span className={styles.statSub}>
                            {s.published} published · {s.count - s.published} draft
                        </span>
                    </a>
                ))}
            </div>

            {/* Quick actions */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Quick actions</h2>
                <div className={styles.quickActions}>
                    <a href="/admin/articles/new" className={styles.actionBtn}>
                        + New article
                    </a>
                    <a href="/admin/events/new" className={styles.actionBtn}>
                        + New event
                    </a>
                    <a href="/admin/testimonies/new" className={styles.actionBtn}>
                        + New testimony
                    </a>
                    <a href="/admin/pages/new" className={styles.actionBtn}>
                        + New page
                    </a>
                    <a href="/admin/videos" className={styles.actionBtn}>
                        + Add video
                    </a>
                    <a href="/admin/homepage" className={styles.actionBtn}>
                        ⚙ Manage homepage
                    </a>
                </div>
                {pending > 0 && (
                    <a href="/admin/media" className={styles.alertBanner}>
                        💬 {pending} radio {pending === 1 ? "comment is" : "comments are"} waiting for approval.
                    </a>
                )}
                {pendingArticleTotal > 0 && (
                    <a href="/admin/comments" className={styles.alertBanner}>
                        {pendingArticleTotal} article {pendingArticleTotal === 1 ? "comment is" : "comments are"} waiting for approval.
                    </a>
                )}
            </div>

            {/* Recent articles */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Recent articles</h2>
                <div className={styles.table}>
                    <div className={styles.tableHead}>
                        <span>Title</span>
                        <span>Category</span>
                        <span>Status</span>
                        <span></span>
                    </div>
                    {recentArticles.map(a => (
                        <div key={a.id} className={styles.tableRow}>
                            <span className={styles.tableTitle}>{a.title}</span>
                            <span className={styles.tableCategory}>{a.category}</span>
                            <span className={a.is_published ? styles.published : styles.draft}>
                                {a.is_published ? "Published" : "Draft"}
                            </span>
                            <a href={`/admin/articles/${a.id}/edit`} className={styles.editLink}>
                                Edit
                            </a>
                        </div>
                    ))}
                    {recentArticles.length === 0 && (
                        <p className={styles.empty}>No articles yet.</p>
                    )}
                </div>
            </div>

            {/* Recent events + testimonies side by side */}
            <div className={styles.twoCol}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Recent events</h2>
                    <div className={styles.table}>
                        {recentEvents.map(ev => (
                            <div key={ev.id} className={styles.tableRowSimple}>
                                <span className={styles.tableTitle}>{ev.title}</span>
                                <span className={ev.is_published ? styles.published : styles.draft}>
                                    {ev.is_published ? "Published" : "Draft"}
                                </span>
                                <a href={`/admin/events/${ev.id}/edit`} className={styles.editLink}>
                                    Edit
                                </a>
                            </div>
                        ))}
                        {recentEvents.length === 0 && (
                            <p className={styles.empty}>No events yet.</p>
                        )}
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Recent testimonies</h2>
                    <div className={styles.table}>
                        {recentTestimonies.map(t => (
                            <div key={t.id} className={styles.tableRowSimple}>
                                <span className={styles.tableTitle}>{t.title}</span>
                                <span className={t.is_published ? styles.published : styles.draft}>
                                    {t.is_published ? "Published" : "Draft"}
                                </span>
                                <a href={`/admin/testimonies/${t.id}/edit`} className={styles.editLink}>
                                    Edit
                                </a>
                            </div>
                        ))}
                        {recentTestimonies.length === 0 && (
                            <p className={styles.empty}>No testimonies yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

type AnalyticsViewSummary = Pick<AnalyticsPageViewRow,
    "path" | "title" | "referrer" | "visitor_id" | "session_id" | "country" | "user_agent" | "created_at"
>;

function AnalyticsBreakdown({
    title,
    rows,
    empty,
}: {
    title: string;
    rows: [string, number][];
    empty: string;
}) {
    const max = Math.max(...rows.map(([, count]) => count), 1);

    return (
        <div className={styles.breakdownCard}>
            <h3>{title}</h3>
            {rows.length > 0 ? (
                <div className={styles.breakdownList}>
                    {rows.map(([label, count]) => (
                        <div key={label} className={styles.breakdownRow}>
                            <div>
                                <span>{label}</span>
                                <strong>{count}</strong>
                            </div>
                            <i style={{ width: `${Math.max((count / max) * 100, 6)}%` }} />
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.emptyMini}>{empty}</p>
            )}
        </div>
    );
}

function parseFallbackAnalyticsViews(value: string) {
    try {
        const parsed = JSON.parse(value) as unknown;
        if (!Array.isArray(parsed)) return [];

        return parsed.filter((item): item is AnalyticsViewSummary => (
            typeof item === "object"
            && item !== null
            && "path" in item
            && typeof item.path === "string"
            && "created_at" in item
            && typeof item.created_at === "string"
        ));
    } catch {
        return [];
    }
}

function countBy<T>(items: T[], getKey: (item: T) => string) {
    return Array.from(
        items.reduce((map, item) => {
            const key = getKey(item);
            map.set(key, (map.get(key) ?? 0) + 1);
            return map;
        }, new Map<string, number>())
    ).sort((a, b) => b[1] - a[1]);
}

function countryLabel(country: string | null | undefined) {
    if (!country || country === "XX") return "Unknown";
    return country.toUpperCase();
}

function detectDevice(userAgent: string | null | undefined) {
    const ua = userAgent?.toLowerCase() ?? "";
    if (!ua) return "Unknown";
    if (/ipad|tablet|kindle|silk/.test(ua)) return "Tablet";
    if (/mobi|iphone|android/.test(ua)) return "Mobile";
    if (/bot|crawler|spider|preview/.test(ua)) return "Bot/preview";
    return "Desktop";
}

function detectBrowser(userAgent: string | null | undefined) {
    const ua = userAgent ?? "";
    if (!ua) return "Unknown";
    if (/Edg\//.test(ua)) return "Edge";
    if (/OPR\//.test(ua)) return "Opera";
    if (/Firefox\//.test(ua)) return "Firefox";
    if (/CriOS\//.test(ua)) return "Chrome iOS";
    if (/Chrome\//.test(ua)) return "Chrome";
    if (/Safari\//.test(ua) && /Version\//.test(ua)) return "Safari";
    if (/bot|crawler|spider/i.test(ua)) return "Bot/crawler";
    return "Other";
}

function referrerLabel(referrer: string | null | undefined) {
    if (!referrer) return "Direct";
    try {
        const host = new URL(referrer).hostname.replace(/^www\./, "");
        if (host.includes("google.")) return "Google";
        if (host.includes("facebook.") || host.includes("fb.")) return "Facebook";
        if (host.includes("instagram.")) return "Instagram";
        if (host.includes("youtube.")) return "YouTube";
        if (host.includes("t.co") || host.includes("twitter.") || host.includes("x.com")) return "X/Twitter";
        if (host.includes("urugerogospelnews.com")) return "Internal";
        return host;
    } catch {
        return "Other";
    }
}
