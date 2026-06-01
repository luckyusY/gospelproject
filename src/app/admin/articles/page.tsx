import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import type { ArticleRow } from "@/types/database";
import ArticleListClient from "./_components/ArticleListClient";

export const metadata: Metadata = { title: "Articles" };

export default async function AdminArticlesPage() {
    const result = await supabaseAdmin()
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
    const articles = (result.data ?? []) as ArticleRow[];

    return <ArticleListClient articles={articles} />;
}
