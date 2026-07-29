import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

type Params = { params: Promise<{ id: string }> };

async function requireAuth() {
    return Boolean(await getCurrentAdmin());
}

function unauthorized() {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
}

export async function PUT(req: NextRequest, { params }: Params) {
    if (!await requireAuth()) return unauthorized();

    const { id } = await params;
    const body = await req.json().catch(() => ({})) as { is_approved?: boolean };
    const commentId = Number(id);

    if (!Number.isInteger(commentId) || commentId <= 0) {
        return NextResponse.json({ error: "Invalid comment id." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin()
        .from("article_comments")
        .update({
            is_approved: Boolean(body.is_approved),
            updated_at: new Date().toISOString(),
        } as never)
        .eq("id", commentId)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    if (!await requireAuth()) return unauthorized();

    const { id } = await params;
    const commentId = Number(id);

    if (!Number.isInteger(commentId) || commentId <= 0) {
        return NextResponse.json({ error: "Invalid comment id." }, { status: 400 });
    }

    const { error } = await supabaseAdmin()
        .from("article_comments")
        .delete()
        .eq("id", commentId);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return new NextResponse(null, { status: 204 });
}
