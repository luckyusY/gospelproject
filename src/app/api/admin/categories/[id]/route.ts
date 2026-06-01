import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { CategoryInsert } from "@/types/database";

async function requireAuth() {
    return Boolean(await getCurrentAdmin());
}

function unauthorized() {
    return NextResponse.json({ error: "Ntabwo wemerewe." }, { status: 401 });
}

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
    if (!await requireAuth()) return unauthorized();

    const { id } = await params;
    const raw = await req.json() as Partial<CategoryInsert>;

    // Only name + color are editable; slug is referenced by articles (FK).
    const patch: Record<string, string> = {};
    if (typeof raw.name === "string" && raw.name.trim()) patch.name = raw.name.trim();
    if (typeof raw.color === "string" && raw.color.trim()) patch.color = raw.color.trim();

    if (Object.keys(patch).length === 0) {
        return NextResponse.json({ error: "Nta mpinduka zatanzwe." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin()
        .from("categories")
        .update(patch as never)
        .eq("id", Number(id))
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const row = Array.isArray(data) ? data[0] : null;
    if (!row) {
        return NextResponse.json(
            { error: "Ntibishobotse kubika impinduka. Reba niba SUPABASE_SERVICE_ROLE_KEY ishyizweho neza." },
            { status: 500 },
        );
    }
    return NextResponse.json(row);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    if (!await requireAuth()) return unauthorized();

    const { id } = await params;
    const { error } = await supabaseAdmin()
        .from("categories")
        .delete()
        .eq("id", Number(id));

    if (error) {
        const message = error.code === "23503"
            ? "Iki cyiciro gikoreshwa n'inyandiko, ntigishobora gusibwa."
            : error.message;
        return NextResponse.json({ error: message }, { status: 400 });
    }
    return new NextResponse(null, { status: 204 });
}
