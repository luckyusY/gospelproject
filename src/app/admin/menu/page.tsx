import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import type { NavItemRow } from "@/types/database";
import MenuManager from "./_components/MenuManager";

export const metadata: Metadata = { title: "Menu" };

export default async function AdminMenuPage() {
    const { data } = await supabaseAdmin()
        .from("nav_items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true });

    const items = (data ?? []) as NavItemRow[];
    return <MenuManager items={items} />;
}
