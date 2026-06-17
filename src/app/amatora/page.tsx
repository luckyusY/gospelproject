import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildMeta, absoluteUrl } from "@/lib/metadata";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/ui/PageHeader";
import ShareIconButton from "@/components/ShareIconButton";
import type { ContestEntryRow, ContestRow } from "@/types/database";
import styles from "./amatora.module.css";

export const metadata: Metadata = buildMeta({
    title: "Amatora",
    description: "Tora uwo ukunda mu marushanwa ya Urugero Media.",
    path: "/amatora",
});

export const revalidate = 30;

export default async function AmatoraPage() {
    const [contestsResult, entriesResult] = await Promise.all([
        supabase
            .from("contests")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false }),
        supabase.from("contest_entries").select("contest_id, vote_count"),
    ]);

    const contests = (contestsResult.data ?? []) as ContestRow[];
    const entries = (entriesResult.data ?? []) as Pick<ContestEntryRow, "contest_id" | "vote_count">[];

    const totalsByContest = new Map<number, number>();
    for (const entry of entries) {
        totalsByContest.set(entry.contest_id, (totalsByContest.get(entry.contest_id) ?? 0) + entry.vote_count);
    }

    // Stable within a single render.
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();

    return (
        <div className={styles.page}>
            <PageHeader
                title="Amatora"
                description="Tora uwo ukunda mu marushanwa ya Urugero Media."
                breadcrumb={[{ label: "Amatora" }]}
            />

            <div className="container">
                {contests.length === 0 ? (
                    <p className={styles.empty}>Nta marushanwa ahari ubu. Subira vuba!</p>
                ) : (
                    <div className={styles.grid}>
                        {contests.map(contest => {
                            const ended = Boolean(contest.ends_at && new Date(contest.ends_at).getTime() < now);
                            const total = totalsByContest.get(contest.id) ?? 0;
                            return (
                                <article key={contest.id} className={styles.contestCard}>
                                    <Link href={`/amatora/${contest.slug}`} className={styles.contestCardMain}>
                                        <div className={styles.contestImgWrap}>
                                            {contest.image_url ? (
                                                <Image src={contest.image_url} alt={contest.title} fill className={styles.contestImg} />
                                            ) : (
                                                <div className={styles.imgPlaceholder}>🗳️</div>
                                            )}
                                        </div>
                                        <div className={styles.contestBody}>
                                            <h2 className={styles.contestTitle}>{contest.title}</h2>
                                            {contest.description && <p className={styles.contestDesc}>{contest.description}</p>}
                                            <div className={styles.statusRow}>
                                                <span className={ended ? styles.badgeClosed : styles.badgeOpen}>
                                                    {ended ? "Yarafunze" : "Iri gukomeza"}
                                                </span>
                                                <span className={styles.voteTotal}>{total} amajwi</span>
                                            </div>
                                        </div>
                                    </Link>
                                    <ShareIconButton
                                        url={absoluteUrl(`/amatora/${contest.slug}`)}
                                        title={contest.title}
                                        className={styles.cardShare}
                                    />
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
