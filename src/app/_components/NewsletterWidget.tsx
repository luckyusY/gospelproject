"use client";

import { useState, useTransition } from "react";
import styles from "../page.module.css";

export default function NewsletterWidget({ band = false }: { band?: boolean }) {
    const [email, setEmail]   = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [isPending, start]  = useTransition();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("idle");
        try {
            const res = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            start(() => {
                setStatus(res.ok ? "success" : "error");
                if (res.ok) setEmail("");
            });
        } catch {
            start(() => setStatus("error"));
        }
    }

    return (
        <div className={`${styles.newsletterWidget} ${band ? styles.newsletterBandWidget : ""}`}>
            <div className={styles.newsletterIcon} aria-hidden>📖</div>
            <h2>Inyigisho za buri Cyumweru</h2>
            <p>Yandikisha kuri Urugero kugira ngo ubone inyigisho n&apos;amakuru y&apos;Imana buri cyumweru.</p>

            {status === "success" ? (
                <p className={styles.newsletterSuccess} role="status">
                    ✅ Murakoze kwiyandikisha! Reba imeyili yawe.
                </p>
            ) : (
                <form className={styles.newsletterForm} onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Emeyili yawe"
                        required
                        aria-label="Emeyili yawe yo kwiyandikisha"
                    />
                    <button type="submit" className="btn btn-accent" disabled={isPending}>
                        {isPending ? "Tegereza..." : "Iyandikishe — Kubuntu"}
                    </button>
                    {status === "error" && (
                        <p className={styles.newsletterError} role="alert">
                            Iyandikisho ryanze. Gerageza nanone.
                        </p>
                    )}
                </form>
            )}
        </div>
    );
}
