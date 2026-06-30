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
                <div className={styles.filters} aria-label="Filter comments">
                    {(["pending", "approved", "all"] as Filter[]).map(option => (
                        <button
                            key={option}
                            type="button"
                            className={filter === option ? styles.filterActive : styles.filterBtn}
                            onClick={() => setFilter(option)}
                        >
                            {option.charAt(0).toUpperCase() + option.slice(1)} ({counts[option]})
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.list}>
                {visible.map(comment => (
                    <article key={comment.id} className={styles.card}>
                        <div className={styles.cardTop}>
                            <div>
                                <p className={styles.name}>{comment.author_name}</p>
                                {comment.author_email && <p className={styles.email}>{comment.author_email}</p>}
                                <p className={styles.meta}>{formatter.format(new Date(comment.created_at))}</p>
                                {comment.article && (
                                    <p className={styles.article}>
                                        Story:{" "}
                                        <Link href={comment.article.href} target="_blank">
                                            {comment.article.title}
                                        </Link>
                                    </p>
                                )}
                            </div>
                            <span className={comment.is_approved ? styles.badge : styles.badgePending}>
                                {comment.is_approved ? "Approved" : "Pending"}
                            </span>
                        </div>
                        <p className={styles.message}>{comment.message}</p>
                        <div className={styles.actions}>
                            {comment.is_approved ? (
                                <button
                                    type="button"
                                    className={styles.unapproveBtn}
                                    disabled={busyId === comment.id || isPending}
                                    onClick={() => setApproved(comment, false)}
                                >
                                    Hide
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className={styles.approveBtn}
                                    disabled={busyId === comment.id || isPending}
                                    onClick={() => setApproved(comment, true)}
                                >
                                    Approve
                                </button>
                            )}
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
