import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { buildMeta, absoluteUrl } from "@/lib/metadata";
import { supabase } from "@/lib/supabase";
import { getPage } from "@/lib/pages";
import ShareButtons from "@/components/ShareButtons";
import SectionPage from "@/components/SectionPage";
import { ArticleCard } from "@/components/ui";
import type { ArticleRow } from "@/types/database";
import articleStyles from "@/app/amakuru/[slug]/article.module.css";
import styles from "./media-group-detail.module.css";

type Props = { params: Promise<{ slug: string }> };

const FALLBACK_CARD = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop";

export const dynamic = "force-dynamic";

async function getMediaGroupArticle(slug: string): Promise<ArticleRow | null> {
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
        .eq("nav_group", "media-group")
        .maybeSingle();

    return category ? article as ArticleRow : null;
}

async function getMediaGroupPageArticles(categorySlug: string): Promise<ArticleRow[]> {
    const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .eq("category", categorySlug)
        .order("published_at", { ascending: false })
        .limit(12);

    return (data ?? []) as ArticleRow[];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const page = await getPage(slug);
    if (page?.nav_group === "media-group") {
        return buildMeta({
            title: page.title,
            description: page.subtitle || page.title,
            path: `/urugero-media-group/${slug}`,
        });
    }

    const article = await getMediaGroupArticle(slug);
    if (!article) return {};

    return buildMeta({
        title: article.title,
        description: article.excerpt,
        path: `/urugero-media-group/${slug}`,
        image: article.image_url ?? undefined,
    });
}

export async function generateStaticParams() {
    const { data: pageData } = await supabase
        .from("pages")
        .select("slug")
        .eq("nav_group", "media-group")
        .eq("is_published", true);

    const { data: categoryData } = await supabase
        .from("categories")
        .select("slug")
        .eq("nav_group", "media-group");

    const categorySlugs = ((categoryData ?? []) as { slug: string }[]).map(row => row.slug);
    const { data: articleData } = categorySlugs.length > 0
        ? await supabase
            .from("articles")
            .select("slug")
            .eq("is_published", true)
            .in("category", categorySlugs)
        : { data: [] };

    return [
        ...((pageData ?? []) as { slug: string }[]).map(row => ({ slug: row.slug })),
        ...((articleData ?? []) as { slug: string }[]).map(row => ({ slug: row.slug })),
    ];
}

export default async function MediaGroupPageOrArticle({ params }: Props) {
    const { slug } = await params;
    const page = await getPage(slug);

    if (page?.nav_group === "media-group") {
        const articles = await getMediaGroupPageArticles(page.slug);
        const leadArticle = articles[0] ?? null;
        const restArticles = articles.slice(1);

        return (
            <SectionPage
                title={page.title}
                subtitle={page.subtitle || "URUGERO MEDIA GROUP"}
                description={page.subtitle || page.title}
                icon={page.icon ?? "🎬"}
                color={page.color ?? "#B80000"}
                heroImage={page.hero_image ?? undefined}
                breadcrumb={[{ label: "Urugero Media Group", href: "/urugero-media-group" }]}
                wideContent
            >
                {page.content && (
                    <div
                        className={styles.pageIntro}
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                )}

                <section className={styles.articleSection} aria-label={`Inkuru za ${page.title}`}>
                    <div className={styles.articleHeader}>
                        <div>
                            <p className={styles.kicker}>Inkuru n&apos;amakuru</p>
                            <h2>Inkuru za {page.title}</h2>
                        </div>
                        <span className={styles.countBadge}>{articles.length} inkuru</span>
                    </div>

                    {leadArticle ? (
                        <>
                            <Link href={`/urugero-media-group/${leadArticle.slug}`} className={styles.leadStory}>
                                <div className={styles.leadImageWrap}>
                                    <Image
                                        src={leadArticle.image_url ?? FALLBACK_CARD}
                                        alt={leadArticle.title}
                                        fill
                                        className={styles.leadImage}
                                        sizes="(max-width: 900px) 100vw, 50vw"
                                    />
                                </div>
                                <div className={styles.leadBody}>
                                    <span
                                        className={styles.categoryBadge}
                                        style={{ backgroundColor: leadArticle.category_color }}
                                    >
                                        {leadArticle.category}
                                    </span>
                                    <h3>{leadArticle.title}</h3>
                                    <p>{leadArticle.excerpt}</p>
                                    <div className={styles.leadMeta}>
                                        <span>{leadArticle.author}</span>
                                        <span aria-hidden>·</span>
                                        <span>{leadArticle.read_time} gusoma</span>
                                    </div>
                                </div>
                            </Link>

                            {restArticles.length > 0 && (
                                <div className={styles.articleGrid}>
                                    {restArticles.map((article) => (
                                        <ArticleCard
                                            key={article.id}
                                            href={`/urugero-media-group/${article.slug}`}
                                            category={article.category}
                                            categoryColor={article.category_color}
                                            title={article.title}
                                            excerpt={article.excerpt}
                                            image={article.image_url ?? FALLBACK_CARD}
                                            author={article.author}
                                            readTime={article.read_time}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon} aria-hidden>+</span>
                            <h3>Inkuru ziraza vuba</h3>
                            <p>
                                Iyi page iriteguye kwakira inkuru, amafoto n&apos;amakuru mashya ya {page.title}.
                            </p>
                        </div>
                    )}
                </section>
            </SectionPage>
        );
    }

    const article = await getMediaGroupArticle(slug);
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
        <div className={articleStyles.page}>
            <div className="container">
                <nav className={articleStyles.breadcrumb} aria-label="Inzira">
                    <Link href="/">Ahabanza</Link>
                    <span aria-hidden>›</span>
                    <Link href="/urugero-media-group">Urugero Media Group</Link>
                    <span aria-hidden>›</span>
                    <Link href={`/urugero-media-group/${article.category}`}>{article.category}</Link>
                    <span aria-hidden>›</span>
                    <span aria-current="page">{article.title}</span>
                </nav>

                <header className={articleStyles.hero}>
                    <span
                        className={articleStyles.categoryBadge}
                        style={{ backgroundColor: article.category_color }}
                    >
                        {article.category}
                    </span>
                    <h1 className={articleStyles.title}>{article.title}</h1>
                    <p className={articleStyles.excerpt}>{article.excerpt}</p>
                    <div className={articleStyles.meta}>
                        <span>{article.author}</span>
                        {pubDate && (
                            <>
                                <span className={articleStyles.metaDot} aria-hidden>·</span>
                                <time dateTime={article.published_at ?? ""}>{pubDate}</time>
                            </>
                        )}
                        <span className={articleStyles.metaDot} aria-hidden>·</span>
                        <span>{article.read_time} gusoma</span>
                    </div>
                </header>

                <div className={`${articleStyles.coverWrap} ${article.image_url ? articleStyles.hasImage : ""}`}>
                    {article.image_url ? (
                        <Image
                            src={article.image_url}
                            alt={article.title}
                            fill
                            className={articleStyles.coverImg}
                            priority
                            sizes="(max-width: 1200px) 100vw, 1200px"
                        />
                    ) : (
                        <div className={articleStyles.imagePlaceholder}>
                            <span className={articleStyles.imagePlaceholderIcon}>🎬</span>
                            <span>Ifoto izashyirwa hano</span>
                        </div>
                    )}
                </div>

                <article
                    className={articleStyles.body}
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                <ShareButtons url={absoluteUrl(`/urugero-media-group/${article.slug}`)} title={article.title} />

                <div className={articleStyles.footer}>
                    <Link href={`/urugero-media-group/${article.category}`} className={articleStyles.backLink}>
                        ← Garuka kuri {article.category}
                    </Link>
                </div>

                {relatedArticles.length > 0 && (
                    <section className={articleStyles.related}>
                        <h2 className={articleStyles.relatedTitle}>Izindi nkuru</h2>
                        <div className={articleStyles.relatedGrid}>
                            {relatedArticles.map((relatedArticle) => (
                                <Link
                                    key={relatedArticle.id}
                                    href={`/urugero-media-group/${relatedArticle.slug}`}
                                    className={articleStyles.relatedCard}
                                >
                                    <div className={articleStyles.relatedImgWrap}>
                                        {relatedArticle.image_url ? (
                                            <Image
                                                src={relatedArticle.image_url}
                                                alt={relatedArticle.title}
                                                fill
                                                className={articleStyles.relatedImg}
                                                sizes="(max-width: 600px) 100vw, 400px"
                                            />
                                        ) : (
                                            <span>🎬</span>
                                        )}
                                    </div>
                                    <div className={articleStyles.relatedBody}>
                                        <span
                                            className={articleStyles.relatedBadge}
                                            style={{ backgroundColor: relatedArticle.category_color }}
                                        >
                                            {relatedArticle.category}
                                        </span>
                                        <h3 className={articleStyles.relatedCardTitle}>{relatedArticle.title}</h3>
                                        <p className={articleStyles.relatedMeta}>{relatedArticle.read_time} gusoma</p>
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
