import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { RadioTrackRow } from "@/types/database";

const FALLBACK_CLOCK_EPOCH = Date.UTC(2026, 0, 1, 0, 0, 0);

export async function GET() {
    const serverTimeMs = Date.now();
    const { data, error } = await supabaseAdmin()
        .from("radio_tracks")
        .select("id, title, file_url, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[Radio tracks GET]", error);
        return NextResponse.json({
            tracks: [],
            serverTimeMs,
            clockEpochMs: FALLBACK_CLOCK_EPOCH,
        });
    }

    return NextResponse.json({
        tracks: data as RadioTrackRow[],
        serverTimeMs,
        clockEpochMs: FALLBACK_CLOCK_EPOCH,
    });
}
