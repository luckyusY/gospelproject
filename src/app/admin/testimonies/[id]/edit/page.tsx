import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import type { TestimonyRow } from "@/types/database";
import TestimonyForm from "../../_components/TestimonyForm";

export const metadata: Metadata = { title: "Edit testimony" };

type Props = { params: Promise<{ id: string }> };

export default async function EditTestimonyPage({ params }: Props) {
    const { id } = await params;
    const { data: testimony } = await supabaseAdmin()
        .from("testimonies")
        .select("*")
        .eq("id", Number(id))
        .single();

    if (!testimony) notFound();

    return <TestimonyForm testimony={testimony as TestimonyRow} />;
}
