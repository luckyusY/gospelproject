import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { ContestEntryRow, ContestRow } from "@/types/database";

type VotePayload = {
    contestId?: number | string;
    entryId?: number | string;
};

// Pulls the "Bearer <token>" access token from the Authorization header.
function getBearerToken(req: NextRequest) {
    const header = req.headers.get("authorization") ?? "";
    const match = header.match(/^Bearer\s+(.+)$/i);
    return match?.[1]?.trim() ?? "";
}

function getClientIp(req: NextRequest) {
    const forwardedFor = req.headers.get("x-forwarded-for");
    return req.headers.get("cf-connecting-ip")
        ?? forwardedFor?.split(",")[0]?.trim()
        ?? req.headers.get("x-real-ip")
        ?? "";
}

function hashIp(ip: string) {
    if (!ip) return null;
    const salt = process.env.ANALYTICS_IP_SALT
        ?? process.env.NEXTAUTH_SECRET
        ?? process.env.ADMIN_PASSWORD
        ?? "urugero-media";
    return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

// Returns the current entries (id + counts) for a contest, ordered for display.
async function entryCounts(admin: ReturnType<typeof supabaseAdmin>, contestId: number) {
    const { data } = await admin
        .from("contest_entries")
        .select("id, vote_count")
        .eq("contest_id", contestId)
        .order("sort_order", { ascending: true });
    return ((data ?? []) as Pick<ContestEntryRow, "id" | "vote_count">[]);
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({})) as VotePayload;
    const contestId = Number(body.contestId);
    const entryId = Number(body.entryId);

    if (!contestId || !entryId) {
        return NextResponse.json({ error: "Invalid vote." }, { status: 400 });
    }

    const admin = supabaseAdmin();

    // Identify the voter from their Google sign-in token. The voter id is the
    // verified Supabase user id — the browser can't fake it, so one Google
    // account = one vote per contest.
    const token = getBearerToken(req);
    if (!token) {
        return NextResponse.json({ error: "Injira na Google kugira ngo utore." }, { status: 401 });
    }
    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData?.user) {
        return NextResponse.json({ error: "Injira yawe yarangiye. Ongera winjire." }, { status: 401 });
    }
    const voterId = userData.user.id;

    // Confirm the contest is open and the entry belongs to it.
    const { data: contestData } = await admin
        .from("contests")
        .select("id, is_active, ends_at")
        .eq("id", contestId)
        .maybeSingle();
    const contest = contestData as Pick<ContestRow, "id" | "is_active" | "ends_at"> | null;

    if (!contest || !contest.is_active) {
        return NextResponse.json({ error: "Amatora arafunze." }, { status: 403 });
    }
    if (contest.ends_at && new Date(contest.ends_at).getTime() < Date.now()) {
        return NextResponse.json({ error: "Igihe cyo gutora cyararangiye." }, { status: 403 });
    }

    const { data: entryData } = await admin
        .from("contest_entries")
        .select("id")
        .eq("id", entryId)
        .eq("contest_id", contestId)
        .maybeSingle();
    if (!entryData) {
        return NextResponse.json({ error: "Invalid entry." }, { status: 400 });
    }

    const { data: result, error } = await admin.rpc("cast_contest_vote", {
        p_contest_id: contestId,
        p_entry_id: entryId,
        p_voter_id: voterId,
        p_ip_hash: hashIp(getClientIp(req)),
    });

    if (error) {
        console.error("[vote]", error);
        return NextResponse.json({ error: "Kwemeza itora byanze. Ongera ugerageze." }, { status: 500 });
    }

    const counts = await entryCounts(admin, contestId);

    if (result === "already_voted") {
        return NextResponse.json({ ok: false, alreadyVoted: true, counts }, { status: 200 });
    }

    return NextResponse.json({ ok: true, counts });
}
