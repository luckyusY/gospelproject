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

/** GET /api/admin/pages — list all pages */
export async function GET() {
    if (!await requireAuth()) return unauthorized();

    const { data, error } = await supabaseAdmin()
        .from("pages")
        .select("*")
        .order("nav_group", { ascending: true })
        .order("sort_order", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? []);
}

/** POST /api/admin/pages — create a page */
export async function POST(req: NextRequest) {
    if (!await requireAuth()) return unauthorized();

    const raw = await req.json() as Partial<PageInsert>;
    const title = (raw.title ?? "").trim();
    const slug = slugify(raw.slug || title);

    if (!title || !slug) {
        return NextResponse.json({ error: "Enter a page title." }, { status: 400 });
    }

    const insert: PageInsert = {
        slug,
        title,
        subtitle: (raw.subtitle ?? "").trim(),
        hero_image: (raw.hero_image ?? "").trim() || null,
        icon: (raw.icon ?? "").trim() || null,
        color: (raw.color ?? "").trim() || "#B80000",
        content: sanitizeArticleContent(raw.content ?? ""),
        nav_group: (raw.nav_group ?? "").trim() || null,
        is_published: raw.is_published ?? true,
        sort_order: Number(raw.sort_order ?? 0) || 0,
    };

    const { data, error } = await supabaseAdmin()
        .from("pages")
        .insert(insert as never)
        .select();

    if (error) {
        const message = error.code === "23505"
            ? "A page with this slug already exists."
            : error.message;
        return NextResponse.json({ error: message }, { status: 400 });
    }

    const row = Array.isArray(data) ? data[0] : null;
    if (!row) {
        return NextResponse.json(
            { error: "Couldn't save the page. Check that SUPABASE_SERVICE_ROLE_KEY is set correctly." },
            { status: 500 },
        );
    }
    return NextResponse.json(row, { status: 201 });
}
