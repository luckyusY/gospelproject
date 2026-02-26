import Link from "next/link";
import { Globe, Megaphone, Share2, Smartphone } from "lucide-react";
import styles from "./Footer.module.css";

const stats = [
    { value: "15K+",  label: "Subscribers" },
    { value: "500+",  label: "Stories Published" },
    { value: "50+",   label: "Countries Reached" },
    { value: "100+",  label: "Events Covered" },
];

export default function Footer() {
    return (
        <footer className={styles.footer}>

            {/* ── Pre-footer stats bar ───────────────────── */}
            <div className={styles.statsBar}>
                <div className={`container ${styles.statsInner}`}>
                    {stats.map((s) => (
                        <div key={s.label} className={styles.statItem}>
                            <span className={styles.statValue}>{s.value}</span>
                            <span className={styles.statLabel}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Main footer ───────────────────────────── */}
            <div className={`container ${styles.footerContainer}`}>
                <div className={styles.grid}>

                    {/* Brand column */}
                    <div className={styles.brandCol}>
                        <div className={styles.logo}>
                            <div className={styles.logoIcon}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 19.5V4.5C4 3.12 5.12 2 6.5 2h11C18.88 2 20 3.12 20 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-11C5.12 22 4 20.88 4 19.5z" fill="#F59E0B"/>
                                    <path d="M8 7h8M8 11h8M8 15h5" stroke="#0D1B2E" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <span className={styles.logoText}>GOSPELNEWS</span>
                        </div>
                        <p className={styles.description}>
                            Bringing light to the world through uplifting stories, faith-based news, and spiritual guidance for the modern era.
                        </p>
                        <div className={styles.socialIcons}>
                            <button className={styles.socialBtn} aria-label="Website"><Globe size={17} /></button>
                            <button className={styles.socialBtn} aria-label="Announcements"><Megaphone size={17} /></button>
                            <button className={styles.socialBtn} aria-label="Share"><Share2 size={17} /></button>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className={styles.linksCol}>
                        <h4 className={styles.columnTitle}>Categories</h4>
                        <ul>
                            <li><Link href="/news">Latest News</Link></li>
                            <li><Link href="/study">Bible Study Tips</Link></li>
                            <li><Link href="/life">Christian Living</Link></li>
                            <li><Link href="/youth">Youth Ministry</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className={styles.linksCol}>
                        <h4 className={styles.columnTitle}>Resources</h4>
                        <ul>
                            <li><Link href="/devotionals">Daily Devotionals</Link></li>
                            <li><Link href="/directory">Church Directory</Link></li>
                            <li><Link href="/prayer">Prayer Requests</Link></li>
                            <li><Link href="/podcast">Podcast</Link></li>
                        </ul>
                    </div>

                    {/* App download */}
                    <div className={styles.downloadCol}>
                        <h4 className={styles.columnTitle}>Mobile App</h4>
                        <p className={styles.appDescription}>
                            Read your favourite gospel news anywhere. Available on iOS and Android.
                        </p>
                        <button className={styles.appBtn}>
                            <Smartphone size={20} />
                            <div className={styles.appBtnText}>
                                <span>Download on the</span>
                                <strong>App Store</strong>
                            </div>
                        </button>
                        <button className={`${styles.appBtn} ${styles.appBtnAlt}`}>
                            <Smartphone size={20} />
                            <div className={styles.appBtnText}>
                                <span>Get it on</span>
                                <strong>Google Play</strong>
                            </div>
                        </button>
                    </div>

                </div>

                <div className={styles.bottomBar}>
                    <p>&copy; {new Date().getFullYear()} Gospel News. All rights reserved.</p>
                    <div className={styles.bottomLinks}>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                        <Link href="/contact">Contact Us</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
