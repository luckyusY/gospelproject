import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

async function requireAuth() {
    return Boolean(await getCurrentAdmin());
}

function unauthorized() {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
}

/** GET /api/admin/homepage-sections — list sections in order */
export async function GET() {
    if (!await requireAuth()) return unauthorized();

    const { data, error } = await supabaseAdmin()
        .from("homepage_sections")
        .select("*")
        .order("sort_order", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? []);
}

/**
 * PUT /api/admin/homepage-sections — bulk update toggles + order.
 * Body: { sections: { id, is_enabled, sort_order }[] }
 */
export async function PUT(req: NextRequest) {
    if (!await requireAuth()) return unauthorized();

    const body = await req.json() as {
        sections?: { id: number; is_enabled?: boolean; sort_order?: number }[];
    };
    const sections = body.sections ?? [];
    if (sections.length === 0) {
        return NextResponse.json({ error: "No sections were sent." }, { status: 400 });
    }

    const admin = supabaseAdmin();
    for (const section of sections) {
        const patch: Record<string, unknown> = {};
        if (typeof section.is_enabled === "boolean") patch.is_enabled = section.is_enabled;
        if (section.sort_order !== undefined) patch.sort_order = Number(section.sort_order) || 0;
        if (Object.keys(patch).length === 0) continue;

        const { error } = await admin
            .from("homepage_sections")
            .update(patch as never)
            .eq("id", Number(section.id));

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
}
