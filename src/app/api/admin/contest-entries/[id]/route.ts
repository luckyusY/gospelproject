import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { ContestEntryInsert } from "@/types/database";

async function requireAuth() {
    return Boolean(await getCurrentAdmin());
}

function unauthorized() {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
}

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
    if (!await requireAuth()) return unauthorized();

    const { id } = await params;
    const raw = await req.json() as Record<string, unknown>;

    const patch: Partial<ContestEntryInsert> = {};
    if (typeof raw.name === "string") patch.name = raw.name.trim();
    if (typeof raw.subtitle === "string") patch.subtitle = raw.subtitle.trim();
    if (raw.image_url !== undefined) {
        patch.image_url = typeof raw.image_url === "string" && raw.image_url.trim() ? raw.image_url.trim() : null;
    }
    if (raw.youtube_id !== undefined) {
        patch.youtube_id = typeof raw.youtube_id === "string" && raw.youtube_id.trim() ? raw.youtube_id.trim() : null;
    }
    if (raw.sort_order !== undefined) patch.sort_order = Number(raw.sort_order) || 0;

    const { data, error } = await supabaseAdmin()
        .from("contest_entries")
        .update(patch as never)
        .eq("id", Number(id))
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const row = Array.isArray(data) ? data[0] : null;
    if (!row) {
        return NextResponse.json(
            { error: "Couldn't save your changes. Check that SUPABASE_SERVICE_ROLE_KEY is set correctly." },
            { status: 500 },
        );
    }
    return NextResponse.json(row);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    if (!await requireAuth()) return unauthorized();

    const { id } = await params;
    const { error } = await supabaseAdmin()
        .from("contest_entries")
        .delete()
        .eq("id", Number(id));

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return new NextResponse(null, { status: 204 });
}
