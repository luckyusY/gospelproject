"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Globe, ChevronDown, Menu, X } from "lucide-react";
import styles from "./Header.module.css";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Close menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerContainer}`}>
                <div className={styles.logo}>
                    <Link href="/">
                        <span className={styles.logoIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 19.5V4.5C4 3.11929 5.11929 2 6.5 2H17.5C18.8807 2 20 3.11929 20 4.5V19.5C20 20.8807 18.8807 22 17.5 22H6.5C5.11929 22 4 20.8807 4 19.5Z" fill="#2563eb" />
                                <path d="M8 7H16M8 11H16M8 15H12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </span>
                        <span className={styles.logoText}>GOSPEL<br />NEWS</span>
                    </Link>
                </div>

                <nav className={styles.desktopNav}>
                    <ul className={styles.navLinks}>
                        <li><Link href="/" className={pathname === "/" ? styles.active : ""}>Home</Link></li>
                        <li><Link href="/news" className={pathname?.startsWith("/news") ? styles.active : ""}>Trending News</Link></li>
                        <li><Link href="/study" className={pathname?.startsWith("/study") ? styles.active : ""}>Bible Study</Link></li>
                        <li><Link href="/life" className={pathname?.startsWith("/life") ? styles.active : ""}>Christian Life</Link></li>
                        <li><Link href="/events" className={pathname?.startsWith("/events") ? styles.active : ""}>Events</Link></li>
                        <li><Link href="/entertainment" className={pathname?.startsWith("/entertainment") ? styles.active : ""}>Entertainment</Link></li>
                    </ul>
                </nav>

                <div className={styles.actions}>
                    <div className={styles.searchBar}>
                        <Search className={styles.searchIcon} size={18} />
                        <input type="text" placeholder="Search stories..." className={styles.searchInput} />
                    </div>
                    <button className={`btn btn-primary ${styles.subscribeBtnDesktop}`}>Subscribe</button>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}></div>
                    </div>
                    <button className={styles.mobileMenuBtn} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className={styles.mobileMenuOverlay}>
                    <div className={styles.mobileSearch}>
                        <Search className={styles.searchIcon} size={18} />
                        <input type="text" placeholder="Search stories..." className={styles.searchInput} />
                    </div>
                    <nav className={styles.mobileNav}>
                        <ul className={styles.mobileNavLinks}>
                            <li><Link href="/" className={pathname === "/" ? styles.activeMobile : ""}>Home</Link></li>
                            <li><Link href="/news" className={pathname?.startsWith("/news") ? styles.activeMobile : ""}>Trending News</Link></li>
                            <li><Link href="/study" className={pathname?.startsWith("/study") ? styles.activeMobile : ""}>Bible Study</Link></li>
                            <li><Link href="/life" className={pathname?.startsWith("/life") ? styles.activeMobile : ""}>Christian Life</Link></li>
                            <li><Link href="/events" className={pathname?.startsWith("/events") ? styles.activeMobile : ""}>Events</Link></li>
                            <li><Link href="/entertainment" className={pathname?.startsWith("/entertainment") ? styles.activeMobile : ""}>Entertainment</Link></li>
                        </ul>
                    </nav>
                    <div className={styles.mobileFooter}>
                        <button className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>Subscribe</button>
                        <div className={styles.mobileUser}>
                            <div className={styles.avatar}></div>
                            <span style={{ fontWeight: 600 }}>My Account</span>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
