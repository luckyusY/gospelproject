import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import {
    settingsWithDefaults,
    settingDefinitionFor,
} from "@/lib/siteSettings";
import type { SiteSettingRow } from "@/types/database";

async function requireAuth() {
    return Boolean(await getCurrentAdmin());
}

/** GET /api/admin/settings — return all settings rows */
export async function GET() {
    if (!await requireAuth()) {
        return NextResponse.json({ error: "Not authorized." }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin()
        .from("site_settings")
        .select("key, value, label, description")
        .order("key");

    if (error) {
        console.error("[Admin settings GET]", error);
        return NextResponse.json({
            settings: settingsWithDefaults([]),
            warning: `Supabase settings table issue: ${error.message}`,
        });
    }

    return NextResponse.json(settingsWithDefaults((data ?? []) as SiteSettingRow[]));
}

/** PUT /api/admin/settings — upsert one or more { key, value } pairs */
export async function PUT(req: NextRequest) {
    if (!await requireAuth()) {
        return NextResponse.json({ error: "Not authorized." }, { status: 401 });
    }

    const body = await req.json() as Record<string, string>;

    const rows = Object.entries(body).map(([key, value]) => {
        const definition = settingDefinitionFor(key);
        return {
            key,
            value,
            label: definition?.label ?? key,
            description: definition?.description ?? null,
        };
    });
    if (rows.length === 0) {
        return NextResponse.json({ error: "No data was sent." }, { status: 400 });
    }

    const { error } = await supabaseAdmin()
        .from("site_settings")
        .upsert(rows, { onConflict: "key" });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
}
