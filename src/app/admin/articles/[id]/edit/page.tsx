import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canManageArticleAuthor, getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import { getArticleCategoryOptions } from "@/lib/categories";
import type { ArticleRow } from "@/types/database";
import ArticleForm from "../../_components/ArticleForm";

export const metadata: Metadata = { title: "Edit article" };

type Props = { params: Promise<{ id: string }> };

export default async function EditArticlePage({ params }: Props) {
    const { id } = await params;
    const currentAdmin = await getCurrentAdmin();
    const admin = supabaseAdmin();

    const [{ data: article }, categories] = await Promise.all([
        admin.from("articles").select("*").eq("id", Number(id)).single(),
        getArticleCategoryOptions(admin),
    ]);

    if (!article) notFound();
    if (currentAdmin && !canManageArticleAuthor(currentAdmin, (article as ArticleRow).author)) {
        notFound();
    }

    return (
        <ArticleForm
            article={article}
            categories={categories}
            currentUser={{
                role: currentAdmin?.role ?? "admin",
                displayName: currentAdmin?.displayName ?? "Urugero Media",
            }}
        />
    );
}
