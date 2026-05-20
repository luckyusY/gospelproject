"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ChatCircleDots, PaperPlaneTilt } from "@phosphor-icons/react";
import styles from "./RadioComments.module.css";

type RadioComment = {
    id: number;
    listener_name: string;
    message: string;
    created_at: string;
};

type CommentResponse = {
    comments?: RadioComment[];
    comment?: RadioComment;
    error?: string;
};

const MAX_MESSAGE_LENGTH = 280;

function formatCommentTime(value: string) {
    try {
        return new Intl.DateTimeFormat("rw-RW", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(value));
    } catch {
        return "";
    }
}

export default function RadioComments() {
    const [comments, setComments] = useState<RadioComment[]>([]);
    const [listenerName, setListenerName] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notice, setNotice] = useState("");

    const remaining = useMemo(() => MAX_MESSAGE_LENGTH - message.length, [message]);

    useEffect(() => {
        let isMounted = true;

        async function loadComments() {
            try {
                const response = await fetch("/api/radio/comments", { cache: "no-store" });
                const data = await response.json() as CommentResponse;
                if (isMounted && data.comments) setComments(data.comments);
            } catch {
                if (isMounted) setNotice("Ibitekerezo ntibyabashije gufunguka.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadComments();

        return () => {
            isMounted = false;
        };
    }, []);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmedName = listenerName.trim();
        const trimmedMessage = message.trim();

        if (!trimmedName || !trimmedMessage) {
            setNotice("Andika izina n'igitekerezo cyawe.");
            return;
        }

        setIsSubmitting(true);
        setNotice("");

        try {
            const response = await fetch("/api/radio/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ listenerName: trimmedName, message: trimmedMessage }),
            });
            const data = await response.json() as CommentResponse;

            if (!response.ok || !data.comment) {
                setNotice(data.error ?? "Igitekerezo nticyoherejwe.");
                return;
            }

            setComments(current => [data.comment as RadioComment, ...current].slice(0, 25));
            setMessage("");
            setNotice("Igitekerezo cyawe cyakiriwe.");
        } catch {
            setNotice("Habaye ikibazo. Ongera ugerageze.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className={styles.comments} aria-labelledby="radio-comments-title">
            <div className={styles.header}>
                <span className={styles.icon} aria-hidden>
                    <ChatCircleDots size={18} weight="fill" />
                </span>
                <div>
                    <h2 id="radio-comments-title">Ibitekerezo by&apos;abumva radio</h2>
                    <p>Ganira n&apos;abandi mu gihe mukurikiye Urugero Live Radio.</p>
                </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.label}>
                    <span>Izina</span>
                    <input
                        value={listenerName}
                        onChange={(event) => setListenerName(event.target.value)}
                        maxLength={80}
                        placeholder="Andika izina ryawe"
                    />
                </label>
                <label className={styles.label}>
                    <span>Igitekerezo</span>
                    <textarea
                        value={message}
                        onChange={(event) => setMessage(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                        rows={3}
                        placeholder="Sangiza abandi ibyo wumva cyangwa usabe indirimbo..."
                    />
                </label>
                <div className={styles.formFooter}>
                    <span className={remaining < 30 ? styles.limitWarning : styles.limit}>
                        {remaining}
                    </span>
                    <button type="submit" disabled={isSubmitting}>
                        <PaperPlaneTilt size={16} weight="fill" />
                        {isSubmitting ? "Birimo koherezwa" : "Ohereza"}
                    </button>
                </div>
                {notice && <p className={styles.notice}>{notice}</p>}
            </form>

            <div className={styles.list} aria-live="polite">
                {isLoading ? (
                    <p className={styles.empty}>Ibitekerezo birimo gufunguka...</p>
                ) : comments.length > 0 ? (
                    comments.map(comment => (
                        <article key={comment.id} className={styles.comment}>
                            <div className={styles.commentTop}>
                                <strong>{comment.listener_name}</strong>
                                <time dateTime={comment.created_at}>{formatCommentTime(comment.created_at)}</time>
                            </div>
                            <p>{comment.message}</p>
                        </article>
                    ))
                ) : (
                    <p className={styles.empty}>Ba uwa mbere wanditse igitekerezo kuri radio.</p>
                )}
            </div>
        </section>
    );
}
