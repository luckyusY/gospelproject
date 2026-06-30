"use client";

import { FormEvent, useMemo, useState } from "react";
import type { ArticleCommentRow } from "@/types/database";
import styles from "./ArticleComments.module.css";

type Props = {
    articleId: number;
    initialComments: ArticleCommentRow[];
};

type SubmitState = {
    type: "idle" | "success" | "error";
    message: string;
};

const formatter = new Intl.DateTimeFormat("rw-RW", {
    day: "numeric",
    month: "short",
    year: "numeric",
});

export default function ArticleComments({ articleId, initialComments }: Props) {
    const [comments] = useState(initialComments);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<SubmitState>({ type: "idle", message: "" });

    const sortedComments = useMemo(
        () => [...comments].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)),
        [comments],
    );

    async function submitComment(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setStatus({ type: "idle", message: "" });

        const response = await fetch("/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                articleId,
                authorName: name,
                authorEmail: email,
                message,
            }),
        });

        const payload = await response.json().catch(() => ({}));
        setSubmitting(false);

        if (!response.ok) {
            setStatus({
                type: "error",
                message: typeof payload.error === "string"
                    ? payload.error
                    : "Igitekerezo nticyabashije koherezwa.",
            });
            return;
        }

        setName("");
        setEmail("");
        setMessage("");
        setStatus({
            type: "success",
            message: "Murakoze. Igitekerezo cyanyu kizagaragara nyuma yo kwemezwa n'abanditsi.",
        });
    }

    return (
        <section className={styles.comments} aria-labelledby="comments-title">
            <div className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>Comments</p>
                    <h2 id="comments-title" className={styles.title}>Ibitekerezo by&apos;abasomyi</h2>
                </div>
                <span className={styles.count} aria-label={`${sortedComments.length} comments`}>
                    {sortedComments.length}
                </span>
            </div>

            <form className={styles.form} onSubmit={submitComment}>
                <div className={styles.fields}>
                    <input
                        className={styles.input}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Izina ryawe"
                        maxLength={80}
                        required
                    />
                    <input
                        className={styles.input}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Email (optional)"
                        type="email"
                        maxLength={120}
                    />
                </div>
                <textarea
                    className={styles.textarea}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Andika igitekerezo cyawe..."
                    maxLength={1200}
                    required
                />
                <div className={styles.submitRow}>
                    <p className={styles.hint}>Ibitekerezo bigaragazwa nyuma yo kwemezwa.</p>
                    <button className={styles.submit} type="submit" disabled={submitting}>
                        {submitting ? "Kohereza..." : "Ohereza igitekerezo"}
                    </button>
                </div>
                {status.message && (
                    <p className={`${styles.status} ${status.type === "error" ? styles.statusError : ""}`}>
                        {status.message}
                    </p>
                )}
            </form>

            <div className={styles.list}>
                {sortedComments.map((comment) => (
                    <article key={comment.id} className={styles.comment}>
                        <div className={styles.commentTop}>
                            <p className={styles.name}>{comment.author_name}</p>
                            <time className={styles.date} dateTime={comment.created_at}>
                                {formatter.format(new Date(comment.created_at))}
                            </time>
                        </div>
                        <p className={styles.message}>{comment.message}</p>
                    </article>
                ))}
                {sortedComments.length === 0 && (
                    <p className={styles.empty}>Nta gitekerezo kiragaragara. Ba uwa mbere gutanga igitekerezo.</p>
                )}
            </div>
        </section>
    );
}
