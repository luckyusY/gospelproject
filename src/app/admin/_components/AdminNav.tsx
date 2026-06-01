"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../admin.module.css";

const NAV_LINKS = [
    { href: "/admin",             label: "Dashboard",    icon: "📊" },
    { href: "/admin/articles",    label: "Articles",     icon: "📰" },
    { href: "/admin/categories",  label: "Categories",   icon: "🏷️" },
    { href: "/admin/events",      label: "Events",       icon: "📅" },
    { href: "/admin/testimonies", label: "Testimonies",  icon: "🙌" },
    { href: "/admin/media",       label: "Media",        icon: "🎵" },
    { href: "/admin/settings",    label: "Settings",     icon: "⚙️" },
];

function isActive(pathname: string, href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
}

export default function AdminNav({ username }: { username: string }) {
    const pathname = usePathname() ?? "";
    const [open, setOpen] = useState(false);

    // Close the drawer whenever the route changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { setOpen(false); }, [pathname]);

    // Lock body scroll while the mobile drawer is open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    return (
        <>
            {/* Mobile top bar */}
            <div className={styles.mobileBar}>
                <button
                    type="button"
                    className={styles.hamburger}
                    onClick={() => setOpen(v => !v)}
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                >
                    <span /><span /><span />
                </button>
                <div className={styles.mobileBrand}>
                    <span className={styles.logoIcon}>✝</span>
                    <span>Urugero Admin</span>
                </div>
                <Link href="/" className={styles.mobileView} target="_blank" rel="noopener noreferrer">
                    View site ↗
                </Link>
            </div>

            {/* Backdrop (mobile only, when open) */}
            {open && <div className={styles.backdrop} onClick={() => setOpen(false)} aria-hidden />}

            {/* Sidebar / drawer */}
            <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
                <div className={styles.sidebarLogo}>
                    <span className={styles.logoIcon}>✝</span>
                    <div>
                        <p className={styles.logoName}>Urugero Media</p>
                        <p className={styles.logoRole}>Admin: {username}</p>
                    </div>
                </div>

                <nav className={styles.sideNav}>
                    {NAV_LINKS.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.navLink} ${isActive(pathname, link.href) ? styles.navLinkActive : ""}`}
                        >
                            <span aria-hidden>{link.icon}</span> {link.label}
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <a href="/" className={styles.viewSiteLink} target="_blank" rel="noopener noreferrer">
                        ↗ View site
                    </a>
                    <form action="/api/admin/logout" method="POST">
                        <button type="submit" className={styles.logoutBtn}>Log out</button>
                    </form>
                </div>
            </aside>
        </>
    );
}
