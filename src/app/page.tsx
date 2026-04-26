import { supabase } from "@/lib/supabase";
import type { ArticleRow, EventRow, CategoryRow } from "@/types/database";
import HomeClient from "./_components/HomeClient";

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

    // Sub-stories for the hero side-panels (skip the featured one)
    const subStories = articles.filter(a => a.id !== featured?.id).slice(0, 2);

    // Grid stories: everything except featured (up to 6)
    const gridStories = articles.filter(a => a.id !== featured?.id).slice(0, 6);

    // ── Upcoming events
    const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .gte("event_date", new Date().toISOString().slice(0, 10))
        .order("event_date", { ascending: true })
        .limit(3);

    const events = (eventsData ?? []) as EventRow[];

    // ── Categories (for labelled filter pills)
    const { data: catsData } = await supabase
        .from("categories")
        .select("slug, name, color")
        .order("name", { ascending: true });

    const categories = (catsData ?? []) as Pick<CategoryRow, "slug" | "name" | "color">[];

    return (
        <HomeClient
            featured={featured}
            subStories={subStories}
            gridStories={gridStories}
            events={events}
            categories={categories}
        />
    );
}
