"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ArticleCommentRow } from "@/types/database";
import styles from "../comments.module.css";

type ArticleSummary = {
    title: string;
    href: string;
};

export type AdminArticleComment = ArticleCommentRow & {
    article?: ArticleSummary;
};

type Filter = "pending" | "approved" | "all";

const formatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

export default function CommentModerationClient({ comments }: { comments: AdminArticleComment[] }) {
    const router = useRouter();
    const [filter, setFilter] = useState<Filter>("pending");
    const [busyId, setBusyId] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();

    const counts = useMemo(() => ({
        all: comments.length,
        pending: comments.filter(comment => !comment.is_approved).length,
        approved: comments.filter(comment => comment.is_approved).length,
    }), [comments]);

    const visible = useMemo(() => comments.filter(comment => {
        if (filter === "pending") return !comment.is_approved;
        if (filter === "approved") return comment.is_approved;
        return true;
    }), [comments, filter]);
    const latestComment = comments[0];

    async function setApproved(comment: AdminArticleComment, approved: boolean) {
        setBusyId(comment.id);
        await fetch(`/api/admin/comments/${comment.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_approved: approved }),
        });
        setBusyId(null);
        startTransition(() => router.refresh());
    }

    async function remove(comment: AdminArticleComment) {
        if (!confirm(`Delete comment from "${comment.author_name}"?`)) return;
        setBusyId(comment.id);
        await fetch(`/api/admin/comments/${comment.id}`, { method: "DELETE" });
        setBusyId(null);
        startTransition(() => router.refresh());
    }

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <div>
                    <h1 className={styles.heading}>Comments</h1>
                    <p className={styles.subheading}>Approve, hide, or delete reader comments.</p>
                </div>
            </div>

            <div className={styles.summaryGrid}>
                <button
                    type="button"
                    className={filter === "pending" ? styles.summaryActive : styles.summaryCard}
                    onClick={() => setFilter("pending")}
                >
                    <span>Pending</span>
                    <strong>{counts.pending}</strong>
                    <small>Need review</small>
                </button>
                <button
                    type="button"
                    className={filter === "approved" ? styles.summaryActive : styles.summaryCard}
                    onClick={() => setFilter("approved")}
                >
                    <span>Approved</span>
                    <strong>{counts.approved}</strong>
                    <small>Visible on stories</small>
                </button>
                <button
                    type="button"
                    className={filter === "all" ? styles.summaryActive : styles.summaryCard}
                    onClick={() => setFilter("all")}
                >
                    <span>Total</span>
                    <strong>{counts.all}</strong>
                    <small>
                        {latestComment
                            ? `Latest ${formatter.format(new Date(latestComment.created_at))}`
                            : "No comments yet"}
                    </small>
                </button>
            </div>

            <div className={styles.list}>
                {visible.map(comment => (
                    <article key={comment.id} className={styles.card}>
                        <div className={styles.cardTop}>
                            <div className={styles.identity}>
                                <span className={styles.avatar} aria-hidden>
                                    {comment.author_name.trim().charAt(0).toUpperCase() || "U"}
                                </span>
                                <div>
                                    <p className={styles.name}>{comment.author_name}</p>
                                    <p className={styles.meta}>{formatter.format(new Date(comment.created_at))}</p>
                                </div>
                            </div>
                            <span className={comment.is_approved ? styles.badge : styles.badgePending}>
                                {comment.is_approved ? "Approved" : "Pending"}
                            </span>
                        </div>
                        <p className={styles.message}>{comment.message}</p>
                        <div className={styles.details}>
                            <span>{comment.author_email || "No email provided"}</span>
                            {comment.article && (
                                <span>
                                    Story:{" "}
                                    <Link href={comment.article.href} target="_blank">
                                        {comment.article.title}
                                    </Link>
                                </span>
                            )}
                        </div>
                        <div className={styles.actions}>
                            <div className={styles.primaryActions}>
                                {comment.is_approved ? (
                                    <button
                                        type="button"
                                        className={styles.unapproveBtn}
                                        disabled={busyId === comment.id || isPending}
                                        onClick={() => setApproved(comment, false)}
                                    >
                                        Hide from story
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className={styles.approveBtn}
                                        disabled={busyId === comment.id || isPending}
                                        onClick={() => setApproved(comment, true)}
                                    >
                                        Approve comment
                                    </button>
                                )}
                            </div>
                            <button
                                type="button"
                                className={styles.deleteBtn}
                                disabled={busyId === comment.id || isPending}
                                onClick={() => remove(comment)}
                            >
                                Delete
                            </button>
                        </div>
                    </article>
                ))}

                {visible.length === 0 && (
                    <p className={styles.empty}>No comments in this view.</p>
                )}
            </div>
        </div>
    );
}
