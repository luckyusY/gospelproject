import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Urupapuro Ntiruboneka — Urugero Media",
    robots: { index: false, follow: false },
};

export default function NotFound() {
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

                {/* Code */}
                <div style={{
                    fontSize: "6rem",
                    fontWeight: 900,
                    color: "var(--gold)",
                    lineHeight: 1,
                    marginBottom: "0.5rem",
                    fontFamily: "var(--font-playfair)",
                }}>
                    404
                </div>

                {/* Icon */}
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>

                <h1 style={{
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: "var(--navy)",
                    marginBottom: "0.75rem",
                }}>
                    Urupapuro Ntiruboneka
                </h1>

                <p style={{
                    color: "var(--text-muted)",
                    lineHeight: 1.7,
                    marginBottom: "2rem",
                }}>
                    Iri rupapuro ntirihari cyangwa ryimuritswe. Gerageza gushakisha
                    cyangwa subira ku rupapuro rw&apos;ahabanza.
                </p>

                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <Link href="/" className="btn btn-accent">
                        ← Subira Ahabanza
                    </Link>
                    <Link href="/amakuru" className="btn btn-navy">
                        Reba Amakuru
                    </Link>
                </div>

            </div>
        </div>
    );
}
