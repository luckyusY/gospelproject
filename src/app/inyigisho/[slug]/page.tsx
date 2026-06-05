import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { buildMeta, absoluteUrl } from "@/lib/metadata";
import { supabase } from "@/lib/supabase";
import ShareButtons from "@/components/ShareButtons";
import TwitterEmbeds from "@/components/TwitterEmbeds";
import CategoryListing from "@/components/CategoryListing";
import { renderArticleContent } from "@/lib/articleContent";
import type { ArticleRow, CategoryRow } from "@/types/database";
import styles from "@/app/amakuru/[slug]/article.module.css";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

async function getInyigishoCategory(slug: string): Promise<CategoryRow | null> {
    const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .eq("nav_group", "inyigisho")
        .maybeSingle();
    return (data as CategoryRow | null) ?? null;
}

async function getInyigishoArticle(slug: string): Promise<ArticleRow | null> {
    const { data: article } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

    if (!article) return null;

    const { data: category } = await supabase
        .from("categories")
        .select("slug, nav_group")
        .eq("slug", (article as ArticleRow).category)
        .eq("nav_group", "inyigisho")
        .maybeSingle();

    return category ? article as ArticleRow : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = await getInyigishoCategory(slug);
    if (category) {
        return buildMeta({
            title: category.name,
            description: category.description ?? `Inyigisho za ${category.name} kuri Urugero Media.`,
            path: `/inyigisho/${slug}`,
        });
    }

    const article = await getInyigishoArticle(slug);
    if (!article) return {};

    return buildMeta({
        title: article.title,
        description: article.excerpt,
        path: `/inyigisho/${slug}`,
        image: article.image_url ?? undefined,
    });
}

export async function generateStaticParams() {
    const { data: categoryData } = await supabase
        .from("categories")
        .select("slug")
        .eq("nav_group", "inyigisho");

    const categorySlugs = ((categoryData ?? []) as { slug: string }[]).map(row => row.slug);
    const { data: articleData } = categorySlugs.length > 0
        ? await supabase
            .from("articles")
            .select("slug")
            .eq("is_published", true)
            .in("category", categorySlugs)
        : { data: [] };

    return [
        ...categorySlugs.map(slug => ({ slug })),
        ...((articleData ?? []) as { slug: string }[]).map(row => ({ slug: row.slug })),
    ];
}

export default async function InyigishoPage({ params }: Props) {
    const { slug } = await params;

    const category = await getInyigishoCategory(slug);
    if (category) {
        return (
            <CategoryListing
                category={category}
                basePath="/inyigisho"
                sectionLabel="Inyigisho"
                articleBasePath="/inyigisho"
            />
        );
    }

    const article = await getInyigishoArticle(slug);
    if (!article) notFound();

    const { data: related } = await supabase
        .from("articles")
        .select("id, title, slug, excerpt, image_url, category, category_color, read_time")
        .eq("is_published", true)
        .eq("category", article.category)
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
                    <Link href="/inyigisho">Inyigisho</Link>
                    <span aria-hidden>›</span>
                    <Link href={`/inyigisho/${article.category}`}>{article.category}</Link>
                    <span aria-hidden>›</span>
                    <span aria-current="page">{article.title}</span>
                </nav>

                <header className={styles.hero}>
                    <span
                        className={styles.categoryBadge}
                        style={{ backgroundColor: article.category_color }}
                    >
                        {article.category}
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
                            <span className={styles.imagePlaceholderIcon}>📚</span>
                            <span>Ifoto izashyirwa hano</span>
                        </div>
                    )}
                </div>

                <article
                    className={styles.body}
                    dangerouslySetInnerHTML={{ __html: renderArticleContent(article.content) }}
                />
                <TwitterEmbeds />

                <ShareButtons url={absoluteUrl(`/inyigisho/${article.slug}`)} title={article.title} />

                <div className={styles.footer}>
                    <Link href={`/inyigisho/${article.category}`} className={styles.backLink}>
                        ← Garuka kuri {article.category}
                    </Link>
                </div>

                {relatedArticles.length > 0 && (
                    <section className={styles.related}>
                        <h2 className={styles.relatedTitle}>Izindi nyigisho</h2>
                        <div className={styles.relatedGrid}>
                            {relatedArticles.map((relatedArticle) => (
                                <Link
                                    key={relatedArticle.id}
                                    href={`/inyigisho/${relatedArticle.slug}`}
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
                                            <span>📚</span>
                                        )}
                                    </div>
                                    <div className={styles.relatedBody}>
                                        <span
                                            className={styles.relatedBadge}
                                            style={{ backgroundColor: relatedArticle.category_color }}
                                        >
                                            {relatedArticle.category}
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
