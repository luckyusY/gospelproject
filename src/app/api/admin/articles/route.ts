import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import type { ArticleInsert } from "@/types/database";

function unauthorized() {
    return NextResponse.json({ error: "Ntabwo wemerewe." }, { status: 401 });
}

async function requireAuth() {
    const cookieStore = await cookies();
    return cookieStore.get("admin_auth")?.value === "1";
}

export async function POST(req: NextRequest) {
    if (!await requireAuth()) return unauthorized();

    const body = await req.json() as ArticleInsert;
    const { data, error } = await supabaseAdmin()
        .from("articles")
        .insert(body as never)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
}
