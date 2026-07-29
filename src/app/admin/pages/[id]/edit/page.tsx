import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import type { PageRow } from "@/types/database";
import PageForm from "../../_components/PageForm";

export const metadata: Metadata = { title: "Edit page" };

type Props = { params: Promise<{ id: string }> };

export default async function EditPagePage({ params }: Props) {
    const { id } = await params;
    const { data: page } = await supabaseAdmin()
        .from("pages")
        .select("*")
        .eq("id", Number(id))
        .single();

    if (!page) notFound();

    return <PageForm page={page as PageRow} />;
}
