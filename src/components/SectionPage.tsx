"use client";

import Link from "next/link";

type SectionPageProps = {
    title: string;
    subtitle: string;
    description: string;
    breadcrumb?: { label: string; href: string }[];
    color?: string;
    icon?: string;
    subSections?: { label: string; href: string; desc?: string }[];
};

export default function SectionPage({
    title,
    subtitle,
    description,
    breadcrumb = [],
    color = "#F59E0B",
    icon = "📰",
    subSections = [],
}: SectionPageProps) {
    return (
        <div style={{ minHeight: "60vh", padding: "2rem 0" }}>
            {/* Hero banner */}
            <div
                style={{
                    background: `linear-gradient(135deg, #0D1B2E 0%, ${color}22 100%)`,
                    borderBottom: `4px solid ${color}`,
                    padding: "3rem 1.5rem",
                    marginBottom: "2.5rem",
                }}
            >
                <div className="container">
                    {/* Breadcrumb */}
                    {breadcrumb.length > 0 && (
                        <nav style={{ marginBottom: "1rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
                            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Ahabanza</Link>
                            {breadcrumb.map((b) => (
                                <span key={b.href}>
                                    {" / "}
                                    <Link href={b.href} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                                        {b.label}
                                    </Link>
                                </span>
                            ))}
                            {" / "}
                            <span style={{ color: color }}>{title}</span>
                        </nav>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                        <span style={{ fontSize: "2.5rem" }}>{icon}</span>
                        <div>
                            <p style={{ color, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                                {subtitle}
                            </p>
                            <h1 style={{ color: "#ffffff", fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.1 }}>
                                {title}
                            </h1>
                        </div>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.65)", maxWidth: "600px", lineHeight: 1.7, fontSize: "1rem" }}>
                        {description}
                    </p>
                </div>
            </div>

            {/* Sub-sections grid */}
            {subSections.length > 0 && (
                <div className="container">
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: "1.25rem",
                        marginBottom: "3rem",
                    }}>
                        {subSections.map((s) => (
                            <Link
                                key={s.href}
                                href={s.href}
                                style={{
                                    display: "block",
                                    background: "#ffffff",
                                    border: "1.5px solid #E2E8F0",
                                    borderRadius: "12px",
                                    padding: "1.25rem",
                                    textDecoration: "none",
                                    transition: "all 0.2s",
                                    borderTop: `3px solid ${color}`,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
                                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLAnchorElement).style.transform = "none";
                                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                                }}
                            >
                                <h3 style={{ color: "#0D1B2E", fontWeight: 700, fontSize: "1rem", marginBottom: s.desc ? "0.4rem" : 0 }}>
                                    {s.label}
                                </h3>
                                {s.desc && (
                                    <p style={{ color: "#64748B", fontSize: "0.82rem", lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Coming soon placeholder */}
            <div className="container">
                <div style={{
                    background: "#F8FAFC",
                    border: "2px dashed #CBD5E1",
                    borderRadius: "16px",
                    padding: "3rem",
                    textAlign: "center",
                }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚧</div>
                    <h3 style={{ color: "#0D1B2E", fontWeight: 700, marginBottom: "0.5rem" }}>Ibikurikira biraza vuba</h3>
                    <p style={{ color: "#64748B", maxWidth: "400px", margin: "0 auto" }}>
                        Iri ciro ryuzuzwa. Garuka vuba kugira ngo ubone ibirimo byuzuye kuri {title}.
                    </p>
                </div>
            </div>
        </div>
    );
}
