import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { NavItemInsert } from "@/types/database";

async function requireAuth() {
    return Boolean(await getCurrentAdmin());
}

function unauthorized() {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
}

/** GET /api/admin/nav — list all menu items */
export async function GET() {
    if (!await requireAuth()) return unauthorized();

    const { data, error } = await supabaseAdmin()
        .from("nav_items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? []);
}

/** POST /api/admin/nav — create a menu item */
export async function POST(req: NextRequest) {
    if (!await requireAuth()) return unauthorized();

    const raw = await req.json() as Partial<NavItemInsert>;
    const label = (raw.label ?? "").trim();
    if (!label) {
        return NextResponse.json({ error: "Enter a menu label." }, { status: 400 });
    }

    const insert: NavItemInsert = {
        label,
        href: (raw.href ?? "").trim(),
        parent_id: raw.parent_id ? Number(raw.parent_id) : null,
        sort_order: Number(raw.sort_order ?? 0) || 0,
        is_mega: raw.is_mega ?? false,
        is_visible: raw.is_visible ?? true,
    };

    const { data, error } = await supabaseAdmin()
        .from("nav_items")
        .insert(insert as never)
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const row = Array.isArray(data) ? data[0] : null;
    if (!row) {
        return NextResponse.json(
            { error: "Couldn't save the menu item. Check that SUPABASE_SERVICE_ROLE_KEY is set correctly." },
            { status: 500 },
        );
    }
    return NextResponse.json(row, { status: 201 });
}
