import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import type { ArticleRow } from "@/types/database";
import ArticleListClient from "./_components/ArticleListClient";

export const metadata: Metadata = { title: "Articles" };

type Props = { searchParams: Promise<{ category?: string }> };

export default async function AdminArticlesPage({ searchParams }: Props) {
    const { category = "" } = await searchParams;
    const result = await supabaseAdmin()
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
    const articles = (result.data ?? []) as ArticleRow[];

    return <ArticleListClient articles={articles} initialCategory={category} />;
}
