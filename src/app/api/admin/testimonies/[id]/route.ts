import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { TestimonyInsert } from "@/types/database";

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
    const body = await req.json() as Partial<TestimonyInsert>;

    const { data, error } = await supabaseAdmin()
        .from("testimonies")
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
    if (!await requireAuth()) return unauthorized();

    const { id } = await params;
    const { error } = await supabaseAdmin()
        .from("testimonies")
        .delete()
        .eq("id", Number(id));

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return new NextResponse(null, { status: 204 });
}
