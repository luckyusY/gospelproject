"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Zap, ChevronRight, Bell, ChevronDown } from "lucide-react";
import styles from "./Header.module.css";
import ThemeToggle from "./ThemeToggle";

const breakingNews = [
    "Urugero Music Academy yarakoze ibitaramo by'abakunzi b'Imana mu Rwanda",
    "Urugero Online Radio ikomeza guturika n'amajwi y'Imana buri munsi",
    "Urugero Bible Quiz ifungura amashuri n'amatorero mu Rwanda hose",
];

type NavChild = {
    href: string;
    label: string;
    sub?: string[];
};

type NavItem = {
    href: string;
    label: string;
    children?: NavChild[];
};

const navLinks: NavItem[] = [
    { href: "/", label: "Ahabanza" },
    {
        href: "/amakuru",
        label: "Amakuru",
        children: [
            { href: "/amakuru/abahanzi",       label: "Abahanzi" },
            { href: "/amakuru/amakorali",       label: "Amakorali" },
            { href: "/amakuru/amatorero",       label: "Amatorero" },
            { href: "/amakuru/abanyempano",     label: "Abanyempano" },
            { href: "/amakuru/ibitaramo",       label: "Ibitaramo" },
            { href: "/amakuru/hanze-yu-rwanda", label: "Hanze y'u Rwanda" },
        ],
    },
    { href: "/ubuhamya", label: "Ubuhamya" },
    { href: "/ibigwi",   label: "Ibigwi" },
    {
        href: "/inyigisho",
        label: "Inyigisho",
        children: [
            { href: "/inyigisho/umuryango",        label: "Umuryango" },
            { href: "/inyigisho/abana",             label: "Abana" },
            { href: "/inyigisho/urubyiruko",        label: "Urubyiruko" },
            { href: "/inyigisho/abagabo",           label: "Abagabo" },
            { href: "/inyigisho/abagore",           label: "Abagore" },
            { href: "/inyigisho/ubuzima-bwumwuka", label: "Ubuzima bw'Umwuka" },
            { href: "/inyigisho/bible-quiz",        label: "Bible Quiz" },
        ],
    },
    { href: "/tumenye-bibiliya",  label: "Tumenye Bibiliya" },
    { href: "/urugero-tv-radio",  label: "Urugero TV & Radio" },
    {
        href: "/urugero-media-group",
        label: "Urugero Media Group",
        children: [
            { href: "/urugero-media-group/music-academy",  label: "🎵 Urugero Music Academy",  sub: ["Worship training", "Vocal & instruments"] },
            { href: "/urugero-media-group/films",          label: "🎬 Urugero Films",           sub: ["Video Production", "Editing", "Event Coverage", "Documentary"] },
            { href: "/urugero-media-group/records",        label: "🎙️ Urugero Records",         sub: ["Recording", "Music production"] },
            { href: "/urugero-media-group/music-talent",   label: "🌟 Urugero Music Talent",    sub: ["Talent search", "Competitions"] },
            { href: "/urugero-media-group/online-radio",   label: "📻 Urugero Online Radio",    sub: ["Shows", "Music", "Teaching"] },
            { href: "/urugero-media-group/bible-quiz",     label: "📖 Urugero Bible Quiz",      sub: ["Schools", "Churches", "YouTube program"] },
            { href: "/urugero-media-group/practice-room",  label: "🎹 Urugero Practice Room",   sub: ["Rehearsals", "Training", "YouTube sessions"] },
            { href: "/urugero-media-group/podcast",        label: "🎧 Urugero Podcast",         sub: ["Discussions", "Interviews", "Debates"] },
        ],
    },
    { href: "/abo-turibo", label: "Abo Turibo" },
    { href: "/contact",    label: "Contact" },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen]       = useState(false);
    const [openMobileSection, setOpenMobileSection]     = useState<string | null>(null);
    const [tickerIndex, setTickerIndex]                 = useState(0);
    const [activeDropdown, setActiveDropdown]           = useState<string | null>(null);
    const pathname  = usePathname();
    const dropTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { setIsMobileMenuOpen(false); setOpenMobileSection(null); }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const t = setInterval(() => setTickerIndex(i => (i + 1) % breakingNews.length), 4500);
        return () => clearInterval(t);
    }, []);

    const openDrop  = (href: string) => { if (dropTimer.current) clearTimeout(dropTimer.current); setActiveDropdown(href); };
    const closeDrop = ()             => { dropTimer.current = setTimeout(() => setActiveDropdown(null), 150); };

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
                            AMAKURU
                        </span>
                        <span className={styles.tickerText} key={tickerIndex}>
                            {breakingNews[tickerIndex]}
                        </span>
                        <ChevronRight size={13} className={styles.tickerArrow} />
                    </div>
                    <div className={styles.breakingRight}>
                        <span className={styles.topBarDate}>{today}</span>
                        <span className={styles.topDivider}>|</span>
                        <span className={styles.topLink}>Injira</span>
                        <span className={styles.topDivider}>|</span>
                        <span className={styles.topLink}>Iyandikishe</span>
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
                                <span className={styles.logoTop}>URUGERO</span>
                                <span className={styles.logoBottom}>MEDIA</span>
                            </div>
                        </Link>
                    </div>

                    <div className={styles.mastheadTagline}>
                        Ubuhamya &nbsp;·&nbsp; Inyigisho &nbsp;·&nbsp; Imyidagaduro
                    </div>

                    <div className={styles.mastheadActions}>
                        <form
                            action="/search"
                            method="GET"
                            className={styles.searchWrap}
                            role="search"
                        >
                            <Search size={15} className={styles.searchIcon} />
                            <input
                                name="q"
                                type="search"
                                placeholder="Shakisha..."
                                className={styles.searchInput}
                                aria-label="Shakisha urubuga"
                            />
                        </form>
                        <button className={styles.subscribeBtn}>
                            <Bell size={13} />
                            Iyandikishe
                        </button>
                        <ThemeToggle />
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
                        {navLinks.map(({ href, label, children }) => {
                            const isActive = href === "/"
                                ? pathname === "/"
                                : pathname?.startsWith(href);
                            const isOpen  = activeDropdown === href;
                            const isMega  = href === "/urugero-media-group";

                            return (
                                <li
                                    key={href}
                                    className={styles.navItem}
                                    onMouseEnter={() => children && openDrop(href)}
                                    onMouseLeave={() => children && closeDrop()}
                                >
                                    <Link
                                        href={href}
                                        className={isActive ? styles.navLinkActive : styles.navLink}
                                    >
                                        {label}
                                        {children && (
                                            <ChevronDown
                                                size={11}
                                                className={`${styles.navChevron} ${isOpen ? styles.navChevronOpen : ""}`}
                                            />
                                        )}
                                    </Link>

                                    {children && isOpen && (
                                        <div
                                            className={`${styles.dropdown} ${isMega ? styles.megaDropdown : ""}`}
                                            onMouseEnter={() => openDrop(href)}
                                            onMouseLeave={closeDrop}
                                        >
                                            {isMega ? (
                                                <div className={styles.megaGrid}>
                                                    {children.map((child) => (
                                                        <div key={child.href} className={styles.megaItem}>
                                                            <Link href={child.href} className={styles.megaItemTitle}>
                                                                {child.label}
                                                            </Link>
                                                            {child.sub && (
                                                                <ul className={styles.megaSubList}>
                                                                    {child.sub.map(s => <li key={s}>{s}</li>)}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <ul className={styles.dropdownList}>
                                                    {children.map((child) => (
                                                        <li key={child.href}>
                                                            <Link href={child.href} className={styles.dropdownItem}>
                                                                {child.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                    <div className={styles.navRight}>
                        <span className={styles.liveBadge}>
                            <span className={styles.liveDot} />
                            LIVE
                        </span>
                        <span className={styles.liveText}>Urugero Online Radio</span>
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
                            placeholder="Shakisha..."
                            className={styles.searchInput}
                        />
                    </div>
                    <nav className={styles.mobileNav}>
                        {navLinks.map(({ href, label, children }) => {
                            const isActive = href === "/"
                                ? pathname === "/"
                                : pathname?.startsWith(href);
                            const isOpen = openMobileSection === href;

                            return (
                                <div key={href} className={styles.mobileNavSection}>
                                    <div className={styles.mobileNavRow}>
                                        <Link
                                            href={href}
                                            className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ""}`}
                                        >
                                            {label}
                                        </Link>
                                        {children && (
                                            <button
                                                className={styles.mobileExpandBtn}
                                                onClick={() => setOpenMobileSection(isOpen ? null : href)}
                                                aria-label={`Expand ${label}`}
                                            >
                                                <ChevronDown
                                                    size={16}
                                                    style={{
                                                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                                        transition: "transform 0.2s",
                                                    }}
                                                />
                                            </button>
                                        )}
                                    </div>
                                    {children && isOpen && (
                                        <div className={styles.mobileSubMenu}>
                                            {children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className={styles.mobileSubLink}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                    <button className={styles.mobileSubscribeBtn}>
                        Iyandikishe Kubuntu
                    </button>
                </div>
            )}

        </header>
    );
}
