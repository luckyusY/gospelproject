import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMeta, absoluteUrl } from "@/lib/metadata";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/ui/PageHeader";
import ShareButtons from "@/components/ShareButtons";
import type { ContestEntryRow, ContestRow } from "@/types/database";
import VoteClient from "../_components/VoteClient";
import styles from "../amatora.module.css";

export const revalidate = 15;

type Params = { params: Promise<{ slug: string }> };

async function getContest(slug: string) {
    const { data } = await supabase
        .from("contests")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
    return (data as ContestRow | null) ?? null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const contest = await getContest(slug);
    if (!contest) return buildMeta({ title: "Amatora", description: "Amarushanwa ya Urugero Media.", path: "/amatora" });
    return buildMeta({
        title: contest.title,
        description: contest.description || "Tora uwo ukunda mu marushanwa ya Urugero Media.",
        path: `/amatora/${contest.slug}`,
        image: contest.image_url ?? undefined,
    });
}

export default async function ContestPage({ params }: Params) {
    const { slug } = await params;
    const contest = await getContest(slug);
    if (!contest) notFound();

    const { data: entriesData } = await supabase
        .from("contest_entries")
        .select("*")
        .eq("contest_id", contest.id)
        .order("sort_order", { ascending: true });
    const entries = (entriesData ?? []) as ContestEntryRow[];

    // Stable within a single render.
    // eslint-disable-next-line react-hooks/purity
    const ended = Boolean(contest.ends_at && new Date(contest.ends_at).getTime() < Date.now());
    const votingOpen = contest.is_active && !ended;

    return (
        <div className={styles.page}>
            <PageHeader
                title={contest.title}
                description={contest.description || undefined}
                backgroundImage={contest.image_url ?? undefined}
                breadcrumb={[{ label: "Amatora", href: "/amatora" }, { label: contest.title }]}
            />

            <div className="container">
                <VoteClient
                    contestId={contest.id}
                    entries={entries.map(e => ({
                        id: e.id,
                        name: e.name,
                        subtitle: e.subtitle,
                        image_url: e.image_url,
                        youtube_id: e.youtube_id,
                        vote_count: e.vote_count,
                    }))}
                    showResults={contest.show_results}
                    votingOpen={votingOpen}
                    ended={ended}
                />

                <ShareButtons url={absoluteUrl(`/amatora/${contest.slug}`)} title={contest.title} />
            </div>
        </div>
    );
}
