import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { buildMeta } from "@/lib/metadata";
import type { ArticleRow } from "@/types/database";
import type { Metadata } from "next";
import styles from "./article.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const metaResult = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
    const data = metaResult.data as ArticleRow | null;

    if (!data) return {};
    return buildMeta({
        title: data.title,
        description: data.excerpt,
        path: `/amakuru/${slug}`,
        image: data.image_url ?? undefined,
    });
}

export async function generateStaticParams() {
    const result = await supabase
        .from("articles")
        .select("*")
        .eq("is_published", true);
    const rows = (result.data ?? []) as ArticleRow[];
    return rows.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    const articleResult = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
    const article = articleResult.data as ArticleRow | null;

    if (!article) notFound();

    const publishedDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString("rw-RW", {
              day: "numeric", month: "long", year: "numeric",
          })
        : null;

    // Simple MDX-like rendering: split on ## and render as sections
    const sections = article.content.split(/\n##\s+/).filter(Boolean);

    return (
        <article className={styles.page}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb} aria-label="Inzira">
                <Link href="/">Ahabanza</Link>
                <span aria-hidden>›</span>
                <Link href="/amakuru">Amakuru</Link>
                <span aria-hidden>›</span>
                <Link href={`/amakuru/${article.category}`}>{article.category}</Link>
                <span aria-hidden>›</span>
                <span aria-current="page">{article.title}</span>
            </nav>

            {/* Hero */}
            <div className={styles.hero}>
                <span className={styles.categoryBadge} style={{ backgroundColor: article.category_color }}>
                    {article.category}
                </span>
                <h1 className={styles.title}>{article.title}</h1>
                <p className={styles.excerpt}>{article.excerpt}</p>
                <div className={styles.meta}>
                    {article.author_avatar && (
                        <Image
                            src={article.author_avatar}
                            alt={article.author}
                            width={36}
                            height={36}
                            className={styles.avatar}
                        />
                    )}
                    <span className={styles.author}>{article.author}</span>
                    {publishedDate && <span className={styles.date}>{publishedDate}</span>}
                    <span className={styles.readTime}>{article.read_time} gusoma</span>
                </div>
            </div>

            {/* Cover image */}
            {article.image_url && (
                <div className={styles.coverWrap}>
                    <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        className={styles.coverImg}
                        priority
                    />
                </div>
            )}

            {/* Content */}
            <div className={styles.body}>
                {sections.map((section, i) => {
                    const lines = section.split("\n").filter(Boolean);
                    const heading = i === 0 && !article.content.startsWith("##")
                        ? null
                        : lines[0];
                    const body = heading ? lines.slice(1) : lines;

                    return (
                        <section key={i} className={styles.section}>
                            {heading && <h2 className={styles.sectionHeading}>{heading}</h2>}
                            {body.map((para, j) => (
                                <p key={j} className={styles.para}>{para}</p>
                            ))}
                        </section>
                    );
                })}
            </div>

            {/* Back link */}
            <div className={styles.footer}>
                <Link href="/amakuru" className={styles.backLink}>
                    ← Garuka ku makuru
                </Link>
            </div>
        </article>
    );
}
