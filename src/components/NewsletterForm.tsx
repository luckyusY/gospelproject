"use client";

import { useState, useTransition } from "react";
import styles from "./NewsletterForm.module.css";

type Props = { variant?: "inline" | "block" };

export default function NewsletterForm({ variant = "inline" }: Props) {
    const [email, setEmail]   = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [isPending, start]  = useTransition();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/newsletter/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        start(() => {
            setStatus(res.ok ? "success" : "error");
            if (res.ok) setEmail("");
        });
    }

    if (status === "success") {
        return (
            <p className={styles.successMsg} role="status">
                ✅ Murakoze kwiyandikisha! Ubutumwa buzaza kuri {email}.
            </p>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`${styles.form} ${variant === "block" ? styles.block : styles.inline}`}
            aria-label="Iyandikishe ku makuru"
        >
            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Injiza imeyili yawe..."
                required
                className={styles.input}
                aria-label="Imeyili yawe"
            />
            <button type="submit" className={styles.btn} disabled={isPending}>
                {isPending ? "..." : "Iyandikishe"}
            </button>
            {status === "error" && (
                <p className={styles.errorMsg} role="alert">
                    Iyandikisho ryanze. Gerageza nanone.
                </p>
            )}
        </form>
    );
}
