"use client";

import { useEffect } from "react";

type ErrorProps = {
    error:  Error & { digest?: string };
    reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log to error tracking service (e.g. Sentry) in Phase 7
        console.error("[GlobalError]", error);
    }, [error]);

    return (
        <div style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
        }}>
            <div style={{ maxWidth: "480px" }}>

                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚠️</div>

                <h2 style={{
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: "var(--navy)",
                    marginBottom: "0.75rem",
                }}>
                    Hari Ikibazo Cyabaye
                </h2>

                <p style={{
                    color: "var(--text-muted)",
                    lineHeight: 1.7,
                    marginBottom: "0.5rem",
                }}>
                    Ikibazo kitazwi cyabaye. Gerageza nanone cyangwa subira ku rupapuro rw&apos;ahabanza.
                </p>

                {error.digest && (
                    <p style={{
                        fontSize: "0.75rem",
                        color: "var(--text-faint)",
                        fontFamily: "monospace",
                        marginBottom: "1.5rem",
                    }}>
                        ID: {error.digest}
                    </p>
                )}

                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <button onClick={reset} className="btn btn-accent">
                        Gerageza Nanone
                    </button>
                    <a href="/" className="btn btn-navy">
                        Subira Ahabanza
                    </a>
                </div>

            </div>
        </div>
    );
}
