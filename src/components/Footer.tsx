import Link from "next/link";
import { Globe, Megaphone, Share2, Smartphone } from "lucide-react";
import styles from "./Footer.module.css";

const stats = [
    { value: "15K+",  label: "Abiyandikishije" },
    { value: "500+",  label: "Amakuru Atangajwe" },
    { value: "8+",    label: "Serivisi za Media" },
    { value: "100+",  label: "Ibitaramo Byakozwe" },
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
                            <span className={styles.logoText}>URUGERO MEDIA</span>
                        </div>
                        <p className={styles.description}>
                            Urugero Media Group ni itsinda rya media rya Gikrisitu rigabana ubuhamya, inyigisho n&apos;imyidagaduro y&apos;Imana mu Rwanda no ku isi yose.
                        </p>
                        <div className={styles.socialIcons}>
                            <button className={styles.socialBtn} aria-label="Website"><Globe size={17} /></button>
                            <button className={styles.socialBtn} aria-label="Announcements"><Megaphone size={17} /></button>
                            <button className={styles.socialBtn} aria-label="Share"><Share2 size={17} /></button>
                        </div>
                    </div>

                    {/* Amakuru */}
                    <div className={styles.linksCol}>
                        <h4 className={styles.columnTitle}>Amakuru</h4>
                        <ul>
                            <li><Link href="/amakuru/abahanzi">Abahanzi</Link></li>
                            <li><Link href="/amakuru/amakorali">Amakorali</Link></li>
                            <li><Link href="/amakuru/amatorero">Amatorero</Link></li>
                            <li><Link href="/amakuru/ibitaramo">Ibitaramo</Link></li>
                            <li><Link href="/amakuru/hanze-yu-rwanda">Hanze y&apos;u Rwanda</Link></li>
                        </ul>
                    </div>

                    {/* Inyigisho */}
                    <div className={styles.linksCol}>
                        <h4 className={styles.columnTitle}>Inyigisho</h4>
                        <ul>
                            <li><Link href="/inyigisho/umuryango">Umuryango</Link></li>
                            <li><Link href="/inyigisho/urubyiruko">Urubyiruko</Link></li>
                            <li><Link href="/inyigisho/bible-quiz">Bible Quiz</Link></li>
                            <li><Link href="/tumenye-bibiliya">Tumenye Bibiliya</Link></li>
                            <li><Link href="/ubuhamya">Ubuhamya</Link></li>
                        </ul>
                    </div>

                    {/* Urugero Media Group */}
                    <div className={styles.downloadCol}>
                        <h4 className={styles.columnTitle}>Urugero Media Group</h4>
                        <p className={styles.appDescription}>
                            Serivisi zacu zirimo: Music Academy, Films, Records, Online Radio, Bible Quiz, Practice Room na Podcast.
                        </p>
                        <button className={styles.appBtn}>
                            <Smartphone size={20} />
                            <div className={styles.appBtnText}>
                                <span>Reba kuri</span>
                                <strong>Urugero TV & Radio</strong>
                            </div>
                        </button>
                        <button className={`${styles.appBtn} ${styles.appBtnAlt}`}>
                            <Smartphone size={20} />
                            <div className={styles.appBtnText}>
                                <span>Tugere kuri</span>
                                <strong>Abo Turibo</strong>
                            </div>
                        </button>
                    </div>

                </div>

                <div className={styles.bottomBar}>
                    <p>&copy; {new Date().getFullYear()} Urugero Media Group. Uburenganzira bwose bwifashishijwe.</p>
                    <div className={styles.bottomLinks}>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Amategeko</Link>
                        <Link href="/abo-turibo">Abo Turibo</Link>
                        <Link href="/contact">Twandikire</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
