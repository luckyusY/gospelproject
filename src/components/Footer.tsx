import Link from "next/link";
import { Globe, Megaphone, Share2, Disc } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>
                <div className={styles.grid}>
                    <div className={styles.brandCol}>
                        <div className={styles.logo}>
                            <span className={styles.logoIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 19.5V4.5C4 3.11929 5.11929 2 6.5 2H17.5C18.8807 2 20 3.11929 20 4.5V19.5C20 20.8807 18.8807 22 17.5 22H6.5C5.11929 22 4 20.8807 4 19.5Z" fill="white" />
                                    <path d="M8 7H16M8 11H16M8 15H12" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </span>
                            <span className={styles.logoText}>GOSPELNEWS</span>
                        </div>
                        <p className={styles.description}>
                            Bringing light to the world through uplifting stories, faith-based news, and spiritual guidance for the modern era.
                        </p>
                        <div className={styles.socialIcons}>
                            <button className={styles.socialBtn}><Globe size={18} /></button>
                            <button className={styles.socialBtn}><Megaphone size={18} /></button>
                            <button className={styles.socialBtn}><Share2 size={18} /></button>
                        </div>
                    </div>

                    <div className={styles.linksCol}>
                        <h4 className={styles.columnTitle}>Categories</h4>
                        <ul>
                            <li><Link href="/news">Latest News</Link></li>
                            <li><Link href="/study">Bible Study Tips</Link></li>
                            <li><Link href="/life">Christian Living</Link></li>
                            <li><Link href="/youth">Youth Ministry</Link></li>
                        </ul>
                    </div>

                    <div className={styles.linksCol}>
                        <h4 className={styles.columnTitle}>Resources</h4>
                        <ul>
                            <li><Link href="/devotionals">Daily Devotionals</Link></li>
                            <li><Link href="/directory">Church Directory</Link></li>
                            <li><Link href="/prayer">Prayer Requests</Link></li>
                            <li><Link href="/podcast">Podcast</Link></li>
                        </ul>
                    </div>

                    <div className={styles.downloadCol}>
                        <h4 className={styles.columnTitle}>Mobile App</h4>
                        <p className={styles.appDescription}>
                            Read your favorite gospel news anywhere. Available on iOS and Android.
                        </p>
                        <button className={styles.appBtn}>
                            <Disc size={20} />
                            <div className={styles.appBtnText}>
                                <span>Download on the</span>
                                <strong>App Store</strong>
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
