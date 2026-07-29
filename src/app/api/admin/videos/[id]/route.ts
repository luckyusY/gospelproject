import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { VideoInsert } from "@/types/database";
import { parseYoutubeId } from "../route";

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
    const raw = await req.json() as Partial<VideoInsert>;

    const patch: Record<string, unknown> = {};
    if (typeof raw.title === "string" && raw.title.trim()) patch.title = raw.title.trim();
    if (typeof raw.description === "string") patch.description = raw.description.trim();
    if (typeof raw.youtube_id === "string" && raw.youtube_id.trim()) patch.youtube_id = parseYoutubeId(raw.youtube_id);
    if (typeof raw.section === "string" && raw.section.trim()) patch.section = raw.section.trim();
    if (raw.sort_order !== undefined) patch.sort_order = Number(raw.sort_order) || 0;
    if (typeof raw.is_published === "boolean") patch.is_published = raw.is_published;

    if (Object.keys(patch).length === 0) {
        return NextResponse.json({ error: "No changes were provided." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin()
        .from("videos")
        .update(patch as never)
        .eq("id", Number(id))
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const row = Array.isArray(data) ? data[0] : null;
    if (!row) return NextResponse.json({ error: "Video not found." }, { status: 404 });
    return NextResponse.json(row);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    if (!await requireAuth()) return unauthorized();

    const { id } = await params;
    const { error } = await supabaseAdmin()
        .from("videos")
        .delete()
        .eq("id", Number(id));

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return new NextResponse(null, { status: 204 });
}
