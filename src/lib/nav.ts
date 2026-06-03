import { supabase } from "@/lib/supabase";
import type { NavItemRow } from "@/types/database";

export type NavChild = { href: string; label: string };
export type NavNode = {
    href: string;
    label: string;
    isMega: boolean;
    children: NavChild[];
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
    const { data, error } = await supabase
        .from("nav_items")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true });

    const rows = (data ?? []) as NavItemRow[];
    if (error || rows.length === 0) return FALLBACK_NAV;

    const tops = rows.filter(r => r.parent_id == null);
    return tops.map(t => ({
        href: t.href,
        label: t.label,
        isMega: t.is_mega,
        children: rows
            .filter(c => c.parent_id === t.id)
            .map(c => ({ href: c.href, label: c.label })),
    }));
}
