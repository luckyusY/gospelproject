import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import { sanitizeArticleContent } from "@/lib/articleContent";
import type { PageInsert } from "@/types/database";

async function requireAuth() {
    return Boolean(await getCurrentAdmin());
}

function unauthorized() {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
}

function slugify(val: string) {
    return val.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
    if (!await requireAuth()) return unauthorized();

    const { id } = await params;
    const raw = await req.json() as Partial<PageInsert>;

    const patch: Record<string, unknown> = {};
    if (typeof raw.title === "string" && raw.title.trim()) patch.title = raw.title.trim();
    if (typeof raw.slug === "string" && raw.slug.trim()) patch.slug = slugify(raw.slug);
    if (typeof raw.subtitle === "string") patch.subtitle = raw.subtitle.trim();
    if (typeof raw.hero_image === "string") patch.hero_image = raw.hero_image.trim() || null;
    if (typeof raw.icon === "string") patch.icon = raw.icon.trim() || null;
    if (typeof raw.color === "string" && raw.color.trim()) patch.color = raw.color.trim();
    if (typeof raw.content === "string") patch.content = sanitizeArticleContent(raw.content);
    if (raw.nav_group !== undefined) {
        const g = typeof raw.nav_group === "string" ? raw.nav_group.trim() : "";
        patch.nav_group = g || null;
    }
    if (typeof raw.is_published === "boolean") patch.is_published = raw.is_published;
    if (raw.sort_order !== undefined) patch.sort_order = Number(raw.sort_order) || 0;

    if (Object.keys(patch).length === 0) {
        return NextResponse.json({ error: "No changes were provided." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin()
        .from("pages")
        .update(patch as never)
        .eq("id", Number(id))
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const row = Array.isArray(data) ? data[0] : null;
    if (!row) return NextResponse.json({ error: "Page not found." }, { status: 404 });
    return NextResponse.json(row);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    if (!await requireAuth()) return unauthorized();

    const { id } = await params;
    const { error } = await supabaseAdmin()
        .from("pages")
        .delete()
        .eq("id", Number(id));

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return new NextResponse(null, { status: 204 });
}
