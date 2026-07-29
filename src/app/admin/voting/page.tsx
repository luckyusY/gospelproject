import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import type { ContestEntryRow, ContestRow } from "@/types/database";
import VotingManager from "./_components/VotingManager";

export const metadata: Metadata = { title: "Voting" };

export default async function AdminVotingPage() {
    const admin = supabaseAdmin();
    const [contestsResult, entriesResult] = await Promise.all([
        admin.from("contests").select("*").order("created_at", { ascending: false }),
        admin.from("contest_entries").select("*").order("sort_order", { ascending: true }),
    ]);

    const contests = (contestsResult.data ?? []) as ContestRow[];
    const entries = (entriesResult.data ?? []) as ContestEntryRow[];
    const tableMissing = Boolean(contestsResult.error);

    return <VotingManager contests={contests} entries={entries} tableMissing={tableMissing} />;
}
