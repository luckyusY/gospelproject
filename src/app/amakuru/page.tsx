import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildMeta } from "@/lib/metadata";
import { supabase } from "@/lib/supabase";
import type { ArticleRow } from "@/types/database";
import styles from "./amakuru.module.css";

export const metadata: Metadata = buildMeta({
    title: "Amakuru",
    description: "Amakuru mashya y'Ubukristu mu Rwanda no ku isi yose.",
    path: "/amakuru",
});

const categories = [
    { label: "Byose",              href: "/amakuru",                  slug: null },
    { label: "Abahanzi",           href: "/amakuru/abahanzi",         slug: "abahanzi" },
    { label: "Amakorali",          href: "/amakuru/amakorali",        slug: "amakorali" },
    { label: "Amatorero",          href: "/amakuru/amatorero",        slug: "amatorero" },
    { label: "Abanyempano",        href: "/amakuru/abanyempano",      slug: "abanyempano" },
    { label: "Ibitaramo",          href: "/amakuru/ibitaramo",        slug: "ibitaramo" },
    { label: "Hanze y'u Rwanda",   href: "/amakuru/hanze-yu-rwanda",  slug: "hanze-yu-rwanda" },
];

export default async function AmakuruPage() {
    const articlesResult = await supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(18);
    const articles = (articlesResult.data ?? []) as ArticleRow[];

    const featured  = articles.find(a => a.is_featured);
    const rest       = articles.filter(a => !a.is_featured);

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.pageHeader}>
                <div className="container">
                    <h1 className={styles.pageTitle}>Amakuru</h1>
                    <p className={styles.pageDesc}>
                        Amakuru mashya y&apos;Ubukristu mu Rwanda no ku isi yose
                    </p>
                    {/* Category nav */}
                    <nav className={styles.catNav} aria-label="Ibyiciro by'amakuru">
                        {categories.map(cat => (
                            <Link key={cat.label} href={cat.href} className={styles.catLink}>
                                {cat.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="container">
                {/* Featured article */}
                {featured && (
                    <Link href={`/amakuru/${featured.slug}`} className={styles.featured}>
                        <div className={styles.featuredImgWrap}>
                            {featured.image_url ? (
                                <Image
                                    src={featured.image_url}
                                    alt={featured.title}
                                    fill
                                    className={styles.featuredImg}
                                    priority
                                />
                            ) : (
                                <div className={styles.imgPlaceholder}>📰</div>
                            )}
                        </div>
                        <div className={styles.featuredBody}>
                            <span
                                className={styles.catBadge}
                                style={{ backgroundColor: featured.category_color }}
                            >
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

                {/* Grid */}
                {rest.length > 0 ? (
                    <div className={styles.grid}>
                        {rest.map(article => (
                            <Link key={article.id} href={`/amakuru/${article.slug}`} className={styles.card}>
                                <div className={styles.cardImgWrap}>
                                    {article.image_url ? (
                                        <Image
                                            src={article.image_url}
                                            alt={article.title}
                                            fill
                                            className={styles.cardImg}
                                        />
                                    ) : (
                                        <div className={styles.imgPlaceholder}>📰</div>
                                    )}
                                </div>
                                <div className={styles.cardBody}>
                                    <span
                                        className={styles.catBadge}
                                        style={{ backgroundColor: article.category_color }}
                                    >
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
                            Nta makuru abonetse ubu. Subira vuba!
                        </p>
                    )
                )}
            </div>
        </div>
    );
}
