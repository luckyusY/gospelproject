"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Zap, ChevronRight, Bell } from "lucide-react";
import styles from "./Header.module.css";

const breakingNews = [
    "Global Prayer Summit draws 50,000 attendees across 6 continents",
    "New worship album tops Christian charts for the 8th consecutive week",
    "Community outreach program feeds 10,000 families this season",
];

const navLinks = [
    { href: "/",              label: "Home" },
    { href: "/news",          label: "Trending" },
    { href: "/study",         label: "Bible Study" },
    { href: "/life",          label: "Christian Life" },
    { href: "/events",        label: "Events" },
    { href: "/entertainment", label: "Entertainment" },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [tickerIndex, setTickerIndex]           = useState(0);
    const pathname = usePathname();

    useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTickerIndex(i => (i + 1) % breakingNews.length);
        }, 4500);
        return () => clearInterval(timer);
    }, []);

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
    });

    return (
        <header className={styles.headerWrapper}>

            {/* ── Tier 1: Breaking Bar ──────────────────── */}
            <div className={styles.breakingBar}>
                <div className={`container ${styles.breakingInner}`}>
                    <div className={styles.breakingLeft}>
                        <span className={styles.breakingBadge}>
                            <Zap size={10} fill="currentColor" />
                            BREAKING
                        </span>
                        <span className={styles.tickerText} key={tickerIndex}>
                            {breakingNews[tickerIndex]}
                        </span>
                        <ChevronRight size={13} className={styles.tickerArrow} />
                    </div>
                    <div className={styles.breakingRight}>
                        <span className={styles.topBarDate}>{today}</span>
                        <span className={styles.topDivider}>|</span>
                        <span className={styles.topLink}>Subscribe</span>
                        <span className={styles.topDivider}>|</span>
                        <span className={styles.topLink}>Sign In</span>
                    </div>
                </div>
            </div>

            {/* ── Tier 2: Masthead ──────────────────────── */}
            <div className={styles.masthead}>
                <div className={`container ${styles.mastheadInner}`}>

                    <div className={styles.logo}>
                        <Link href="/">
                            <div className={styles.logoMark}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 19.5V4.5C4 3.12 5.12 2 6.5 2h11C18.88 2 20 3.12 20 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-11C5.12 22 4 20.88 4 19.5z" fill="#F59E0B"/>
                                    <path d="M8 7h8M8 11h8M8 15h5" stroke="#0D1B2E" strokeWidth="2.2" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <div className={styles.logoText}>
                                <span className={styles.logoTop}>GOSPEL</span>
                                <span className={styles.logoBottom}>NEWS</span>
                            </div>
                        </Link>
                    </div>

                    <div className={styles.mastheadTagline}>
                        Faith &nbsp;·&nbsp; Culture &nbsp;·&nbsp; Community
                    </div>

                    <div className={styles.mastheadActions}>
                        <div className={styles.searchWrap}>
                            <Search size={15} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search stories..."
                                className={styles.searchInput}
                            />
                        </div>
                        <button className={styles.subscribeBtn}>
                            <Bell size={13} />
                            Subscribe Free
                        </button>
                        <button
                            className={styles.mobileMenuBtn}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>

                </div>
            </div>

            {/* ── Tier 3: Nav Bar ───────────────────────── */}
            <nav className={styles.navBar} aria-label="Main navigation">
                <div className={`container ${styles.navInner}`}>
                    <ul className={styles.navLinks}>
                        {navLinks.map(({ href, label }) => {
                            const isActive = href === "/"
                                ? pathname === "/"
                                : pathname?.startsWith(href);
                            return (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className={isActive ? styles.navLinkActive : styles.navLink}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <div className={styles.navRight}>
                        <span className={styles.liveBadge}>
                            <span className={styles.liveDot} />
                            LIVE
                        </span>
                        <span className={styles.liveText}>Sunday Service Stream</span>
                    </div>
                </div>
            </nav>

            {/* ── Mobile Overlay ────────────────────────── */}
            {isMobileMenuOpen && (
                <div className={styles.mobileOverlay}>
                    <div className={styles.mobileSearch}>
                        <Search size={16} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search stories..."
                            className={styles.searchInput}
                        />
                    </div>
                    <nav className={styles.mobileNav}>
                        {navLinks.map(({ href, label }) => {
                            const isActive = href === "/"
                                ? pathname === "/"
                                : pathname?.startsWith(href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ""}`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                    <button className={styles.mobileSubscribeBtn}>
                        Subscribe Now — Free
                    </button>
                </div>
            )}

        </header>
    );
}
