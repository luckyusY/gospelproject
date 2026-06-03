import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { supabase } from "@/lib/supabase";
import CategoryListing from "@/components/CategoryListing";
import type { CategoryRow } from "@/types/database";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

async function getInyigishoCategory(slug: string): Promise<CategoryRow | null> {
    const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .eq("nav_group", "inyigisho")
        .maybeSingle();
    return (data as CategoryRow | null) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = await getInyigishoCategory(slug);
    if (!category) return {};
    return buildMeta({
        title:       category.name,
        description: category.description ?? `Inyigisho za ${category.name} kuri Urugero Media.`,
        path:        `/inyigisho/${slug}`,
    });
}

export async function generateStaticParams() {
    const { data } = await supabase
        .from("categories")
        .select("slug")
        .eq("nav_group", "inyigisho");
    return ((data ?? []) as { slug: string }[]).map(row => ({ slug: row.slug }));
}

export default async function InyigishoCategoryPage({ params }: Props) {
    const { slug } = await params;
    const category = await getInyigishoCategory(slug);
    if (!category) notFound();
    return <CategoryListing category={category} basePath="/inyigisho" sectionLabel="Inyigisho" />;
}
