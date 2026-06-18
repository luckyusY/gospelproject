"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import YoutubeEmbed from "@/components/ui/YoutubeEmbed";
import styles from "../amatora.module.css";

/** Accepts a raw YouTube ID or any common YouTube URL and returns the ID. */
function extractYouTubeId(value: string | null): string | null {
    if (!value) return null;
    const v = value.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
    const m = v.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
    return m?.[1] ?? null;
}

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

export default function VoteClient({ contestId, entries, showResults, votingOpen, ended }: Props) {
    const [counts, setCounts] = useState<Record<number, number>>(
        () => Object.fromEntries(entries.map(e => [e.id, e.vote_count])),
    );
    const [votedEntryId, setVotedEntryId] = useState<number | null>(null);
    const [pendingId, setPendingId] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [authReady, setAuthReady] = useState(false);
    const [signingIn, setSigningIn] = useState(false);

    // Track the Google sign-in session.
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null);
            setAuthReady(true);
        });
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setAuthReady(true);
        });
        return () => sub.subscription.unsubscribe();
    }, []);

    // Read this browser's existing vote (if any) after mount.
    useEffect(() => {
        try {
            const stored = localStorage.getItem(`urugero_voted_${contestId}`);
            if (stored) setVotedEntryId(Number(stored));
        } catch { /* ignore */ }
    }, [contestId]);

    async function signIn() {
        setSigningIn(true);
        setFeedback(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: window.location.href },
            });
            if (error) {
                setSigningIn(false);
                setFeedback({ kind: "err", text: "Kwinjira byanze. Ongera ugerageze." });
            }
        } catch {
            setSigningIn(false);
            setFeedback({ kind: "err", text: "Kwinjira byanze. Ongera ugerageze." });
        }
    }

    async function signOut() {
        await supabase.auth.signOut();
        setUser(null);
    }

    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
    const maxCount = Math.max(...Object.values(counts), 0);
    const hasVoted = votedEntryId != null;
    const revealResults = showResults || hasVoted || ended;

    async function vote(entryId: number) {
        if (!votingOpen || hasVoted || pendingId != null) return;

        // A valid Google session is required — the access token proves identity.
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) {
            setFeedback({ kind: "err", text: "Injira na Google mbere yo gutora." });
            return;
        }

        setPendingId(entryId);
        setFeedback(null);
        try {
            const res = await fetch("/api/vote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ contestId, entryId }),
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

            {votingOpen && authReady && !user && (
                <div className={styles.signInPrompt}>
                    <p>Injira na Google kugira ngo utore. Buri muntu atora rimwe.</p>
                    <button type="button" className={styles.googleBtn} onClick={signIn} disabled={signingIn}>
                        {signingIn ? "Biragenda..." : "Injira na Google"}
                    </button>
                </div>
            )}

            {user && (
                <div className={styles.signedIn}>
                    <span>{user.email}</span>
                    <button type="button" className={styles.signOutBtn} onClick={signOut}>Sohoka</button>
                </div>
            )}

            <div className={styles.entryList}>
                {entries.map(entry => {
                    const count = counts[entry.id] ?? 0;
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    const isLeader = revealResults && count > 0 && count === maxCount;
                    const isMine = votedEntryId === entry.id;

                    const ytId = extractYouTubeId(entry.youtube_id);
                    return (
                        <div key={entry.id} className={`${styles.entry} ${isLeader ? styles.entryLeader : ""}`}>
                            {ytId ? (
                                <div className={styles.entryEmbed}>
                                    <YoutubeEmbed videoId={ytId} title={entry.name} aspect="16/9" />
                                </div>
                            ) : (
                                <div className={styles.entryImgWrap}>
                                    {entry.image_url ? (
                                        <Image src={entry.image_url} alt={entry.name} fill className={styles.entryImg} />
                                    ) : (
                                        <div className={styles.imgPlaceholder}>🎤</div>
                                    )}
                                </div>
                            )}
                            <div className={styles.entryBody}>
                                <h3 className={styles.entryName}>{entry.name}</h3>
                                {entry.subtitle && <p className={styles.entrySub}>{entry.subtitle}</p>}

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
                                ) : votingOpen && !hasVoted && user ? (
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
