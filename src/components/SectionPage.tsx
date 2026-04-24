"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, heroTitle, fadeUp, fadeLeft, drawLine } from "@/lib/animations";
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
    heroImage?:  string;   // optional Unsplash/open-source background image URL
    subSections?: SubSection[];
};

export default function SectionPage({
    title,
    subtitle,
    description,
    breadcrumb = [],
    color = "var(--gold)",
    icon  = "📰",
    heroImage,
    subSections = [],
}: SectionPageProps) {
    return (
        <div className={styles.page}>

            {/* ── Hero Banner ──────────────────────────── */}
            <div
                className={styles.hero}
                style={{
                    borderBottomColor: color,
                    ...(heroImage && {
                        backgroundImage: `linear-gradient(135deg, rgba(31,31,31,0.88) 0%, rgba(31,31,31,0.78) 100%), url(${heroImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }),
                }}
            >
                <div className="container">

                    {/* Breadcrumb */}
                    {breadcrumb.length > 0 && (
                        <motion.nav
                            className={styles.breadcrumb}
                            aria-label="Breadcrumb"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
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
                        </motion.nav>
                    )}

                    {/* Title row */}
                    <motion.div
                        className={styles.heroContent}
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.span
                            className={styles.heroIcon}
                            aria-hidden
                            variants={fadeLeft}
                        >
                            {icon}
                        </motion.span>
                        <div className={styles.heroText}>
                            <motion.p
                                className={styles.heroSubtitle}
                                style={{ color }}
                                variants={heroTitle}
                            >
                                {subtitle}
                            </motion.p>
                            <motion.h1
                                className={styles.heroTitle}
                                variants={heroTitle}
                            >
                                {title}
                            </motion.h1>
                            <motion.div
                                className={styles.heroDivider}
                                variants={drawLine}
                                style={{ backgroundColor: color }}
                            />
                            <motion.p
                                className={styles.heroDescription}
                                variants={fadeUp}
                            >
                                {description}
                            </motion.p>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* ── Sub-sections Grid ────────────────────── */}
            {subSections.length > 0 && (
                <div className="container">
                    <motion.div
                        className={styles.subSectionsGrid}
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {subSections.map((s) => (
                            <motion.div key={s.href} variants={fadeUp}>
                                <Link
                                    href={s.href}
                                    className={styles.subSectionCard}
                                    style={{ borderTopColor: color }}
                                >
                                    <h3 className={styles.subSectionTitle}>{s.label}</h3>
                                    {s.desc && (
                                        <p className={styles.subSectionDesc}>{s.desc}</p>
                                    )}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            )}

            {/* ── Coming Soon ──────────────────────────── */}
            <div className="container">
                <motion.div
                    className={styles.comingSoon}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span className={styles.comingSoonIcon}>🚧</span>
                    <h3 className={styles.comingSoonTitle}>Ibikurikira biraza vuba</h3>
                    <p className={styles.comingSoonText}>
                        Iri ciro ryuzuzwa. Garuka vuba kugira ngo ubone ibirimo byuzuye kuri{" "}
                        <strong>{title}</strong>.
                    </p>
                </motion.div>
            </div>

        </div>
    );
}
