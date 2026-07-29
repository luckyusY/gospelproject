import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { supabaseAdmin } from "@/lib/supabase";
import { ensureDefaultArticleCategories } from "@/lib/categories";
import CategoryListing from "@/components/CategoryListing";
import type { CategoryRow } from "@/types/database";

export const metadata: Metadata = buildMeta({
    title: "Tumenye Bibiliya",
    description: "Inkuru, inyigisho n'ibisobanuro bifasha gusobanukirwa Bibiliya neza.",
    path: "/tumenye-bibiliya",
});

export const revalidate = 60;

export default async function TumenyeBibiliyaPage() {
    const admin = supabaseAdmin();
    await ensureDefaultArticleCategories(admin);

    const { data: category } = await admin
        .from("categories")
        .select("*")
        .eq("slug", "tumenye-bibiliya")
        .maybeSingle();

    const bibleCategory = category as CategoryRow | null;

    return (
        <CategoryListing
            category={bibleCategory ?? {
                id: 0,
                name: "Tumenye Bibiliya",
                slug: "tumenye-bibiliya",
                color: "#1E40AF",
                parent_id: null,
                nav_group: "tumenye-bibiliya",
                icon: null,
                description: "Inkuru, inyigisho n'ibisobanuro bifasha gusobanukirwa Bibiliya neza.",
                hero_image: null,
                sort_order: 0,
                show_in_nav: true,
                created_at: new Date().toISOString(),
            }}
            basePath="/tumenye-bibiliya"
            sectionLabel="Tumenye Bibiliya"
            articleBasePath="/tumenye-bibiliya"
            showSiblingNav={false}
        />
    );
}
