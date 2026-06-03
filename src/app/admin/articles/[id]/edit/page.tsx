import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { getArticleCategoryOptions } from "@/lib/categories";
import ArticleForm from "../../_components/ArticleForm";

export const metadata: Metadata = { title: "Edit article" };

type Props = { params: Promise<{ id: string }> };

export default async function EditArticlePage({ params }: Props) {
    const { id } = await params;
    const admin = supabaseAdmin();

    const [{ data: article }, categories] = await Promise.all([
        admin.from("articles").select("*").eq("id", Number(id)).single(),
        getArticleCategoryOptions(admin),
    ]);

    if (!article) notFound();

    return <ArticleForm article={article} categories={categories} />;
}
