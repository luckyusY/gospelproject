import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { CategoryInsert } from "@/types/database";

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
    const raw = await req.json() as Partial<CategoryInsert>;

    // Slug is referenced by articles (FK), so it stays fixed; everything else is editable.
    const patch: Record<string, unknown> = {};
    if (typeof raw.name === "string" && raw.name.trim()) patch.name = raw.name.trim();
    if (typeof raw.color === "string" && raw.color.trim()) patch.color = raw.color.trim();
    if (typeof raw.icon === "string") patch.icon = raw.icon.trim() || null;
    if (typeof raw.description === "string") patch.description = raw.description.trim() || null;
    if (typeof raw.hero_image === "string") patch.hero_image = raw.hero_image.trim() || null;
    if (raw.nav_group !== undefined) {
        const g = typeof raw.nav_group === "string" ? raw.nav_group.trim() : "";
        patch.nav_group = g || null;
    }
    if (raw.sort_order !== undefined) patch.sort_order = Number(raw.sort_order) || 0;
    if (typeof raw.show_in_nav === "boolean") patch.show_in_nav = raw.show_in_nav;

    if (Object.keys(patch).length === 0) {
        return NextResponse.json({ error: "No changes were provided." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin()
        .from("categories")
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
        .from("categories")
        .delete()
        .eq("id", Number(id));

    if (error) {
        const message = error.code === "23503"
            ? "This category is in use by articles and can't be deleted."
            : error.message;
        return NextResponse.json({ error: message }, { status: 400 });
    }
    return new NextResponse(null, { status: 204 });
}
