import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import type { EventRow } from "@/types/database";
import EventForm from "../../_components/EventForm";

export const metadata: Metadata = { title: "Hindura igikorwa" };

type Props = { params: Promise<{ id: string }> };

export default async function EditEventPage({ params }: Props) {
    const { id } = await params;
    const { data: event } = await supabaseAdmin()
        .from("events")
        .select("*")
        .eq("id", Number(id))
        .single();

    if (!event) notFound();

    return <EventForm event={event as EventRow} />;
}
