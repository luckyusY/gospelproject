import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { ContestInsert } from "@/types/database";

function unauthorized() {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
}

async function requireAuth() {
    return Boolean(await getCurrentAdmin());
}

export async function POST(req: NextRequest) {
    if (!await requireAuth()) return unauthorized();

    const body = await req.json() as Partial<ContestInsert>;
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const slug  = typeof body.slug === "string" ? body.slug.trim() : "";
    if (!title || !slug) {
        return NextResponse.json({ error: "Enter a contest title." }, { status: 400 });
    }

    const insert: ContestInsert = {
        title,
        slug,
        description:  typeof body.description === "string" ? body.description.trim() : "",
        image_url:    typeof body.image_url === "string" && body.image_url.trim() ? body.image_url.trim() : null,
        is_active:    body.is_active !== false,
        show_results: body.show_results !== false,
        ends_at:      typeof body.ends_at === "string" && body.ends_at.trim() ? body.ends_at : null,
    };

    const { data, error } = await supabaseAdmin()
        .from("contests")
        .insert(insert as never)
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const row = Array.isArray(data) ? data[0] : null;
    if (!row) {
        return NextResponse.json(
            { error: "Couldn't save the contest. Check that SUPABASE_SERVICE_ROLE_KEY is set correctly." },
            { status: 500 },
        );
    }
    return NextResponse.json(row, { status: 201 });
}
