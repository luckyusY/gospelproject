import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { buildMeta } from "@/lib/metadata";
import type { ArticleRow, EventRow, TestimonyRow } from "@/types/database";
import styles from "./search.module.css";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { q } = await searchParams;
    return buildMeta({
        title: q ? `Ibisubizo bya "${q}"` : "Shakisha",
        description: "Shakisha inyandiko, ibikorwa n'ubuhamya kuri Urugero Media.",
        path: "/search",
        noIndex: true,
    });
}

type SearchResult =
    | ({ kind: "article" } & Pick<ArticleRow, "slug" | "title" | "excerpt" | "category" | "category_color" | "read_time">)
    | ({ kind: "event" } & Pick<EventRow, "slug" | "title" | "description" | "event_date" | "location">)
    | ({ kind: "testimony" } & Pick<TestimonyRow, "slug" | "title" | "excerpt" | "person_name">);

export default async function SearchPage({ searchParams }: Props) {
    const { q } = await searchParams;
    const query = q?.trim() ?? "";

    let results: SearchResult[] = [];

    if (query.length >= 2) {
        const term = `%${query}%`;

        const [articlesRes, eventsRes, testimoniesRes] = await Promise.all([
            supabase
                .from("articles")
                .select("*")
                .eq("is_published", true)
                .or(`title.ilike.${term},excerpt.ilike.${term},content.ilike.${term}`)
                .limit(8),
            supabase
                .from("events")
                .select("*")
                .eq("is_published", true)
                .or(`title.ilike.${term},description.ilike.${term}`)
                .limit(5),
            supabase
                .from("testimonies")
                .select("*")
                .eq("is_published", true)
                .or(`title.ilike.${term},excerpt.ilike.${term},content.ilike.${term}`)
                .limit(5),
        ]);

        const articles   = (articlesRes.data   ?? []) as ArticleRow[];
        const events     = (eventsRes.data     ?? []) as EventRow[];
        const testimonies = (testimoniesRes.data ?? []) as TestimonyRow[];

        results = [
            ...articles.map(a => ({
                kind: "article" as const,
                slug: a.slug, title: a.title, excerpt: a.excerpt,
                category: a.category, category_color: a.category_color, read_time: a.read_time,
            })),
            ...events.map(e => ({
                kind: "event" as const,
                slug: e.slug, title: e.title, description: e.description,
                event_date: e.event_date, location: e.location,
            })),
            ...testimonies.map(t => ({
                kind: "testimony" as const,
                slug: t.slug, title: t.title, excerpt: t.excerpt, person_name: t.person_name,
            })),
        ];
    }

    return (
        <div className={styles.page}>
            <div className={styles.hero}>
                <div className="container">
                    <h1 className={styles.heading}>Shakisha</h1>
                    <form method="GET" action="/search" className={styles.searchForm} role="search">
                        <input
                            name="q"
                            type="search"
                            defaultValue={query}
                            placeholder="Shakisha inyandiko, ibikorwa, ubuhamya..."
                            className={styles.searchInput}
                            autoFocus
                            aria-label="Shakisha"
                        />
                        <button type="submit" className={styles.searchBtn}>Shakisha</button>
                    </form>
                </div>
            </div>

            <div className="container">
                {query.length >= 2 && (
                    <p className={styles.resultMeta}>
                        {results.length > 0
                            ? `Ibisubizo ${results.length} by'urupapuro "${query}"`
                            : `Nta bisubizo bibonetse bya "${query}"`}
                    </p>
                )}

                {results.length > 0 && (
                    <div className={styles.results}>
                        {results.map((r, i) => {
                            if (r.kind === "article") return (
                                <Link key={i} href={`/amakuru/${r.slug}`} className={styles.resultCard}>
                                    <div className={styles.resultMeta2}>
                                        <span className={styles.kindBadge} style={{ backgroundColor: r.category_color }}>
                                            Inyandiko
                                        </span>
                                        <span className={styles.categoryLabel}>{r.category}</span>
                                    </div>
                                    <h2 className={styles.resultTitle}>{r.title}</h2>
                                    <p className={styles.resultExcerpt}>{r.excerpt}</p>
                                    <span className={styles.resultHint}>{r.read_time} gusoma →</span>
                                </Link>
                            );
                            if (r.kind === "event") return (
                                <Link key={i} href={`/events/${r.slug}`} className={styles.resultCard}>
                                    <div className={styles.resultMeta2}>
                                        <span className={`${styles.kindBadge} ${styles.kindEvent}`}>Igikorwa</span>
                                        <span className={styles.categoryLabel}>{r.location}</span>
                                    </div>
                                    <h2 className={styles.resultTitle}>{r.title}</h2>
                                    <p className={styles.resultExcerpt}>{r.description}</p>
                                    <span className={styles.resultHint}>
                                        {new Date(r.event_date).toLocaleDateString("rw-RW")} →
                                    </span>
                                </Link>
                            );
                            return (
                                <Link key={i} href={`/ubuhamya/${r.slug}`} className={styles.resultCard}>
                                    <div className={styles.resultMeta2}>
                                        <span className={`${styles.kindBadge} ${styles.kindTestimony}`}>Ubuhamya</span>
                                        <span className={styles.categoryLabel}>{r.person_name}</span>
                                    </div>
                                    <h2 className={styles.resultTitle}>{r.title}</h2>
                                    <p className={styles.resultExcerpt}>{r.excerpt}</p>
                                    <span className={styles.resultHint}>Soma ubuhamya →</span>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {query.length < 2 && (
                    <div className={styles.empty}>
                        <p>Injiza amagambo 2 cyangwa arenga kugirango ushakishe.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
