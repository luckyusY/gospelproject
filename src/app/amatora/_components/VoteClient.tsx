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

/** Official multi-colour Google "G" mark for the sign-in button. */
function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
            <path fill="#FBBC05" d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3.01-2.33z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
        </svg>
    );
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
            // Remember where to return to; the redirect URL itself stays static
            // (no query string) so it's easy to allowlist exactly in Supabase.
            try { localStorage.setItem("post_login_next", window.location.pathname + window.location.search); } catch { /* ignore */ }
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) {
                setSigningIn(false);
                setFeedback({ kind: "err", text: "Sign-in failed. Please try again." });
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
            setFeedback({ kind: "err", text: "Sign in with Google before voting." });
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
                setFeedback({ kind: "ok", text: "Thank you! Your vote has been counted." });
            } else if (json.alreadyVoted) {
                setVotedEntryId(entryId);
                try { localStorage.setItem(`urugero_voted_${contestId}`, String(entryId)); } catch { /* ignore */ }
                setFeedback({ kind: "err", text: "You have already voted in this contest." });
            } else {
                setFeedback({ kind: "err", text: json.error ?? "Vote failed. Please try again." });
            }
        } catch {
            setFeedback({ kind: "err", text: "Vote failed. Check your internet connection." });
        } finally {
            setPendingId(null);
        }
    }

    if (entries.length === 0) {
        return <p className={styles.empty}>No contestants have been added yet.</p>;
    }

    return (
        <>
            {ended && <div className={styles.closedBanner}>Voting has closed. Here are the results.</div>}
            {!ended && !votingOpen && <div className={styles.closedBanner}>Voting is not open right now.</div>}
            {feedback && (
                <div className={`${styles.feedback} ${feedback.kind === "ok" ? styles.feedbackOk : styles.feedbackErr}`} role="status">
                    {feedback.text}
                </div>
            )}

            {votingOpen && authReady && !user && (
                <div className={styles.signInPrompt}>
                    <p>Sign in with Google to vote. One vote per person — click the <strong>Vote</strong> button on your favourite below.</p>
                    <button type="button" className={styles.googleBtn} onClick={signIn} disabled={signingIn}>
                        <GoogleIcon />
                        {signingIn ? "Loading..." : "Sign in with Google"}
                    </button>
                </div>
            )}

            {user && (
                <div className={styles.signedIn}>
                    <GoogleIcon />
                    <span>Signed in as <strong>{user.email}</strong></span>
                    <button type="button" className={styles.signOutBtn} onClick={signOut}>Sign out</button>
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
                                            <span>{count} {count === 1 ? "vote" : "votes"}</span>
                                        </span>
                                    </div>
                                )}

                                {isMine ? (
                                    <div className={styles.votedTag}>✓ You voted for this</div>
                                ) : votingOpen && !hasVoted && user ? (
                                    <button
                                        type="button"
                                        className={styles.voteBtn}
                                        onClick={() => vote(entry.id)}
                                        disabled={pendingId != null}
                                    >
                                        {pendingId === entry.id ? "Voting..." : "Vote"}
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
