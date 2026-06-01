import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { CategoryInsert } from "@/types/database";

function unauthorized() {
    return NextResponse.json({ error: "Ntabwo wemerewe." }, { status: 401 });
}

async function requireAuth() {
    return Boolean(await getCurrentAdmin());
}

function slugify(val: string) {
    return val.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export async function POST(req: NextRequest) {
    if (!await requireAuth()) return unauthorized();

    const raw = await req.json() as Partial<CategoryInsert>;
    const name = (raw.name ?? "").trim();
    const slug = slugify(raw.slug || name);
    const color = (raw.color ?? "").trim() || "#1E40AF";

    if (!name || !slug) {
        return NextResponse.json({ error: "Andika izina ry'icyiciro." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin()
        .from("categories")
        .insert({ name, slug, color } as never)
        .select();

    if (error) {
        const message = error.code === "23505"
            ? "Iki cyiciro gisanzwe gihari (slug isa)."
            : error.message;
        return NextResponse.json({ error: message }, { status: 400 });
    }

    const row = Array.isArray(data) ? data[0] : null;
    if (!row) {
        return NextResponse.json(
            { error: "Ntibishobotse kubika icyiciro. Reba niba SUPABASE_SERVICE_ROLE_KEY ishyizweho neza." },
            { status: 500 },
        );
    }
    return NextResponse.json(row, { status: 201 });
}
