import { supabase } from "@/lib/supabase";
import type { PageRow } from "@/types/database";

/** Fetch a single published page by slug. */
export async function getPage(slug: string): Promise<PageRow | null> {
    const { data } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
    return (data as PageRow | null) ?? null;
}

/** Fetch all published pages in a nav group (e.g. "media-group"), ordered. */
export async function getPagesByGroup(group: string): Promise<PageRow[]> {
    const { data } = await supabase
        .from("pages")
        .select("*")
        .eq("nav_group", group)
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
    return (data ?? []) as PageRow[];
}
