import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { getDefaultArticleCategoryOptions } from "@/lib/categories";
import type { ArticleRow, CategoryRow } from "@/types/database";
import styles from "@/app/amakuru/amakuru.module.css";

type Props = {
    category:     CategoryRow;
    basePath:     string;   // e.g. "/amakuru" or "/inyigisho"
    sectionLabel: string;   // e.g. "Amakuru" or "Inyigisho"
    articleBasePath?: string;
    showSiblingNav?: boolean;
};

/**
 * Shared, database-driven listing page for a single category.
 * Renders the category hero, a sibling-category nav strip, a featured
 * article and a grid of the rest. Articles always link to /amakuru/[slug].
 */
export default async function CategoryListing({
    category,
    basePath,
    sectionLabel,
    articleBasePath = "/amakuru",
    showSiblingNav = true,
}: Props) {
    const [{ data: articlesData }, { data: siblingsData }] = await Promise.all([
        supabase
            .from("articles")
            .select("*")
            .eq("is_published", true)
            .eq("category", category.slug)
            .order("published_at", { ascending: false })
            .limit(24),
        supabase
            .from("categories")
            .select("slug, name, nav_group, sort_order, show_in_nav")
            .eq("nav_group", category.nav_group ?? "")
            .order("sort_order", { ascending: true }),
    ]);

    const articles = (articlesData ?? []) as ArticleRow[];
    const defaultSiblings = getDefaultArticleCategoryOptions()
        .filter(c => c.nav_group === category.nav_group)
        .map(c => ({ slug: c.slug, name: c.name, show_in_nav: true }));
    const siblingMap = new Map<string, Pick<CategoryRow, "slug" | "name" | "show_in_nav">>();

    for (const sibling of defaultSiblings) siblingMap.set(sibling.slug, sibling);
    for (const sibling of ((siblingsData ?? []) as Pick<CategoryRow, "slug" | "name" | "show_in_nav">[])) {
        siblingMap.set(sibling.slug, sibling);
    }

    const siblings = Array.from(siblingMap.values())
        .filter(c => c.show_in_nav !== false);

    const featured = articles.find(a => a.is_featured);
    const rest = articles.filter(a => a.id !== featured?.id);

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <div className="container">
                    <h1 className={styles.pageTitle}>
                        {category.icon ? `${category.icon} ` : ""}{category.name}
                    </h1>
                    {category.description && (
                        <p className={styles.pageDesc}>{category.description}</p>
                    )}
                    {showSiblingNav && (
                        <nav className={styles.catNav} aria-label={`Ibyiciro bya ${sectionLabel}`}>
                            <Link href={basePath} className={styles.catLink}>Byose</Link>
                            {siblings.map(c => (
                                <Link
                                    key={c.slug}
                                    href={`${basePath}/${c.slug}`}
                                    className={`${styles.catLink} ${c.slug === category.slug ? styles.catLinkActive : ""}`}
                                >
                                    {c.name}
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>
            </div>

            <div className="container">
                {featured && (
                    <Link href={`${articleBasePath}/${featured.slug}`} className={styles.featured}>
                        <div className={styles.featuredImgWrap}>
                            {featured.image_url ? (
                                <Image src={featured.image_url} alt={featured.title} fill className={styles.featuredImg} priority />
                            ) : (
                                <div className={styles.imgPlaceholder}>📰</div>
                            )}
                        </div>
                        <div className={styles.featuredBody}>
                            <span className={styles.catBadge} style={{ backgroundColor: featured.category_color }}>
                                {featured.category}
                            </span>
                            <h2 className={styles.featuredTitle}>{featured.title}</h2>
                            <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                            <div className={styles.featuredMeta}>
                                <span>{featured.author}</span>
                                <span>·</span>
                                <span>{featured.read_time} gusoma</span>
                            </div>
                        </div>
                    </Link>
                )}

                {rest.length > 0 ? (
                    <div className={styles.grid}>
                        {rest.map(article => (
                            <Link key={article.id} href={`${articleBasePath}/${article.slug}`} className={styles.card}>
                                <div className={styles.cardImgWrap}>
                                    {article.image_url ? (
                                        <Image src={article.image_url} alt={article.title} fill className={styles.cardImg} />
                                    ) : (
                                        <div className={styles.imgPlaceholder}>📰</div>
                                    )}
                                </div>
                                <div className={styles.cardBody}>
                                    <span className={styles.catBadge} style={{ backgroundColor: article.category_color }}>
                                        {article.category}
                                    </span>
                                    <h3 className={styles.cardTitle}>{article.title}</h3>
                                    <p className={styles.cardExcerpt}>{article.excerpt}</p>
                                    <p className={styles.cardMeta}>{article.read_time} gusoma</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    !featured && (
                        <p className={styles.empty}>
                            Nta nkuru ziboneka muri iki ciro ubu. Subira vuba!
                        </p>
                    )
                )}
            </div>
        </div>
    );
}
