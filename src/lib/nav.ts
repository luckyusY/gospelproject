import { supabase } from "@/lib/supabase";
import type { NavItemRow } from "@/types/database";

export type NavChild = { href: string; label: string };
export type NavNode = {
    href: string;
    label: string;
    isMega: boolean;
    children: NavChild[];
};

const REQUIRED_AMAKURU_CHILDREN: NavChild[] = [
    { href: "/amakuru/inkuru-yanjye", label: "Inkuru yanjye" },
    { href: "/amakuru/ibaruwa", label: "Ibaruwa" },
];

/** Maps a category's `nav_group` to the top-level menu item it belongs under. */
const NAV_GROUP_TO_TOP_HREF: Record<string, string> = {
    amakuru: "/amakuru",
    inyigisho: "/inyigisho",
    ibigwi: "/ibigwi",
    "tumenye-bibiliya": "/tumenye-bibiliya",
    "media-group": "/urugero-media-group",
};

type CategoryNavRow = {
    slug: string;
    name: string;
    nav_group: string | null;
    sort_order: number;
    show_in_nav: boolean;
};

/**
 * Hardcoded fallback used when the `nav_items` table is empty or unavailable,
 * so the site menu never disappears. Mirrors the original Header menu.
 */
export const FALLBACK_NAV: NavNode[] = [
    { href: "/", label: "Ahabanza", isMega: false, children: [] },
    {
        href: "/amakuru", label: "Amakuru", isMega: false, children: [
            { href: "/amakuru/abahanzi", label: "Abahanzi" },
            { href: "/amakuru/amakorali", label: "Amakorali" },
            { href: "/amakuru/amatorero", label: "Amatorero" },
            { href: "/amakuru/abanyempano", label: "Abanyempano" },
            { href: "/amakuru/ibitaramo", label: "Ibitaramo" },
            { href: "/amakuru/sport", label: "Sport" },
            { href: "/amakuru/hanze-yu-rwanda", label: "Hanze y'u Rwanda" },
            { href: "/amakuru/inkuru-yanjye", label: "Inkuru yanjye" },
            { href: "/amakuru/ibaruwa", label: "Ibaruwa" },
            { href: "/amakuru/ubuzima", label: "Ubuzima" },
            { href: "/amakuru/ubukungu", label: "Ubukungu" },
        ],
    },
    { href: "/ubuhamya", label: "Ubuhamya", isMega: false, children: [] },
    { href: "/ibigwi", label: "Ibigwi", isMega: false, children: [] },
    {
        href: "/inyigisho", label: "Inyigisho", isMega: false, children: [
            { href: "/inyigisho/umuryango", label: "Umuryango" },
            { href: "/inyigisho/abana", label: "Abana" },
            { href: "/inyigisho/urubyiruko", label: "Urubyiruko" },
            { href: "/inyigisho/abagabo", label: "Abagabo" },
            { href: "/inyigisho/abagore", label: "Abagore" },
            { href: "/inyigisho/ubuzima-bwumwuka", label: "Ubuzima bw'Umwuka" },
            { href: "/inyigisho/bible-quiz", label: "Bible Quiz" },
        ],
    },
    { href: "/tumenye-bibiliya", label: "Tumenye Bibiliya", isMega: false, children: [] },
    { href: "/amatora", label: "Amatora", isMega: false, children: [] },
    { href: "/urugero-tv-radio", label: "Urugero TV & Radio", isMega: false, children: [] },
    {
        href: "/urugero-media-group", label: "Urugero Media Group", isMega: true, children: [
            { href: "/urugero-media-group/music-academy", label: "🎵 Urugero Music Academy" },
            { href: "/urugero-media-group/films", label: "🎬 Urugero Films" },
            { href: "/urugero-media-group/records", label: "🎙️ Urugero Records" },
            { href: "/urugero-media-group/music-talent", label: "🌟 Urugero Music Talent" },
            { href: "/urugero-media-group/online-radio", label: "📻 Urugero Online Radio" },
            { href: "/urugero-media-group/bible-quiz", label: "📖 Urugero Bible Quiz" },
            { href: "/urugero-media-group/practice-room", label: "🎹 Urugero Practice Room" },
            { href: "/urugero-media-group/podcast", label: "🎧 Urugero Podcast" },
        ],
    },
    { href: "/abo-turibo", label: "Abo Turibo", isMega: false, children: [] },
    { href: "/contact", label: "Contact", isMega: false, children: [] },
];

/** Build the navigation tree from the `nav_items` table, with a safe fallback. */
export async function getNavTree(): Promise<NavNode[]> {
    const [navResult, categories] = await Promise.all([
        supabase
            .from("nav_items")
            .select("*")
            .eq("is_visible", true)
            .order("sort_order", { ascending: true })
            .order("id", { ascending: true }),
        getNavCategories(),
    ]);

    const { data, error } = navResult;
    const rows = (data ?? []) as NavItemRow[];

    // Start from the DB menu when it exists, otherwise the built-in fallback.
    const baseTree: NavNode[] =
        error || rows.length === 0
            ? FALLBACK_NAV
            : rows
                  .filter(r => r.parent_id == null)
                  .map(t => ({
                      href: t.href,
                      label: t.label,
                      isMega: t.is_mega,
                      children: rows
                          .filter(c => c.parent_id === t.id)
                          .map(c => ({ href: c.href, label: c.label })),
                  }));

    // Fold every "show in menu" category into the matching top-level dropdown so
    // adding a category in the admin is enough — no separate Menu edit needed.
    return baseTree.map(node => ({
        ...node,
        children: mergeChildren(node.href, node.children, categories),
    }));
}

/** Fetch categories that should appear in the menu, sorted within each group. */
async function getNavCategories(): Promise<CategoryNavRow[]> {
    const { data, error } = await supabase
        .from("categories")
        .select("slug, name, nav_group, sort_order, show_in_nav")
        .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return (data as CategoryNavRow[]).filter(c => c.show_in_nav !== false && c.nav_group != null);
}

function mergeChildren(parentHref: string, children: NavChild[], categories: CategoryNavRow[]) {
    const merged = new Map(children.map(child => [child.href, child]));

    // Append categories whose group maps to this top-level item.
    for (const cat of categories) {
        if (cat.nav_group == null) continue;
        if (NAV_GROUP_TO_TOP_HREF[cat.nav_group] !== parentHref) continue;
        const href = `${parentHref}/${cat.slug}`;
        if (!merged.has(href)) merged.set(href, { href, label: cat.name });
    }

    if (parentHref === "/amakuru") {
        for (const child of REQUIRED_AMAKURU_CHILDREN) {
            if (!merged.has(child.href)) merged.set(child.href, child);
        }
    }

    return Array.from(merged.values());
}
