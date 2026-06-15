"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../amatora.module.css";

export type VoteEntry = {
    id: number;
    name: string;
    subtitle: string;
    image_url: string | null;
    youtube_id: string | null;
    vote_count: number;
};

type Props = {
    contestId: number;
    entries: VoteEntry[];
    showResults: boolean;
    votingOpen: boolean;
    ended: boolean;
};

const VOTER_KEY = "urugero_voter_id";

function getVoterId() {
    try {
        let id = localStorage.getItem(VOTER_KEY);
        if (!id) {
            id = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
            localStorage.setItem(VOTER_KEY, id);
        }
        return id;
    } catch {
        return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
}

export default function VoteClient({ contestId, entries, showResults, votingOpen, ended }: Props) {
    const [counts, setCounts] = useState<Record<number, number>>(
        () => Object.fromEntries(entries.map(e => [e.id, e.vote_count])),
    );
    const [votedEntryId, setVotedEntryId] = useState<number | null>(null);
    const [pendingId, setPendingId] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

    // Read this browser's existing vote (if any) after mount.
    useEffect(() => {
        try {
            const stored = localStorage.getItem(`urugero_voted_${contestId}`);
            if (stored) setVotedEntryId(Number(stored));
        } catch { /* ignore */ }
    }, [contestId]);

    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
    const maxCount = Math.max(...Object.values(counts), 0);
    const hasVoted = votedEntryId != null;
    const revealResults = showResults || hasVoted || ended;

    async function vote(entryId: number) {
        if (!votingOpen || hasVoted || pendingId != null) return;
        setPendingId(entryId);
        setFeedback(null);
        try {
            const res = await fetch("/api/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contestId, entryId, voterId: getVoterId() }),
            });
            const json = await res.json().catch(() => ({})) as {
                ok?: boolean; alreadyVoted?: boolean; error?: string;
                counts?: { id: number; vote_count: number }[];
            };

            if (json.counts) {
                setCounts(Object.fromEntries(json.counts.map(c => [c.id, c.vote_count])));
            }

            if (res.ok && json.ok) {
                setVotedEntryId(entryId);
                try { localStorage.setItem(`urugero_voted_${contestId}`, String(entryId)); } catch { /* ignore */ }
                setFeedback({ kind: "ok", text: "Murakoze! Itora ryawe ryakiriwe." });
            } else if (json.alreadyVoted) {
                setVotedEntryId(entryId);
                try { localStorage.setItem(`urugero_voted_${contestId}`, String(entryId)); } catch { /* ignore */ }
                setFeedback({ kind: "err", text: "Watoye kuri iri rushanwa." });
            } else {
                setFeedback({ kind: "err", text: json.error ?? "Itora ryanze. Ongera ugerageze." });
            }
        } catch {
            setFeedback({ kind: "err", text: "Itora ryanze. Reba interineti yawe." });
        } finally {
            setPendingId(null);
        }
    }

    if (entries.length === 0) {
        return <p className={styles.empty}>Nta bakandida bashyizweho ubu.</p>;
    }

    return (
        <>
            {ended && <div className={styles.closedBanner}>Amatora yarafunze. Dore ibyavuyemo.</div>}
            {!ended && !votingOpen && <div className={styles.closedBanner}>Amatora ntabwo afunguye ubu.</div>}
            {feedback && (
                <div className={`${styles.feedback} ${feedback.kind === "ok" ? styles.feedbackOk : styles.feedbackErr}`} role="status">
                    {feedback.text}
                </div>
            )}

            <div className={styles.entryList}>
                {entries.map(entry => {
                    const count = counts[entry.id] ?? 0;
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    const isLeader = revealResults && count > 0 && count === maxCount;
                    const isMine = votedEntryId === entry.id;

                    return (
                        <div key={entry.id} className={`${styles.entry} ${isLeader ? styles.entryLeader : ""}`}>
                            <div className={styles.entryImgWrap}>
                                {entry.image_url ? (
                                    <Image src={entry.image_url} alt={entry.name} fill className={styles.entryImg} />
                                ) : (
                                    <div className={styles.imgPlaceholder}>🎤</div>
                                )}
                            </div>
                            <div className={styles.entryBody}>
                                <h3 className={styles.entryName}>{entry.name}</h3>
                                {entry.subtitle && <p className={styles.entrySub}>{entry.subtitle}</p>}
                                {entry.youtube_id && (
                                    <a
                                        className={styles.watchLink}
                                        href={`https://www.youtube.com/watch?v=${entry.youtube_id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        ▶ Reba video
                                    </a>
                                )}

                                {revealResults && (
                                    <div className={styles.bar}>
                                        <span className={styles.barFill} style={{ width: `${pct}%` }} />
                                        <span className={styles.barText}>
                                            <span>{pct}%</span>
                                            <span>{count} {count === 1 ? "ijwi" : "amajwi"}</span>
                                        </span>
                                    </div>
                                )}

                                {isMine ? (
                                    <div className={styles.votedTag}>✓ Watoye uyu</div>
                                ) : votingOpen && !hasVoted ? (
                                    <button
                                        type="button"
                                        className={styles.voteBtn}
                                        onClick={() => vote(entry.id)}
                                        disabled={pendingId != null}
                                    >
                                        {pendingId === entry.id ? "Biragenda..." : "Tora"}
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
