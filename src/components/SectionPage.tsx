"use client";

import Link from "next/link";
import styles from "./SectionPage.module.css";

type SubSection = {
    label: string;
    href:  string;
    desc?: string;
};

type Crumb = {
    label: string;
    href:  string;
};

type SectionPageProps = {
    title:       string;
    subtitle:    string;
    description: string;
    breadcrumb?: Crumb[];
    color?:      string;   // accent colour for hero border + card tops
    icon?:       string;
    subSections?: SubSection[];
};

export default function SectionPage({
    title,
    subtitle,
    description,
    breadcrumb = [],
    color = "var(--gold)",
    icon  = "📰",
    subSections = [],
}: SectionPageProps) {
    return (
        <div className={styles.page}>

            {/* ── Hero Banner ──────────────────────────── */}
            <div
                className={styles.hero}
                style={{ borderBottomColor: color }}
            >
                <div className="container">

                    {/* Breadcrumb */}
                    {breadcrumb.length > 0 && (
                        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                            <Link href="/" className={styles.breadcrumbLink}>Ahabanza</Link>
                            {breadcrumb.map((crumb) => (
                                <span key={crumb.href} style={{ display: "contents" }}>
                                    <span className={styles.breadcrumbSep} aria-hidden>›</span>
                                    <Link href={crumb.href} className={styles.breadcrumbLink}>
                                        {crumb.label}
                                    </Link>
                                </span>
                            ))}
                            <span className={styles.breadcrumbSep} aria-hidden>›</span>
                            <span className={styles.breadcrumbCurrent} aria-current="page">{title}</span>
                        </nav>
                    )}

                    {/* Title row */}
                    <div className={styles.heroContent}>
                        <span className={styles.heroIcon} aria-hidden>{icon}</span>
                        <div className={styles.heroText}>
                            <p className={styles.heroSubtitle} style={{ color }}>
                                {subtitle}
                            </p>
                            <h1 className={styles.heroTitle}>{title}</h1>
                            <p className={styles.heroDescription}>{description}</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Sub-sections Grid ────────────────────── */}
            {subSections.length > 0 && (
                <div className="container">
                    <div className={styles.subSectionsGrid}>
                        {subSections.map((s) => (
                            <Link
                                key={s.href}
                                href={s.href}
                                className={styles.subSectionCard}
                                style={{ borderTopColor: color }}
                            >
                                <h3 className={styles.subSectionTitle}>{s.label}</h3>
                                {s.desc && (
                                    <p className={styles.subSectionDesc}>{s.desc}</p>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Coming Soon ──────────────────────────── */}
            <div className="container">
                <div className={styles.comingSoon}>
                    <span className={styles.comingSoonIcon}>🚧</span>
                    <h3 className={styles.comingSoonTitle}>Ibikurikira biraza vuba</h3>
                    <p className={styles.comingSoonText}>
                        Iri ciro ryuzuzwa. Garuka vuba kugira ngo ubone ibirimo byuzuye kuri{" "}
                        <strong>{title}</strong>.
                    </p>
                </div>
            </div>

        </div>
    );
}
