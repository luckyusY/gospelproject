import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

async function requireAuth() {
    return Boolean(await getCurrentAdmin());
}

type Params = { params: Promise<{ id: string }> };

// Clears every vote for a contest and zeroes the cached counts.
export async function POST(_req: NextRequest, { params }: Params) {
    if (!await requireAuth()) {
        return NextResponse.json({ error: "Not authorized." }, { status: 401 });
    }

    const { id } = await params;
    const contestId = Number(id);
    const admin = supabaseAdmin();

    const deleteResult = await admin.from("contest_votes").delete().eq("contest_id", contestId);
    if (deleteResult.error) {
        return NextResponse.json({ error: deleteResult.error.message }, { status: 400 });
    }

    const updateResult = await admin
        .from("contest_entries")
        .update({ vote_count: 0 } as never)
        .eq("contest_id", contestId);
    if (updateResult.error) {
        return NextResponse.json({ error: updateResult.error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
}
