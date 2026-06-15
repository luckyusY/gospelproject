import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { ContestEntryInsert } from "@/types/database";

function unauthorized() {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
}

async function requireAuth() {
    return Boolean(await getCurrentAdmin());
}

export async function POST(req: NextRequest) {
    if (!await requireAuth()) return unauthorized();

    const body = await req.json() as Partial<ContestEntryInsert>;
    const contestId = Number(body.contest_id);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!contestId || !name) {
        return NextResponse.json({ error: "Enter a contestant name." }, { status: 400 });
    }

    const insert: ContestEntryInsert = {
        contest_id: contestId,
        name,
        subtitle:   typeof body.subtitle === "string" ? body.subtitle.trim() : "",
        image_url:  typeof body.image_url === "string" && body.image_url.trim() ? body.image_url.trim() : null,
        youtube_id: typeof body.youtube_id === "string" && body.youtube_id.trim() ? body.youtube_id.trim() : null,
        sort_order: Number(body.sort_order) || 0,
    };

    const { data, error } = await supabaseAdmin()
        .from("contest_entries")
        .insert(insert as never)
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const row = Array.isArray(data) ? data[0] : null;
    if (!row) {
        return NextResponse.json(
            { error: "Couldn't save the entry. Check that SUPABASE_SERVICE_ROLE_KEY is set correctly." },
            { status: 500 },
        );
    }
    return NextResponse.json(row, { status: 201 });
}
