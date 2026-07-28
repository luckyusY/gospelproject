import type { Metadata } from "next";
import { getCurrentAdmin, getJournalistAuthorNames, isFullAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { ArticleRow } from "@/types/database";
import ArticleListClient from "./_components/ArticleListClient";

export const metadata: Metadata = { title: "Articles" };

type Props = { searchParams: Promise<{ category?: string }> };

export default async function AdminArticlesPage({ searchParams }: Props) {
    const { category = "" } = await searchParams;
    const currentAdmin = await getCurrentAdmin();
    const query = supabaseAdmin()
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
    const result = currentAdmin && !isFullAdmin(currentAdmin)
        ? await query.in("author", getJournalistAuthorNames(currentAdmin))
        : await query;
    const articles = (result.data ?? []) as ArticleRow[];

    return <ArticleListClient articles={articles} initialCategory={category} />;
}
