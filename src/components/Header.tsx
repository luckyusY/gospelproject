"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    MagnifyingGlass,
    List,
    X,
    Lightning,
    CaretRight,
    CaretDown,
    BellRinging,
    Radio,
    Play,
    Pause,
} from "@phosphor-icons/react";
import styles from "./Header.module.css";
import ThemeToggle from "./ThemeToggle";
import { useSharedRadio } from "@/hooks/useSharedRadio";
import { FALLBACK_NAV, type NavNode } from "@/lib/nav";

const HEADER_RADIO_STREAM_URL = "https://s11.citrus3.com:8604/stream";

const DEFAULT_TICKER = [
    "Urugero Music Academy yarakoze ibitaramo by'abakunzi b'Imana mu Rwanda",
    "Urugero Online Radio ikomeza guturika n'amajwi y'Imana buri munsi",
    "Urugero Bible Quiz ifungura amashuri n'amatorero mu Rwanda hose",
];

type HeaderProps = {
    radioStreamUrl?: string;
    radioStationName?: string;
    nav?: NavNode[];
    tickerLines?: string[];
};

export default function Header({
    radioStreamUrl = HEADER_RADIO_STREAM_URL,
    radioStationName = "Urugero Online Radio",
    nav,
    tickerLines,
}: HeaderProps) {
    const navLinks = nav && nav.length > 0 ? nav : FALLBACK_NAV;
    const breakingNews = tickerLines && tickerLines.length > 0 ? tickerLines : DEFAULT_TICKER;
    const [isMobileMenuOpen, setIsMobileMenuOpen]       = useState(false);
    const [openMobileSection, setOpenMobileSection]     = useState<string | null>(null);
    const [tickerIndex, setTickerIndex]                 = useState(0);
    const [activeDropdown, setActiveDropdown]           = useState<string | null>(null);
    const pathname  = usePathname();
    const dropTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const radio = useSharedRadio(radioStreamUrl);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { setIsMobileMenuOpen(false); setOpenMobileSection(null); }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const t = setInterval(() => setTickerIndex(i => (i + 1) % breakingNews.length), 4500);
        return () => clearInterval(t);
    }, [breakingNews.length]);

    // Keep the active ticker index in range if the number of lines changes.
    const safeTickerIndex = breakingNews.length ? tickerIndex % breakingNews.length : 0;

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
                            <Lightning size={10} weight="fill" />
                            AMAKURU
                        </span>
                        <span className={styles.tickerText} key={safeTickerIndex}>
                            {breakingNews[safeTickerIndex]}
                        </span>
                        <CaretRight size={13} weight="bold" className={styles.tickerArrow} />
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
                            <Image
                                src="/urugero-media-logo.png"
                                alt="Urugero Gospel News"
                                width={900}
                                height={193}
                                priority
                                className={styles.logoImage}
                            />
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
                            <MagnifyingGlass size={15} weight="bold" className={styles.searchIcon} />
                            <input
                                name="q"
                                type="search"
                                placeholder="Shakisha..."
                                className={styles.searchInput}
                                aria-label="Shakisha urubuga"
                            />
                        </form>
                        <button className={styles.subscribeBtn}>
                            <BellRinging size={14} weight="fill" />
                            Iyandikishe
                        </button>
                        <ThemeToggle />
                        <button
                            type="button"
                            className={styles.mobileRadioToggle}
                            onClick={radio.toggle}
                            aria-label={radio.isPlaying ? "Pause Urugero Online Radio" : "Play Urugero Online Radio"}
                            aria-pressed={radio.isPlaying}
                            title={radio.isPlaying ? "Pause radio" : "Play radio"}
                        >
                            <span className={styles.mobileRadioLive} aria-hidden />
                            {radio.isPlaying
                                ? <Pause size={15} weight="fill" />
                                : <Play size={15} weight="fill" />
                            }
                        </button>
                        <button
                            className={styles.mobileMenuBtn}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen
                                ? <X size={22} weight="bold" />
                                : <List size={22} weight="bold" />
                            }
                        </button>
                    </div>

                </div>
            </div>

            {/* ── Tier 3: Nav Bar ───────────────────────── */}
            <nav className={styles.navBar} aria-label="Main navigation">
                <div className={`container ${styles.navInner}`}>
                    <ul className={styles.navLinks}>
                        {navLinks.map(({ href, label, children, isMega }) => {
                            const isActive = href === "/"
                                ? pathname === "/"
                                : pathname?.startsWith(href);
                            const isOpen  = activeDropdown === href;
                            const hasChildren = children.length > 0;

                            return (
                                <li
                                    key={href}
                                    className={styles.navItem}
                                    onMouseEnter={() => hasChildren && openDrop(href)}
                                    onMouseLeave={() => hasChildren && closeDrop()}
                                >
                                    <Link
                                        href={href}
                                        className={isActive ? styles.navLinkActive : styles.navLink}
                                    >
                                        {label}
                                        {hasChildren && (
                                            <CaretDown
                                                size={11}
                                                weight="bold"
                                                className={`${styles.navChevron} ${isOpen ? styles.navChevronOpen : ""}`}
                                            />
                                        )}
                                    </Link>

                                    {hasChildren && isOpen && (
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
                        <button
                            type="button"
                            className={styles.radioToggle}
                            onClick={radio.toggle}
                            aria-label={radio.isPlaying ? "Pause Urugero Online Radio" : "Play Urugero Online Radio"}
                            aria-pressed={radio.isPlaying}
                            title={radio.isPlaying ? "Pause radio" : "Play radio"}
                        >
                            {radio.isPlaying
                                ? <Pause size={12} weight="fill" />
                                : <Play size={12} weight="fill" />
                            }
                        </button>
                        <span className={styles.liveBadge}>
                            <Radio size={11} weight="fill" className={styles.liveDot} />
                            LIVE
                        </span>
                        <span className={styles.liveText}>
                            {radio.isFallback
                                ? "Fallback music"
                                : radio.status === "error"
                                    ? "Radio iri kugerageza"
                                    : radioStationName}
                        </span>
                    </div>
                </div>
            </nav>

            {/* ── Mobile Overlay ────────────────────────── */}
            {isMobileMenuOpen && (
                <div className={styles.mobileOverlay}>
                    <form
                        action="/search"
                        method="GET"
                        className={styles.mobileSearch}
                        role="search"
                    >
                        <MagnifyingGlass size={16} weight="bold" className={styles.searchIcon} />
                        <input
                            name="q"
                            type="search"
                            placeholder="Shakisha..."
                            className={styles.searchInput}
                            aria-label="Shakisha urubuga"
                        />
                    </form>
                    <nav className={styles.mobileNav}>
                        {navLinks.map(({ href, label, children }) => {
                            const isActive = href === "/"
                                ? pathname === "/"
                                : pathname?.startsWith(href);
                            const isOpen = openMobileSection === href;
                            const hasChildren = children.length > 0;

                            return (
                                <div key={href} className={styles.mobileNavSection}>
                                    <div className={styles.mobileNavRow}>
                                        <Link
                                            href={href}
                                            className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ""}`}
                                        >
                                            {label}
                                        </Link>
                                        {hasChildren && (
                                            <button
                                                className={styles.mobileExpandBtn}
                                                onClick={() => setOpenMobileSection(isOpen ? null : href)}
                                                aria-label={`Expand ${label}`}
                                            >
                                                <CaretDown
                                                    size={16}
                                                    weight="bold"
                                                    style={{
                                                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                                        transition: "transform 0.2s",
                                                    }}
                                                />
                                            </button>
                                        )}
                                    </div>
                                    {hasChildren && isOpen && (
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
