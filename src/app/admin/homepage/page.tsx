import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import type { HomepageSectionRow, ArticleRow } from "@/types/database";
import { getPublicSiteSettings } from "@/lib/siteSettings";
import HomepageManager from "./_components/HomepageManager";

export const metadata: Metadata = { title: "Homepage" };

export default async function AdminHomepagePage() {
    const admin = supabaseAdmin();

    const [sectionsRes, articlesRes] = await Promise.all([
        admin.from("homepage_sections").select("*").order("sort_order", { ascending: true }),
        admin.from("articles")
            .select("id, title, slug, is_featured, is_published, published_at")
            .order("published_at", { ascending: false })
            .limit(40),
    ]);

    const sections = (sectionsRes.data ?? []) as HomepageSectionRow[];
    const articles = (articlesRes.data ?? []) as Pick<ArticleRow, "id" | "title" | "slug" | "is_featured" | "is_published" | "published_at">[];
    const settings = await getPublicSiteSettings();

    return (
        <HomepageManager
            sections={sections}
            articles={articles}
            verseText={settings.verse_text ?? ""}
            verseReference={settings.verse_reference ?? ""}
            tickerLines={settings.ticker_lines ?? ""}
            embedTitle={settings.homepage_embed_title ?? ""}
            embedUrl={settings.homepage_embed_url ?? ""}
        />
    );
}
