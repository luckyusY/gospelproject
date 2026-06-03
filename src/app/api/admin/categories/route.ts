import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { CategoryInsert } from "@/types/database";

function unauthorized() {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
}

async function requireAuth() {
    return Boolean(await getCurrentAdmin());
}

function slugify(val: string) {
    return val.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export async function POST(req: NextRequest) {
    if (!await requireAuth()) return unauthorized();

    const raw = await req.json() as Partial<CategoryInsert>;
    const name = (raw.name ?? "").trim();
    const slug = slugify(raw.slug || name);
    const color = (raw.color ?? "").trim() || "#1E40AF";

    if (!name || !slug) {
        return NextResponse.json({ error: "Enter a category name." }, { status: 400 });
    }

    const insert: Record<string, unknown> = { name, slug, color };
    if (typeof raw.nav_group === "string" && raw.nav_group.trim()) insert.nav_group = raw.nav_group.trim();
    if (typeof raw.icon === "string" && raw.icon.trim()) insert.icon = raw.icon.trim();
    if (typeof raw.description === "string" && raw.description.trim()) insert.description = raw.description.trim();
    if (typeof raw.hero_image === "string" && raw.hero_image.trim()) insert.hero_image = raw.hero_image.trim();
    if (raw.sort_order !== undefined) insert.sort_order = Number(raw.sort_order) || 0;
    if (typeof raw.show_in_nav === "boolean") insert.show_in_nav = raw.show_in_nav;

    const { data, error } = await supabaseAdmin()
        .from("categories")
        .insert(insert as never)
        .select();

    if (error) {
        const message = error.code === "23505"
            ? "This category already exists (duplicate slug)."
            : error.message;
        return NextResponse.json({ error: message }, { status: 400 });
    }

    const row = Array.isArray(data) ? data[0] : null;
    if (!row) {
        return NextResponse.json(
            { error: "Couldn't save the category. Check that SUPABASE_SERVICE_ROLE_KEY is set correctly." },
            { status: 500 },
        );
    }
    return NextResponse.json(row, { status: 201 });
}
