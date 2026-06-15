import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { ContestInsert } from "@/types/database";

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

    const patch: Partial<ContestInsert> & { updated_at: string } = { updated_at: new Date().toISOString() };
    if (typeof raw.title === "string") patch.title = raw.title.trim();
    if (typeof raw.slug === "string") patch.slug = raw.slug.trim();
    if (typeof raw.description === "string") patch.description = raw.description.trim();
    if (raw.image_url !== undefined) {
        patch.image_url = typeof raw.image_url === "string" && raw.image_url.trim() ? raw.image_url.trim() : null;
    }
    if (typeof raw.is_active === "boolean") patch.is_active = raw.is_active;
    if (typeof raw.show_results === "boolean") patch.show_results = raw.show_results;
    if (raw.ends_at !== undefined) {
        patch.ends_at = typeof raw.ends_at === "string" && raw.ends_at.trim() ? raw.ends_at : null;
    }

    const { data, error } = await supabaseAdmin()
        .from("contests")
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
        .from("contests")
        .delete()
        .eq("id", Number(id));

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return new NextResponse(null, { status: 204 });
}
