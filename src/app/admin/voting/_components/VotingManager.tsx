"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ContestEntryRow, ContestRow } from "@/types/database";
import styles from "../../crud.module.css";
import form from "../../form.module.css";

function slugify(val: string) {
    return val.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

type Props = {
    contests: ContestRow[];
    entries: ContestEntryRow[];
    tableMissing: boolean;
};

export default function VotingManager({ contests, entries, tableMissing }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const refresh = () => startTransition(() => router.refresh());
    const [busyId, setBusyId] = useState<number | null>(null);

    const entriesOf = (contestId: number) => entries.filter(e => e.contest_id === contestId);

    // Add-contest form
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [slugTouched, setSlugTouched] = useState(false);
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function addContest(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        const finalSlug = slug.trim() || slugify(title);
        if (!title.trim() || !finalSlug) { setError("Enter a contest title."); return; }

        const res = await fetch("/api/admin/contests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: title.trim(), slug: finalSlug, description: description.trim() }),
        });
        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            setError((json as { error?: string }).error ?? "Could not add the contest.");
            return;
        }
        setTitle(""); setSlug(""); setSlugTouched(false); setDescription("");
        refresh();
    }

    async function patchContest(contest: ContestRow, body: Record<string, unknown>) {
        setBusyId(contest.id);
        const res = await fetch(`/api/admin/contests/${contest.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        setBusyId(null);
        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            alert((json as { error?: string }).error ?? "Could not save the contest.");
            return;
        }
        refresh();
    }

    async function removeContest(contest: ContestRow) {
        if (!confirm(`Delete "${contest.title}" and all its entries and votes?`)) return;
        setBusyId(contest.id);
        await fetch(`/api/admin/contests/${contest.id}`, { method: "DELETE" });
        setBusyId(null);
        refresh();
    }

    async function resetVotes(contest: ContestRow) {
        if (!confirm(`Reset all votes for "${contest.title}" back to zero? This cannot be undone.`)) return;
        setBusyId(contest.id);
        const res = await fetch(`/api/admin/contests/${contest.id}/reset`, { method: "POST" });
        setBusyId(null);
        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            alert((json as { error?: string }).error ?? "Could not reset votes.");
            return;
        }
        refresh();
    }

    async function patchEntry(entry: ContestEntryRow, body: Record<string, unknown>) {
        setBusyId(entry.id);
        await fetch(`/api/admin/contest-entries/${entry.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        setBusyId(null);
        refresh();
    }

    async function removeEntry(entry: ContestEntryRow) {
        if (!confirm(`Remove "${entry.name}"?`)) return;
        setBusyId(entry.id);
        await fetch(`/api/admin/contest-entries/${entry.id}`, { method: "DELETE" });
        setBusyId(null);
        refresh();
    }

    async function addEntry(contestId: number, childCount: number, body: Record<string, unknown>) {
        const res = await fetch("/api/admin/contest-entries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...body, contest_id: contestId, sort_order: childCount }),
        });
        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            alert((json as { error?: string }).error ?? "Could not add the entry.");
            return false;
        }
        refresh();
        return true;
    }

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>Voting</h1>
                <a href="/admin" className={form.backBtn}>Back</a>
            </div>

            {tableMissing && (
                <p className={styles.empty}>
                    The voting tables are not set up yet. Run <code>supabase/voting.sql</code> in the
                    Supabase SQL Editor, then refresh this page.
                </p>
            )}

            {/* Add contest */}
            <form onSubmit={addContest} className={styles.catAddForm}>
                <div className={form.formGrid} style={{ gap: "0.75rem" }}>
                    <input
                        value={title}
                        onChange={e => { setTitle(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }}
                        placeholder="Contest title (e.g. Indirimbo nziza 2026)"
                        className={form.input}
                        aria-label="Contest title"
                    />
                    <input
                        value={slug}
                        onChange={e => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
                        placeholder="slug (e.g. indirimbo-nziza-2026)"
                        className={form.input}
                        pattern="[a-z0-9-]+"
                        aria-label="Slug"
                    />
                    <input
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Short description (shown above the entries)"
                        className={form.input}
                        aria-label="Description"
                    />
                    <button type="submit" className={styles.newBtn} disabled={isPending} style={{ maxWidth: 180 }}>
                        + Add contest
                    </button>
                </div>
                {error && <div className={form.error} role="alert">{error}</div>}
            </form>

            {contests.length === 0 && !tableMissing && (
                <p className={styles.empty}>No contests yet. Add one above to start collecting votes.</p>
            )}

            {/* Contests */}
            {contests.map(contest => {
                const contestEntries = entriesOf(contest.id);
                const totalVotes = contestEntries.reduce((sum, e) => sum + e.vote_count, 0);
                // eslint-disable-next-line react-hooks/purity
                const ended = Boolean(contest.ends_at && new Date(contest.ends_at).getTime() < Date.now());

                return (
                    <div key={contest.id} className={form.form} style={{ marginBottom: "1.5rem", opacity: busyId === contest.id ? 0.6 : 1 }}>
                        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
                            <input
                                defaultValue={contest.title}
                                onBlur={e => { if (e.target.value.trim() && e.target.value !== contest.title) patchContest(contest, { title: e.target.value.trim() }); }}
                                className={form.input}
                                style={{ flex: "1 1 200px", fontWeight: 700 }}
                                aria-label="Contest title"
                            />
                            <input
                                defaultValue={contest.slug}
                                onBlur={e => { if (e.target.value !== contest.slug) patchContest(contest, { slug: e.target.value.trim() }); }}
                                className={form.input}
                                style={{ flex: "1 1 160px" }}
                                placeholder="slug"
                                aria-label="Slug"
                            />
                            <span style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                                🗳️ {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                            </span>
                        </div>

                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.6rem" }}>
                            <label className={form.checkLabel} style={{ margin: 0 }}>
                                <input type="checkbox" className={form.checkbox} defaultChecked={contest.is_active} onChange={e => patchContest(contest, { is_active: e.target.checked })} /> Open for voting
                            </label>
                            <label className={form.checkLabel} style={{ margin: 0 }}>
                                <input type="checkbox" className={form.checkbox} defaultChecked={contest.show_results} onChange={e => patchContest(contest, { show_results: e.target.checked })} /> Show results
                            </label>
                            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}>
                                Closes:
                                <input
                                    type="datetime-local"
                                    defaultValue={contest.ends_at ? toLocalInput(contest.ends_at) : ""}
                                    onBlur={e => patchContest(contest, { ends_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                                    className={form.input}
                                    style={{ width: 200 }}
                                    aria-label="Closing time"
                                />
                            </label>
                            {ended && <span style={{ color: "#B80000", fontSize: "0.8rem", fontWeight: 600 }}>Closed</span>}
                            <a href={`/amatora/${contest.slug}`} className={styles.viewBtn} target="_blank" rel="noreferrer">View</a>
                            <button type="button" className={styles.viewBtn} onClick={() => resetVotes(contest)}>Reset votes</button>
                            <button type="button" className={styles.deleteRowBtn} onClick={() => removeContest(contest)}>Delete</button>
                        </div>

                        <input
                            defaultValue={contest.description}
                            onBlur={e => { if (e.target.value !== contest.description) patchContest(contest, { description: e.target.value }); }}
                            className={form.input}
                            style={{ marginTop: "0.6rem" }}
                            placeholder="Short description"
                            aria-label="Description"
                        />

                        {/* Entries */}
                        <div style={{ marginTop: "0.85rem", paddingLeft: "1.25rem", borderLeft: "2px solid var(--border, #D8D8D8)" }}>
                            {contestEntries.map(entry => (
                                <div key={entry.id} style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap", opacity: busyId === entry.id ? 0.6 : 1 }}>
                                    <input
                                        defaultValue={entry.name}
                                        onBlur={e => { if (e.target.value.trim() && e.target.value !== entry.name) patchEntry(entry, { name: e.target.value.trim() }); }}
                                        className={form.input}
                                        style={{ flex: "1 1 140px" }}
                                        aria-label="Entry name"
                                    />
                                    <input
                                        defaultValue={entry.subtitle}
                                        onBlur={e => { if (e.target.value !== entry.subtitle) patchEntry(entry, { subtitle: e.target.value }); }}
                                        className={form.input}
                                        style={{ flex: "1 1 140px" }}
                                        placeholder="subtitle (e.g. itorero / umujyi)"
                                        aria-label="Entry subtitle"
                                    />
                                    <input
                                        defaultValue={entry.image_url ?? ""}
                                        onBlur={e => { if ((e.target.value || null) !== entry.image_url) patchEntry(entry, { image_url: e.target.value }); }}
                                        className={form.input}
                                        style={{ flex: "1 1 140px" }}
                                        placeholder="image URL"
                                        aria-label="Entry image URL"
                                    />
                                    <input
                                        defaultValue={entry.youtube_id ?? ""}
                                        onBlur={e => { if ((e.target.value || null) !== entry.youtube_id) patchEntry(entry, { youtube_id: e.target.value }); }}
                                        className={form.input}
                                        style={{ width: 120 }}
                                        placeholder="YouTube ID"
                                        aria-label="Entry YouTube ID"
                                    />
                                    <span style={{ fontSize: "0.85rem", fontWeight: 600, whiteSpace: "nowrap" }}>{entry.vote_count} ✓</span>
                                    <button type="button" className={styles.deleteRowBtn} onClick={() => removeEntry(entry)}>✕</button>
                                </div>
                            ))}
                            <AddEntry contestId={contest.id} childCount={contestEntries.length} onAdd={addEntry} />
                        </div>
                    </div>
                );
            })}

            <p className={styles.catHint}>
                Each visitor can vote once per contest (tracked by their browser). Turn off <strong>Open for voting</strong>
                to close a contest, or set a <strong>Closes</strong> time. Use <strong>Reset votes</strong> to start a new round.
            </p>
        </div>
    );
}

function AddEntry({ contestId, childCount, onAdd }: {
    contestId: number;
    childCount: number;
    onAdd: (contestId: number, childCount: number, body: Record<string, unknown>) => Promise<boolean>;
}) {
    const [name, setName] = useState("");
    const [subtitle, setSubtitle] = useState("");

    async function add(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) return;
        const ok = await onAdd(contestId, childCount, { name: name.trim(), subtitle: subtitle.trim() });
        if (ok) { setName(""); setSubtitle(""); }
    }

    return (
        <form onSubmit={add} style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.4rem", flexWrap: "wrap" }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="+ contestant name" className={form.input} style={{ flex: "1 1 150px" }} aria-label="New entry name" />
            <input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="subtitle (optional)" className={form.input} style={{ flex: "1 1 150px" }} aria-label="New entry subtitle" />
            <button type="submit" className={styles.viewBtn}>Add</button>
        </form>
    );
}

// Convert a stored ISO timestamp to the value a datetime-local input expects.
function toLocalInput(iso: string) {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
