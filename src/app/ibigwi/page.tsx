import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { ensureDefaultArticleCategories } from "@/lib/categories";
import { getPage } from "@/lib/pages";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import SectionPage from "@/components/SectionPage";
import { ArticleCard } from "@/components/ui";
import type { ArticleRow } from "@/types/database";
import styles from "./ibigwi.module.css";

const FALLBACK = {
    title: "Ibigwi",
    subtitle: "URUGERO MEDIA — IBIGWI",
    description: "Ibigwi n'ibikorwa by'abakristu bisangirwa n'abandi ngo bibihe imbaraga.",
    icon: "🏆",
    color: "#1F1F1F",
    hero: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=1400&auto=format&fit=crop",
};

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPage("ibigwi");
    return buildMeta({
        title: page?.title ?? FALLBACK.title,
        description: page?.subtitle || FALLBACK.description,
        path: "/ibigwi",
    });
}

export default async function IbigwiPage() {
    await ensureDefaultArticleCategories(supabaseAdmin());

    const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .eq("category", "ibigwi")
        .order("published_at", { ascending: false })
        .limit(24);

    const page = await getPage("ibigwi");
    const articles = (data ?? []) as ArticleRow[];

    return (
        <SectionPage
            title={page?.title ?? FALLBACK.title}
            subtitle={page?.subtitle || FALLBACK.subtitle}
            description={FALLBACK.description}
            icon={page?.icon ?? FALLBACK.icon}
            color={page?.color ?? FALLBACK.color}
            heroImage={page?.hero_image ?? FALLBACK.hero}
            layoutVariant={page?.layout_variant ?? "feature"}
            wideContent
        >
            {page?.content && <div dangerouslySetInnerHTML={{ __html: page.content }} />}
            <section className={styles.articleSection} aria-label="Inkuru z'ibigwi">
                <div className={styles.sectionHeader}>
                    <div>
                        <p className={styles.kicker}>Inkuru z&apos;ibigwi</p>
                        <h2>Abatanze urugero rwiza</h2>
                    </div>
                    <span className={styles.countBadge}>{articles.length} inkuru</span>
                </div>

                {articles.length > 0 ? (
                    <div className={styles.grid}>
                        {articles.map((article) => (
                            <ArticleCard
                                key={article.id}
                                href={`/ibigwi/${article.slug}`}
                                category={article.category}
                                categoryColor={article.category_color}
                                title={article.title}
                                excerpt={article.excerpt}
                                image={article.image_url ?? FALLBACK.hero}
                                author={article.author}
                                readTime={article.read_time}
                                featured={article.is_featured}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <h3>Inkuru z&apos;ibigwi ziraza vuba</h3>
                        <p>Hitamo category ya <strong>Ibigwi</strong> muri Admin Articles kugira ngo inkuru zigaragare hano.</p>
                    </div>
                )}
            </section>
        </SectionPage>
    );
}
