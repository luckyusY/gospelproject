import type { Metadata } from "next";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import { getArticleCategoryOptions } from "@/lib/categories";
import ArticleForm from "../_components/ArticleForm";

export const metadata: Metadata = { title: "New article" };

type Props = { searchParams: Promise<{ category?: string }> };

export default async function NewArticlePage({ searchParams }: Props) {
    const { category = "" } = await searchParams;
    const currentAdmin = await getCurrentAdmin();
    const categories = await getArticleCategoryOptions(supabaseAdmin());

    return (
        <ArticleForm
            categories={categories}
            initialCategory={category}
            currentUser={{
                role: currentAdmin?.role ?? "admin",
                displayName: currentAdmin?.displayName ?? "Urugero Media",
            }}
        />
    );
}
