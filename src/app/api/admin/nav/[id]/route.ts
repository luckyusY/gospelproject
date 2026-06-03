import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { NavItemInsert } from "@/types/database";

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
    const raw = await req.json() as Partial<NavItemInsert>;

    const patch: Record<string, unknown> = {};
    if (typeof raw.label === "string" && raw.label.trim()) patch.label = raw.label.trim();
    if (typeof raw.href === "string") patch.href = raw.href.trim();
    if (raw.parent_id !== undefined) patch.parent_id = raw.parent_id ? Number(raw.parent_id) : null;
    if (raw.sort_order !== undefined) patch.sort_order = Number(raw.sort_order) || 0;
    if (typeof raw.is_mega === "boolean") patch.is_mega = raw.is_mega;
    if (typeof raw.is_visible === "boolean") patch.is_visible = raw.is_visible;

    if (Object.keys(patch).length === 0) {
        return NextResponse.json({ error: "No changes were provided." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin()
        .from("nav_items")
        .update(patch as never)
        .eq("id", Number(id))
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const row = Array.isArray(data) ? data[0] : null;
    if (!row) return NextResponse.json({ error: "Menu item not found." }, { status: 404 });
    return NextResponse.json(row);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    if (!await requireAuth()) return unauthorized();

    const { id } = await params;
    const { error } = await supabaseAdmin()
        .from("nav_items")
        .delete()
        .eq("id", Number(id));

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return new NextResponse(null, { status: 204 });
}
