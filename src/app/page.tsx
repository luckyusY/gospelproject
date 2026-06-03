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

    // ── Latest published articles (newest first, up to 9)
    const { data: articlesData } = await supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(9);

    const articles = (articlesData ?? []) as ArticleRow[];

    // Featured = first is_featured article; fall back to the very latest
    const featured   = articles.find(a => a.is_featured) ?? articles[0] ?? null;
    const others     = articles.filter(a => a.id !== featured?.id);

    // Hero slideshow: featured first, then the latest stories (up to 5 slides)
    const heroStories = (featured ? [featured, ...others] : others).slice(0, 5);

    // Grid stories: everything except featured (up to 6)
    const gridStories = others.slice(0, 6);

    // ── Upcoming events
    const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .gte("event_date", new Date().toISOString().slice(0, 10))
        .order("event_date", { ascending: true })
        .limit(3);

    const events = (eventsData ?? []) as EventRow[];

    // ── Featured / latest testimonies (featured first)
    const { data: testimoniesData } = await supabase
        .from("testimonies")
        .select("*")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("published_at", { ascending: false })
        .limit(3);

    const testimonies = (testimoniesData ?? []) as TestimonyRow[];

    // ── Homepage featured videos
    const { data: videosData } = await supabase
        .from("videos")
        .select("*")
        .eq("section", "homepage")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .limit(6);

    const videos = (videosData ?? []) as VideoRow[];

    // ── Homepage section toggles / order
    const { data: sectionsData } = await supabase
        .from("homepage_sections")
        .select("*")
        .order("sort_order", { ascending: true });

    const sections = (sectionsData ?? []) as HomepageSectionRow[];

    // ── Categories (for labelled filter pills)
    const { data: catsData } = await supabase
        .from("categories")
        .select("slug, name, color")
        .order("name", { ascending: true });

    const categories = (catsData ?? []) as Pick<CategoryRow, "slug" | "name" | "color">[];
    const settings = await getPublicSiteSettings();

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
