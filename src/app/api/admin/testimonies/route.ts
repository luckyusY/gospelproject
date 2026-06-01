import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { TestimonyInsert } from "@/types/database";

function unauthorized() {
    return NextResponse.json({ error: "Ntabwo wemerewe." }, { status: 401 });
}

async function requireAuth() {
    return Boolean(await getCurrentAdmin());
}

export async function POST(req: NextRequest) {
    if (!await requireAuth()) return unauthorized();

    const body = await req.json() as TestimonyInsert;
    const { data, error } = await supabaseAdmin()
        .from("testimonies")
        .insert(body as never)
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const row = Array.isArray(data) ? data[0] : null;
    if (!row) {
        return NextResponse.json(
            { error: "Ntibishobotse kubika ubuhamya. Reba niba SUPABASE_SERVICE_ROLE_KEY ishyizweho neza." },
            { status: 500 },
        );
    }
    return NextResponse.json(row, { status: 201 });
}
