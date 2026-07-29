import { supabase } from "@/lib/supabase";
import type {
    ArticleRow,
    EventRow,
    CategoryRow,
    TestimonyRow,
    VideoRow,
    HomepageSectionRow,
} from "@/types/database";
import HomeClient from "./_components/HomeClient";
import { getPublicSiteSettings } from "@/lib/siteSettings";

export const revalidate = 60; // ISR: re-fetch every 60 s in production

export default async function Home() {

    // Fetch everything the homepage needs in parallel — these queries are
    // independent, so running them together (instead of awaiting one after
    // another) cuts the homepage's load time to a single round-trip's worth.
    const today = new Date().toISOString().slice(0, 10);
    const [
        featuredResult,
        latestResult,
        eventsResult,
        testimoniesResult,
        videosResult,
        sectionsResult,
        catsResult,
        settings,
    ] = await Promise.all([
        supabase
            .from("articles")
            .select("*")
            .eq("is_published", true)
            .eq("is_featured", true)
            .order("published_at", { ascending: false })
            .limit(5),
        supabase
            .from("articles")
            .select("*")
            .eq("is_published", true)
            .order("published_at", { ascending: false })
            .limit(12),
        supabase
            .from("events")
            .select("*")
            .eq("is_published", true)
            .gte("event_date", today)
            .order("event_date", { ascending: true })
            .limit(3),
        supabase
            .from("testimonies")
            .select("*")
            .eq("is_published", true)
            .order("is_featured", { ascending: false })
            .order("published_at", { ascending: false })
            .limit(3),
        supabase
            .from("videos")
            .select("*")
            .eq("section", "homepage")
            .eq("is_published", true)
            .order("sort_order", { ascending: true })
            .limit(6),
        supabase
            .from("homepage_sections")
            .select("*")
            .order("sort_order", { ascending: true }),
        supabase
            .from("categories")
            .select("slug, name, color, nav_group")
            .order("name", { ascending: true }),
        getPublicSiteSettings(),
    ]);

    const featuredArticles = (featuredResult.data ?? []) as ArticleRow[];
    const latestArticles = (latestResult.data ?? []) as ArticleRow[];

    const storyMap = new Map<number, ArticleRow>();
    for (const article of [...featuredArticles, ...latestArticles]) {
        storyMap.set(article.id, article);
    }

    const stories = Array.from(storyMap.values());
    const heroStories = stories.slice(0, 5);
    const featuredIds = new Set(featuredArticles.map(article => article.id));
    const gridStories = latestArticles
        .filter(article => !featuredIds.has(article.id))
        .slice(0, 6);

    const events = (eventsResult.data ?? []) as EventRow[];
    const testimonies = (testimoniesResult.data ?? []) as TestimonyRow[];
    const videos = (videosResult.data ?? []) as VideoRow[];
    const sections = (sectionsResult.data ?? []) as HomepageSectionRow[];
    const categories = (catsResult.data ?? []) as Pick<CategoryRow, "slug" | "name" | "color" | "nav_group">[];

    return (
        <HomeClient
            heroStories={heroStories}
            gridStories={gridStories}
            events={events}
            testimonies={testimonies}
            videos={videos}
            sections={sections}
            categories={categories}
            settings={settings}
        />
    );
}
