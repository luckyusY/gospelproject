import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { buildMeta, absoluteUrl } from "@/lib/metadata";
import ShareButtons from "@/components/ShareButtons";
import TwitterEmbeds from "@/components/TwitterEmbeds";
import { renderArticleContent } from "@/lib/articleContent";
import type { ArticleRow } from "@/types/database";
import styles from "@/app/amakuru/[slug]/article.module.css";

type Props = { params: Promise<{ slug: string }> };

async function getIbigwiArticle(slug: string): Promise<ArticleRow | null> {
    const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("category", "ibigwi")
        .eq("is_published", true)
        .maybeSingle();

    return (data ?? null) as ArticleRow | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = await getIbigwiArticle(slug);
    if (!article) return {};

    return buildMeta({
        title: article.title,
        description: article.excerpt,
        path: `/ibigwi/${slug}`,
        image: article.image_url ?? undefined,
    });
}

export async function generateStaticParams() {
    const { data } = await supabase
        .from("articles")
        .select("slug")
        .eq("category", "ibigwi")
        .eq("is_published", true);

    return ((data ?? []) as { slug: string }[]).map((row) => ({ slug: row.slug }));
}

export default async function IbigwiArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = await getIbigwiArticle(slug);

    if (!article) notFound();

    const { data: related } = await supabase
        .from("articles")
        .select("id, title, slug, excerpt, image_url, category, category_color, read_time")
        .eq("is_published", true)
        .eq("category", "ibigwi")
        .neq("slug", slug)
        .order("published_at", { ascending: false })
        .limit(3);

    const relatedArticles = (related ?? []) as ArticleRow[];
    const pubDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString("en-US", {
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
                    <span aria-hidden>&rsaquo;</span>
                    <Link href="/ibigwi">Ibigwi</Link>
                    <span aria-hidden>&rsaquo;</span>
                    <span aria-current="page">{article.title}</span>
                </nav>

                <header className={styles.hero}>
                    <span
                        className={styles.categoryBadge}
                        style={{ backgroundColor: article.category_color }}
                    >
                        Ibigwi
                    </span>
                    <h1 className={styles.title}>{article.title}</h1>
                    <p className={styles.excerpt}>{article.excerpt}</p>
                    <div className={styles.meta}>
                        <span>{article.author}</span>
                        {pubDate && (
                            <>
                                <span className={styles.metaDot} aria-hidden>&middot;</span>
                                <time dateTime={article.published_at ?? ""}>{pubDate}</time>
                            </>
                        )}
                        <span className={styles.metaDot} aria-hidden>&middot;</span>
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
                            <span className={styles.imagePlaceholderIcon}>+</span>
                            <span>Ifoto izashyirwa hano</span>
                        </div>
                    )}
                </div>

                <article
                    className={styles.body}
                    dangerouslySetInnerHTML={{ __html: renderArticleContent(article.content) }}
                />
                <TwitterEmbeds />

                <ShareButtons url={absoluteUrl(`/ibigwi/${article.slug}`)} title={article.title} />

                <div className={styles.footer}>
                    <Link href="/ibigwi" className={styles.backLink}>
                        &larr; Garuka kuri Ibigwi
                    </Link>
                </div>

                {relatedArticles.length > 0 && (
                    <section className={styles.related}>
                        <h2 className={styles.relatedTitle}>Ibindi bigwi</h2>
                        <div className={styles.relatedGrid}>
                            {relatedArticles.map((relatedArticle) => (
                                <Link
                                    key={relatedArticle.id}
                                    href={`/ibigwi/${relatedArticle.slug}`}
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
                                            <span>+</span>
                                        )}
                                    </div>
                                    <div className={styles.relatedBody}>
                                        <span
                                            className={styles.relatedBadge}
                                            style={{ backgroundColor: relatedArticle.category_color }}
                                        >
                                            Ibigwi
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
