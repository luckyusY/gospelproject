import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import { sanitizeArticleContent } from "@/lib/articleContent";
import type { ArticleInsert } from "@/types/database";

function unauthorized() {
    return NextResponse.json({ error: "Ntabwo wemerewe." }, { status: 401 });
}

async function requireAuth() {
    return Boolean(await getCurrentAdmin());
}

export async function POST(req: NextRequest) {
    if (!await requireAuth()) return unauthorized();

    const rawBody = await req.json() as ArticleInsert;
    const body = {
        ...rawBody,
        content: sanitizeArticleContent(rawBody.content),
    };
    const { data, error } = await supabaseAdmin()
        .from("articles")
        .insert(body as never)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
}
