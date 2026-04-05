import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import type { ArticleInsert } from "@/types/database";

async function requireAuth() {
    const cookieStore = await cookies();
    return cookieStore.get("admin_auth")?.value === "1";
}

function unauthorized() {
    return NextResponse.json({ error: "Ntabwo wemerewe." }, { status: 401 });
}

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
    if (!await requireAuth()) return unauthorized();

    const { id } = await params;
    const body = await req.json() as Partial<ArticleInsert>;

    const { data, error } = await supabaseAdmin()
        .from("articles")
        .update(body as never)
        .eq("id", Number(id))
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    if (!await requireAuth()) return unauthorized();

    const { id } = await params;
    const { error } = await supabaseAdmin()
        .from("articles")
        .delete()
        .eq("id", Number(id));

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return new NextResponse(null, { status: 204 });
}
