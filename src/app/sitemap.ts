import type { MetadataRoute } from "next";
import { getDefaultArticleCategoryOptions } from "@/lib/categories";
import { SITE_URL } from "@/lib/metadata";
import { supabase } from "@/lib/supabase";
import type { ArticleRow, CategoryRow, ContestRow, EventRow, PageRow, TestimonyRow } from "@/types/database";

const BASE = SITE_URL.replace(/\/$/, "");

type SitemapEntry = MetadataRoute.Sitemap[number];

function entry(
    path: string,
    options: {
        lastModified?: string | Date | null;
        changeFrequency?: SitemapEntry["changeFrequency"];
        priority?: number;
    } = {}
): SitemapEntry {
    return {
        url: `${BASE}${path === "/" ? "" : path}`,
        lastModified: options.lastModified ? new Date(options.lastModified) : new Date(),
        changeFrequency: options.changeFrequency ?? "weekly",
        priority: options.priority ?? 0.7,
    };
}

function articlePath(article: Pick<ArticleRow, "slug" | "category">, categoryGroups: Map<string, string | null>) {
    const navGroup = categoryGroups.get(article.category);

    if (article.category === "ibigwi") return `/ibigwi/${article.slug}`;
    if (article.category === "tumenye-bibiliya") return `/tumenye-bibiliya/${article.slug}`;
    if (navGroup === "inyigisho") return `/inyigisho/${article.slug}`;
    if (navGroup === "media-group") return `/urugero-media-group/${article.slug}`;

    return `/amakuru/${article.slug}`;
}

function categoryPath(category: Pick<CategoryRow, "slug" | "nav_group">) {
    if (category.nav_group === "amakuru") return `/amakuru/${category.slug}`;
    if (category.nav_group === "inyigisho") return `/inyigisho/${category.slug}`;
    if (category.nav_group === "media-group") return `/urugero-media-group/${category.slug}`;
    return null;
}

function uniqueRoutes(routes: MetadataRoute.Sitemap) {
    return Array.from(new Map(routes.map((route) => [route.url, route])).values());
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [
        articlesResult,
        categoriesResult,
        eventsResult,
        testimoniesResult,
        pagesResult,
        contestsResult,
    ] = await Promise.all([
        supabase
            .from("articles")
            .select("slug, category, updated_at, published_at")
            .eq("is_published", true),
        supabase
            .from("categories")
            .select("slug, nav_group, created_at")
            .eq("show_in_nav", true),
        supabase
            .from("events")
            .select("slug, updated_at, event_date")
            .eq("is_published", true),
        supabase
            .from("testimonies")
            .select("slug, updated_at, published_at")
            .eq("is_published", true),
        supabase
            .from("pages")
            .select("slug, nav_group, updated_at")
            .eq("is_published", true),
        supabase
            .from("contests")
            .select("slug, updated_at")
            .eq("is_active", true),
    ]);

    const dbCategories = (categoriesResult.data ?? []) as Pick<CategoryRow, "slug" | "nav_group" | "created_at">[];
    const defaultCategories = getDefaultArticleCategoryOptions().map((category) => ({
        slug: category.slug,
        nav_group: category.nav_group,
        created_at: new Date().toISOString(),
    }));
    const categories = Array.from(
        new Map([...defaultCategories, ...dbCategories].map((category) => [category.slug, category])).values()
    );
    const categoryGroups = new Map(categories.map((category) => [category.slug, category.nav_group]));

    const staticRoutes: MetadataRoute.Sitemap = [
        entry("/", { changeFrequency: "daily", priority: 1 }),
        entry("/amakuru", { changeFrequency: "daily", priority: 0.95 }),
        entry("/inyigisho", { changeFrequency: "weekly", priority: 0.9 }),
        entry("/tumenye-bibiliya", { changeFrequency: "weekly", priority: 0.85 }),
        entry("/ubuhamya", { changeFrequency: "weekly", priority: 0.85 }),
        entry("/ibigwi", { changeFrequency: "weekly", priority: 0.8 }),
        entry("/events", { changeFrequency: "daily", priority: 0.85 }),
        entry("/urugero-tv-radio", { changeFrequency: "daily", priority: 0.9 }),
        entry("/urugero-media-group", { changeFrequency: "weekly", priority: 0.8 }),
        entry("/amatora", { changeFrequency: "daily", priority: 0.7 }),
        entry("/abo-turibo", { changeFrequency: "monthly", priority: 0.7 }),
        entry("/contact", { changeFrequency: "monthly", priority: 0.6 }),
        entry("/search", { changeFrequency: "weekly", priority: 0.5 }),
        entry("/analytics", { changeFrequency: "monthly", priority: 0.4 }),
        entry("/privacy", { changeFrequency: "yearly", priority: 0.3 }),
        entry("/terms", { changeFrequency: "yearly", priority: 0.3 }),
    ];

    const categoryRoutes = categories
        .map((category) => {
            const path = categoryPath(category);
            return path
                ? entry(path, {
                    lastModified: category.created_at,
                    changeFrequency: "weekly",
                    priority: category.nav_group === "amakuru" ? 0.75 : 0.7,
                })
                : null;
        })
        .filter((route): route is SitemapEntry => Boolean(route));

    const articleRoutes = ((articlesResult.data ?? []) as Pick<ArticleRow, "slug" | "category" | "updated_at" | "published_at">[])
        .map((article) => entry(articlePath(article, categoryGroups), {
            lastModified: article.updated_at ?? article.published_at,
            changeFrequency: "weekly",
            priority: 0.75,
        }));

    const eventRoutes = ((eventsResult.data ?? []) as Pick<EventRow, "slug" | "updated_at" | "event_date">[])
        .map((event) => entry(`/events/${event.slug}`, {
            lastModified: event.updated_at ?? event.event_date,
            changeFrequency: "weekly",
            priority: 0.7,
        }));

    const testimonyRoutes = ((testimoniesResult.data ?? []) as Pick<TestimonyRow, "slug" | "updated_at" | "published_at">[])
        .map((testimony) => entry(`/ubuhamya/${testimony.slug}`, {
            lastModified: testimony.updated_at ?? testimony.published_at,
            changeFrequency: "monthly",
            priority: 0.7,
        }));

    const pageRoutes = ((pagesResult.data ?? []) as Pick<PageRow, "slug" | "nav_group" | "updated_at">[])
        .filter((page) => page.nav_group === "media-group")
        .map((page) => entry(`/urugero-media-group/${page.slug}`, {
            lastModified: page.updated_at,
            changeFrequency: "monthly",
            priority: 0.65,
        }));

    const contestRoutes = ((contestsResult.data ?? []) as Pick<ContestRow, "slug" | "updated_at">[])
        .map((contest) => entry(`/amatora/${contest.slug}`, {
            lastModified: contest.updated_at,
            changeFrequency: "daily",
            priority: 0.65,
        }));

    return uniqueRoutes([
        ...staticRoutes,
        ...categoryRoutes,
        ...articleRoutes,
        ...eventRoutes,
        ...testimonyRoutes,
        ...pageRoutes,
        ...contestRoutes,
    ]);
}
