import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { getArticleCategoryOptions } from "@/lib/categories";
import ArticleForm from "../_components/ArticleForm";

export const metadata: Metadata = { title: "New article" };

export default async function NewArticlePage() {
    const categories = await getArticleCategoryOptions(supabaseAdmin());

    return <ArticleForm categories={categories} />;
}
