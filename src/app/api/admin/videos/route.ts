import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { VideoInsert } from "@/types/database";

async function requireAuth() {
    return Boolean(await getCurrentAdmin());
}

function unauthorized() {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
}

/** Accept a raw YouTube ID or any common YouTube URL and return the 11-char ID. */
export function parseYoutubeId(input: string): string {
    const value = input.trim();
    if (/^[\w-]{11}$/.test(value)) return value;
    const patterns = [
        /[?&]v=([\w-]{11})/,
        /youtu\.be\/([\w-]{11})/,
        /youtube\.com\/(?:embed|shorts|live)\/([\w-]{11})/,
    ];
    for (const re of patterns) {
        const m = value.match(re);
        if (m && m[1]) return m[1];
    }
    return value;
}

/** GET /api/admin/videos — list all videos */
export async function GET() {
    if (!await requireAuth()) return unauthorized();

    const { data, error } = await supabaseAdmin()
        .from("videos")
        .select("*")
        .order("section", { ascending: true })
        .order("sort_order", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? []);
}

/** POST /api/admin/videos — create a video */
export async function POST(req: NextRequest) {
    if (!await requireAuth()) return unauthorized();

    const raw = await req.json() as Partial<VideoInsert>;
    const title = (raw.title ?? "").trim();
    const youtube_id = parseYoutubeId(raw.youtube_id ?? "");
    const section = (raw.section ?? "homepage").trim() || "homepage";

    if (!title || !youtube_id) {
        return NextResponse.json({ error: "Title and a YouTube link/ID are required." }, { status: 400 });
    }

    const insert: VideoInsert = {
        title,
        description: (raw.description ?? "").trim(),
        youtube_id,
        section,
        sort_order: Number(raw.sort_order ?? 0) || 0,
        is_published: raw.is_published ?? true,
    };

    const { data, error } = await supabaseAdmin()
        .from("videos")
        .insert(insert as never)
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const row = Array.isArray(data) ? data[0] : null;
    if (!row) {
        return NextResponse.json(
            { error: "Couldn't save the video. Check that SUPABASE_SERVICE_ROLE_KEY is set correctly." },
            { status: 500 },
        );
    }
    return NextResponse.json(row, { status: 201 });
}
