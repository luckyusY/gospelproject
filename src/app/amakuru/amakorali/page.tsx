import type { Metadata } from "next";
import Link              from "next/link";
import Image             from "next/image";
import { buildMeta }    from "@/lib/metadata";
import { supabase }     from "@/lib/supabase";
import type { ArticleRow } from "@/types/database";
import styles           from "../amakuru.module.css";

export const metadata: Metadata = buildMeta({
    title:       "Amakorali",
    description: "Amakuru y'amakorali azwi cyane mu Rwanda n'isi yose.",
    path:        "/amakuru/amakorali",
});

export default async function AmakoraliPage() {
    const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .eq("category", "amakorali")
        .order("published_at", { ascending: false })
        .limit(18);

    const articles = (data ?? []) as ArticleRow[];
    const featured = articles.find(a => a.is_featured);
    const rest     = articles.filter(a => !a.is_featured);

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <div className="container">
                    <h1 className={styles.pageTitle}>Amakorali</h1>
                    <p className={styles.pageDesc}>Amakuru y&apos;amakorali azwi cyane mu Rwanda n&apos;isi yose.</p>
                    <nav className={styles.catNav} aria-label="Ibyiciro by'amakuru">
                        <Link href="/amakuru"                 className={styles.catLink}>Byose</Link>
                        <Link href="/amakuru/abahanzi"        className={styles.catLink}>Abahanzi</Link>
                        <Link href="/amakuru/amakorali"       className={`${styles.catLink} ${styles.catLinkActive}`}>Amakorali</Link>
                        <Link href="/amakuru/amatorero"       className={styles.catLink}>Amatorero</Link>
                        <Link href="/amakuru/ibitaramo"       className={styles.catLink}>Ibitaramo</Link>
                        <Link href="/amakuru/hanze-yu-rwanda" className={styles.catLink}>Hanze y&apos;u Rwanda</Link>
                    </nav>
                </div>
            </div>

            <div className="container">
                {featured && (
                    <Link href={`/amakuru/${featured.slug}`} className={styles.featured}>
                        {featured.image_url && (
                            <div className={styles.featuredImgWrap}>
                                <Image src={featured.image_url} alt={featured.title} fill className={styles.featuredImg} priority />
                            </div>
                        )}
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
                            <Link key={article.id} href={`/amakuru/${article.slug}`} className={styles.card}>
                                {article.image_url && (
                                    <div className={styles.cardImgWrap}>
                                        <Image src={article.image_url} alt={article.title} fill className={styles.cardImg} />
                                    </div>
                                )}
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
                    !featured && <p className={styles.empty}>Nta makuru abonetse ubu. Subira vuba!</p>
                )}
            </div>
        </div>
    );
}
