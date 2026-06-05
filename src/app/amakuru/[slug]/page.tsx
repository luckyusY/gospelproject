import { notFound }    from "next/navigation";
import Image           from "next/image";
import Link            from "next/link";
import type { Metadata } from "next";
import { supabase, supabaseAdmin }    from "@/lib/supabase";
import { ensureDefaultArticleCategories, getDefaultCategoryBySlug } from "@/lib/categories";
import { buildMeta, absoluteUrl } from "@/lib/metadata";
import ShareButtons    from "@/components/ShareButtons";
import TwitterEmbeds   from "@/components/TwitterEmbeds";
import CategoryListing from "@/components/CategoryListing";
import { renderArticleContent } from "@/lib/articleContent";
import type { ArticleRow, CategoryRow } from "@/types/database";
import styles          from "./article.module.css";

type Props = { params: Promise<{ slug: string }> };

/** A slug at /amakuru/<slug> is either a category listing or a single article. */
async function getCategory(slug: string): Promise<CategoryRow | null> {
    const admin = supabaseAdmin();
    await ensureDefaultArticleCategories(admin);

    const { data } = await admin
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

    const category = (data as CategoryRow | null) ?? getDefaultCategoryBySlug(slug);
    return category?.nav_group === "amakuru" ? category : null;
}

/* ── SEO metadata ─────────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    const category = await getCategory(slug);
    if (category) {
        return buildMeta({
            title:       category.name,
            description: category.description ?? `Amakuru ya ${category.name} kuri Urugero Gospel News.`,
            path:        `/amakuru/${slug}`,
        });
    }

    const result = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
    const data = result.data as ArticleRow | null;

    if (!data) return {};
    return buildMeta({
        title:       data.title,
        description: data.excerpt,
        path:        `/amakuru/${slug}`,
        image:       data.image_url ?? undefined,
    });
}

/* ── Static params for build-time generation ─────────────── */
export async function generateStaticParams() {
    const [{ data: articleData }, { data: catData }] = await Promise.all([
        supabase.from("articles").select("slug").eq("is_published", true),
        supabase.from("categories").select("slug"),
    ]);
    const slugs = [
        ...((articleData ?? []) as { slug: string }[]),
        ...((catData ?? []) as { slug: string }[]),
    ];
    return slugs.map((row) => ({ slug: row.slug }));
}

/* ── Page ──────────────────────────────────────────────────── */
export default async function ArticleOrCategoryPage({ params }: Props) {
    const { slug } = await params;

    /* If the slug is a category, render the shared listing page. */
    const category = await getCategory(slug);
    if (category) {
        return <CategoryListing category={category} basePath="/amakuru" sectionLabel="Amakuru" />;
    }

    /* Otherwise it's a single article. */
    const { data: article } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

    if (!article) notFound();

    const a = article as ArticleRow;

    /* Fetch related articles (same category, different slug) */
    const { data: related } = await supabase
        .from("articles")
        .select("id, title, slug, excerpt, image_url, category, category_color, read_time")
        .eq("is_published", true)
        .eq("category", a.category)
        .neq("slug", slug)
        .order("published_at", { ascending: false })
        .limit(3);

    const relatedArticles = (related ?? []) as ArticleRow[];

    /* Published date */
    const pubDate = a.published_at
        ? new Date(a.published_at).toLocaleDateString("fr-RW", {
            day: "numeric", month: "long", year: "numeric",
          })
        : null;

    return (
        <div className={styles.page}>
            <div className="container">

                {/* ── Breadcrumb ─────────────────────────── */}
                <nav className={styles.breadcrumb} aria-label="Inzira">
                    <Link href="/">Ahabanza</Link>
                    <span aria-hidden>›</span>
                    <Link href="/amakuru">Amakuru</Link>
                    <span aria-hidden>›</span>
                    <Link href={`/amakuru/${a.category}`}>{a.category}</Link>
                    <span aria-hidden>›</span>
                    <span aria-current="page">{a.title}</span>
                </nav>

                {/* ── Hero ───────────────────────────────── */}
                <header className={styles.hero}>
                    <span
                        className={styles.categoryBadge}
                        style={{ backgroundColor: a.category_color }}
                    >
                        {a.category}
                    </span>
                    <h1 className={styles.title}>{a.title}</h1>
                    <p className={styles.excerpt}>{a.excerpt}</p>
                    <div className={styles.meta}>
                        <span>{a.author}</span>
                        {pubDate && (
                            <>
                                <span className={styles.metaDot} aria-hidden>·</span>
                                <time dateTime={a.published_at ?? ""}>{pubDate}</time>
                            </>
                        )}
                        <span className={styles.metaDot} aria-hidden>·</span>
                        <span>{a.read_time} gusoma</span>
                    </div>
                </header>

                {/* ── Cover Image (or placeholder for later upload) ── */}
                <div className={`${styles.coverWrap} ${a.image_url ? styles.hasImage : ""}`}>
                    {a.image_url ? (
                        <Image
                            src={a.image_url}
                            alt={a.title}
                            fill
                            className={styles.coverImg}
                            priority
                            sizes="(max-width: 1200px) 100vw, 1200px"
                        />
                    ) : (
                        <div className={styles.imagePlaceholder}>
                            <span className={styles.imagePlaceholderIcon}>🖼️</span>
                            <span>Ifoto izashyirwa hano</span>
                        </div>
                    )}
                </div>

                {/* ── Article Body (HTML rendered safely) ── */}
                <article
                    className={styles.body}
                    dangerouslySetInnerHTML={{ __html: renderArticleContent(a.content) }}
                />
                <TwitterEmbeds />

                {/* ── Share ──────────────────────────────── */}
                <ShareButtons url={absoluteUrl(`/amakuru/${a.slug}`)} title={a.title} />

                {/* ── Footer ─────────────────────────────── */}
                <div className={styles.footer}>
                    <Link href="/amakuru" className={styles.backLink}>
                        ← Garuka ku makuru
                    </Link>
                    <Link
                        href={`/amakuru/${a.category}`}
                        className={styles.backLink}
                        style={{ opacity: 0.7 }}
                    >
                        Reba byinshi muri {a.category} →
                    </Link>
                </div>

                {/* ── Related Articles ───────────────────── */}
                {relatedArticles.length > 0 && (
                    <section className={styles.related}>
                        <h2 className={styles.relatedTitle}>
                            Ibindi biri muri {a.category}
                        </h2>
                        <div className={styles.relatedGrid}>
                            {relatedArticles.map((r) => (
                                <Link
                                    key={r.id}
                                    href={`/amakuru/${r.slug}`}
                                    className={styles.relatedCard}
                                >
                                    <div className={styles.relatedImgWrap}>
                                        {r.image_url ? (
                                            <Image
                                                src={r.image_url}
                                                alt={r.title}
                                                fill
                                                className={styles.relatedImg}
                                                sizes="(max-width: 600px) 100vw, 400px"
                                            />
                                        ) : (
                                            <span>🖼️</span>
                                        )}
                                    </div>
                                    <div className={styles.relatedBody}>
                                        <span
                                            className={styles.relatedBadge}
                                            style={{ backgroundColor: r.category_color }}
                                        >
                                            {r.category}
                                        </span>
                                        <h3 className={styles.relatedCardTitle}>{r.title}</h3>
                                        <p className={styles.relatedMeta}>{r.read_time} gusoma</p>
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
