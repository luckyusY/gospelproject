import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { RadioTrackRow } from "@/types/database";

export async function GET() {
    const { data, error } = await supabaseAdmin()
        .from("radio_tracks")
        .select("id, title, file_url, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[Radio tracks GET]", error);
        return NextResponse.json({ tracks: [] });
    }

    return NextResponse.json({ tracks: data as RadioTrackRow[] });
}
