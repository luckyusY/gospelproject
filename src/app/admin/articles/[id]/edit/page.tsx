import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import ArticleForm from "../../_components/ArticleForm";

export const metadata: Metadata = { title: "Hindura inyandiko" };

type Props = { params: Promise<{ id: string }> };

export default async function EditArticlePage({ params }: Props) {
    const { id } = await params;
    const admin = supabaseAdmin();

    const [{ data: article }, { data: categories }] = await Promise.all([
        admin.from("articles").select("*").eq("id", Number(id)).single(),
        admin.from("categories").select("slug, name, color").order("name"),
    ]);

    if (!article) notFound();

    return <ArticleForm article={article} categories={categories ?? []} />;
}
