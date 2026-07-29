import { NextRequest, NextResponse } from "next/server";
import { canManageArticleAuthor, getCurrentAdmin, isFullAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import { sanitizeArticleContent } from "@/lib/articleContent";
import { sanitizeSlug } from "@/lib/slug";
import type { ArticleInsert } from "@/types/database";

function unauthorized() {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
}

function forbidden() {
    return NextResponse.json({ error: "You can only manage your own stories." }, { status: 403 });
}

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
    const adminUser = await getCurrentAdmin();
    if (!adminUser) return unauthorized();

    const { id } = await params;
    const body = await req.json() as Partial<ArticleInsert>;
    const db = supabaseAdmin();
    const { data: existing } = await db
        .from("articles")
        .select("id, author")
        .eq("id", Number(id))
        .maybeSingle();

    if (!existing) {
        return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }
    if (!canManageArticleAuthor(adminUser, (existing as { author?: string | null }).author)) {
        return forbidden();
    }

    if (typeof body.slug === "string") {
        body.slug = sanitizeSlug(body.slug);
    }
    if (typeof body.content === "string") {
        body.content = sanitizeArticleContent(body.content);
    }

    if (!isFullAdmin(adminUser)) {
        delete body.author;
        delete body.is_featured;
        if (body.is_published) {
            body.published_at = body.published_at ?? new Date().toISOString();
        } else if (body.is_published === false) {
            body.published_at = null;
        }
    }

    const { data, error } = await supabaseAdmin()
        .from("articles")
        .update(body as never)
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
    const adminUser = await getCurrentAdmin();
    if (!adminUser) return unauthorized();

    const { id } = await params;
    const db = supabaseAdmin();
    const { data: existing } = await db
        .from("articles")
        .select("id, author")
        .eq("id", Number(id))
        .maybeSingle();

    if (!existing) {
        return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }
    if (!canManageArticleAuthor(adminUser, (existing as { author?: string | null }).author)) {
        return forbidden();
    }

    const { error } = await supabaseAdmin()
        .from("articles")
        .delete()
        .eq("id", Number(id));

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return new NextResponse(null, { status: 204 });
}
