import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { getArticleCategoryOptions } from "@/lib/categories";
import ArticleForm from "../_components/ArticleForm";

export const metadata: Metadata = { title: "New article" };

type Props = { searchParams: Promise<{ category?: string }> };

export default async function NewArticlePage({ searchParams }: Props) {
    const { category = "" } = await searchParams;
    const categories = await getArticleCategoryOptions(supabaseAdmin());

    return <ArticleForm categories={categories} initialCategory={category} />;
}
