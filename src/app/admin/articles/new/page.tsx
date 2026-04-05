import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import ArticleForm from "../_components/ArticleForm";

export const metadata: Metadata = { title: "Inyandiko nshya" };

export default async function NewArticlePage() {
    const { data: categories } = await supabaseAdmin()
        .from("categories")
        .select("slug, name, color")
        .order("name");

    return <ArticleForm categories={categories ?? []} />;
}
