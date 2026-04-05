"use client";

import { useState, useTransition } from "react";
import styles from "./contact.module.css";

type FormState = "idle" | "success" | "error";

const subjects = [
    "Ikibazo rusange",
    "Gukorana na Urugero Media",
    "Ubuhamya bwanjye",
    "Gusaba inyigisho",
    "Ikindi",
];

export default function ContactForm() {
    const [state, setState] = useState<FormState>("idle");
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setState("idle");

        const form = e.currentTarget;
        const data = {
            name:    (form.elements.namedItem("name")    as HTMLInputElement).value,
            email:   (form.elements.namedItem("email")   as HTMLInputElement).value,
            subject: (form.elements.namedItem("subject") as HTMLSelectElement).value,
            message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
        };

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        startTransition(() => {
            setState(res.ok ? "success" : "error");
            if (res.ok) form.reset();
        });
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {state === "success" && (
                <div className={styles.successMsg} role="status">
                    ✅ Ubutumwa bwawe bwakiriwe! Tuzagusubiza vuba.
                </div>
            )}
            {state === "error" && (
                <div className={styles.errorMsg} role="alert">
                    ❌ Hari ikibazo cyabaye. Gerageza nanone cyangwa utumanahire kuri imeyili.
                </div>
            )}

            <div className={styles.formRow}>
                <label className={styles.label}>
                    Amazina yawe <span className={styles.req}>*</span>
                    <input name="name" type="text" required className={styles.input} placeholder="Amazina yawe yose" />
                </label>
                <label className={styles.label}>
                    Imeyili <span className={styles.req}>*</span>
                    <input name="email" type="email" required className={styles.input} placeholder="imeyili@example.com" />
                </label>
            </div>

            <label className={styles.label}>
                Insanganyamatsiko
                <select name="subject" className={styles.select}>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </label>

            <label className={styles.label}>
                Ubutumwa <span className={styles.req}>*</span>
                <textarea
                    name="message"
                    required
                    rows={6}
                    className={styles.textarea}
                    placeholder="Andika ubutumwa bwawe hano..."
                />
            </label>

            <button type="submit" className={styles.submitBtn} disabled={isPending}>
                {isPending ? "Kohereza..." : "Kohereza ubutumwa"}
            </button>
        </form>
    );
}
