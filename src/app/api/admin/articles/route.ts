import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin, isFullAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import { sanitizeArticleContent } from "@/lib/articleContent";
import { sanitizeSlug } from "@/lib/slug";
import type { ArticleInsert } from "@/types/database";

function unauthorized() {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
}

export async function POST(req: NextRequest) {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorized();

    const rawBody = await req.json() as ArticleInsert;
    const body = {
        ...rawBody,
        slug: sanitizeSlug(rawBody.slug || rawBody.title || "") || `story-${Date.now()}`,
        content: sanitizeArticleContent(rawBody.content),
        author: isFullAdmin(admin) ? rawBody.author : admin.displayName,
        is_published: rawBody.is_published,
        is_featured: isFullAdmin(admin) ? rawBody.is_featured : false,
        published_at: rawBody.is_published ? (rawBody.published_at ?? new Date().toISOString()) : null,
    };
    const { data, error } = await supabaseAdmin()
        .from("articles")
        .insert(body as never)
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const row = Array.isArray(data) ? data[0] : null;
    if (!row) {
        return NextResponse.json(
            { error: "Couldn't save the article. Check that SUPABASE_SERVICE_ROLE_KEY is set correctly." },
            { status: 500 },
        );
    }
    return NextResponse.json(row, { status: 201 });
}
