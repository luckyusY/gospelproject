import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { buildMeta, absoluteUrl } from "@/lib/metadata";
import ShareButtons from "@/components/ShareButtons";
import type { ArticleRow } from "@/types/database";
import styles from "@/app/amakuru/[slug]/article.module.css";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

async function getBibleArticle(slug: string): Promise<ArticleRow | null> {
    const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("category", "tumenye-bibiliya")
        .eq("is_published", true)
        .maybeSingle();

    return (data as ArticleRow | null) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = await getBibleArticle(slug);

    if (!article) return {};

    return buildMeta({
        title: article.title,
        description: article.excerpt,
        path: `/tumenye-bibiliya/${slug}`,
        image: article.image_url ?? undefined,
    });
}

export async function generateStaticParams() {
    const { data } = await supabase
        .from("articles")
        .select("slug")
        .eq("category", "tumenye-bibiliya")
        .eq("is_published", true);

    return ((data ?? []) as { slug: string }[]).map((row) => ({ slug: row.slug }));
}

export default async function TumenyeBibiliyaArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = await getBibleArticle(slug);

    if (!article) notFound();

    const { data: related } = await supabase
        .from("articles")
        .select("id, title, slug, excerpt, image_url, category, category_color, read_time")
        .eq("is_published", true)
        .eq("category", "tumenye-bibiliya")
        .neq("slug", slug)
        .order("published_at", { ascending: false })
        .limit(3);

    const relatedArticles = (related ?? []) as ArticleRow[];
    const pubDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString("fr-RW", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        : null;

    return (
        <div className={styles.page}>
            <div className="container">
                <nav className={styles.breadcrumb} aria-label="Inzira">
                    <Link href="/">Ahabanza</Link>
                    <span aria-hidden>›</span>
                    <Link href="/tumenye-bibiliya">Tumenye Bibiliya</Link>
                    <span aria-hidden>›</span>
                    <span aria-current="page">{article.title}</span>
                </nav>

                <header className={styles.hero}>
                    <span
                        className={styles.categoryBadge}
                        style={{ backgroundColor: article.category_color }}
                    >
                        Tumenye Bibiliya
                    </span>
                    <h1 className={styles.title}>{article.title}</h1>
                    <p className={styles.excerpt}>{article.excerpt}</p>
                    <div className={styles.meta}>
                        <span>{article.author}</span>
                        {pubDate && (
                            <>
                                <span className={styles.metaDot} aria-hidden>·</span>
                                <time dateTime={article.published_at ?? ""}>{pubDate}</time>
                            </>
                        )}
                        <span className={styles.metaDot} aria-hidden>·</span>
                        <span>{article.read_time} gusoma</span>
                    </div>
                </header>

                <div className={`${styles.coverWrap} ${article.image_url ? styles.hasImage : ""}`}>
                    {article.image_url ? (
                        <Image
                            src={article.image_url}
                            alt={article.title}
                            fill
                            className={styles.coverImg}
                            priority
                            sizes="(max-width: 1200px) 100vw, 1200px"
                        />
                    ) : (
                        <div className={styles.imagePlaceholder}>
                            <span className={styles.imagePlaceholderIcon}>📖</span>
                            <span>Ifoto izashyirwa hano</span>
                        </div>
                    )}
                </div>

                <article
                    className={styles.body}
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                <ShareButtons
                    url={absoluteUrl(`/tumenye-bibiliya/${article.slug}`)}
                    title={article.title}
                />

                <div className={styles.footer}>
                    <Link href="/tumenye-bibiliya" className={styles.backLink}>
                        ← Garuka kuri Tumenye Bibiliya
                    </Link>
                </div>

                {relatedArticles.length > 0 && (
                    <section className={styles.related}>
                        <h2 className={styles.relatedTitle}>Izindi nyigisho za Bibiliya</h2>
                        <div className={styles.relatedGrid}>
                            {relatedArticles.map((relatedArticle) => (
                                <Link
                                    key={relatedArticle.id}
                                    href={`/tumenye-bibiliya/${relatedArticle.slug}`}
                                    className={styles.relatedCard}
                                >
                                    <div className={styles.relatedImgWrap}>
                                        {relatedArticle.image_url ? (
                                            <Image
                                                src={relatedArticle.image_url}
                                                alt={relatedArticle.title}
                                                fill
                                                className={styles.relatedImg}
                                                sizes="(max-width: 600px) 100vw, 400px"
                                            />
                                        ) : (
                                            <span>📖</span>
                                        )}
                                    </div>
                                    <div className={styles.relatedBody}>
                                        <span
                                            className={styles.relatedBadge}
                                            style={{ backgroundColor: relatedArticle.category_color }}
                                        >
                                            Tumenye Bibiliya
                                        </span>
                                        <h3 className={styles.relatedCardTitle}>{relatedArticle.title}</h3>
                                        <p className={styles.relatedMeta}>{relatedArticle.read_time} gusoma</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
