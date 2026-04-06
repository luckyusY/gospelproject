"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    YoutubeLogo,
    InstagramLogo,
    FacebookLogo,
    TwitterLogo,
    DeviceMobile,
    Headphones,
} from "@phosphor-icons/react";
import NewsletterForm from "./NewsletterForm";
import styles from "./Footer.module.css";
import { staggerContainer, fadeUp, fadeLeft } from "@/lib/animations";

const stats = [
    { value: "15K+",  label: "Abiyandikishije" },
    { value: "500+",  label: "Amakuru Atangajwe" },
    { value: "8+",    label: "Serivisi za Media" },
    { value: "100+",  label: "Ibitaramo Byakozwe" },
];

const socialLinks = [
    { icon: YoutubeLogo,   label: "YouTube",   href: "https://youtube.com" },
    { icon: FacebookLogo,  label: "Facebook",   href: "https://facebook.com" },
    { icon: InstagramLogo, label: "Instagram",  href: "https://instagram.com" },
    { icon: TwitterLogo,   label: "Twitter / X", href: "https://twitter.com" },
];

export default function Footer() {
    return (
        <footer className={styles.footer}>

            {/* ── Pre-footer stats bar ───────────────────── */}
            <motion.div
                className={styles.statsBar}
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <div className={`container ${styles.statsInner}`}>
                    {stats.map((s) => (
                        <motion.div
                            key={s.label}
                            className={styles.statItem}
                            variants={fadeUp}
                        >
                            <span className={styles.statValue}>{s.value}</span>
                            <span className={styles.statLabel}>{s.label}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* ── Main footer ───────────────────────────── */}
            <div className={`container ${styles.footerContainer}`}>
                <motion.div
                    className={styles.grid}
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {/* Brand column */}
                    <motion.div className={styles.brandCol} variants={fadeLeft}>
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
                            {socialLinks.map(({ icon: Icon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialBtn}
                                    aria-label={label}
                                >
                                    <Icon size={18} weight="fill" />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Amakuru */}
                    <motion.div className={styles.linksCol} variants={fadeUp}>
                        <h4 className={styles.columnTitle}>Amakuru</h4>
                        <ul>
                            <li><Link href="/amakuru/abahanzi">Abahanzi</Link></li>
                            <li><Link href="/amakuru/amakorali">Amakorali</Link></li>
                            <li><Link href="/amakuru/amatorero">Amatorero</Link></li>
                            <li><Link href="/amakuru/ibitaramo">Ibitaramo</Link></li>
                            <li><Link href="/amakuru/hanze-yu-rwanda">Hanze y&apos;u Rwanda</Link></li>
                        </ul>
                    </motion.div>

                    {/* Inyigisho */}
                    <motion.div className={styles.linksCol} variants={fadeUp}>
                        <h4 className={styles.columnTitle}>Inyigisho</h4>
                        <ul>
                            <li><Link href="/inyigisho/umuryango">Umuryango</Link></li>
                            <li><Link href="/inyigisho/urubyiruko">Urubyiruko</Link></li>
                            <li><Link href="/inyigisho/bible-quiz">Bible Quiz</Link></li>
                            <li><Link href="/tumenye-bibiliya">Tumenye Bibiliya</Link></li>
                            <li><Link href="/ubuhamya">Ubuhamya</Link></li>
                        </ul>
                    </motion.div>

                    {/* Urugero Media Group */}
                    <motion.div className={styles.downloadCol} variants={fadeUp}>
                        <h4 className={styles.columnTitle}>Urugero Media Group</h4>
                        <p className={styles.appDescription}>
                            Serivisi zacu zirimo: Music Academy, Films, Records, Online Radio, Bible Quiz, Practice Room na Podcast.
                        </p>
                        <Link href="/urugero-tv-radio" className={styles.appBtn}>
                            <Headphones size={20} weight="fill" />
                            <div className={styles.appBtnText}>
                                <span>Reba kuri</span>
                                <strong>Urugero TV &amp; Radio</strong>
                            </div>
                        </Link>
                        <Link href="/abo-turibo" className={`${styles.appBtn} ${styles.appBtnAlt}`}>
                            <DeviceMobile size={20} weight="fill" />
                            <div className={styles.appBtnText}>
                                <span>Tugere kuri</span>
                                <strong>Abo Turibo</strong>
                            </div>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Newsletter strip */}
                <div className={styles.newsletterStrip}>
                    <div className={styles.newsletterText}>
                        <h3 className={styles.newsletterTitle}>Iyandikishe ku makuru</h3>
                        <p className={styles.newsletterDesc}>Akamaro ka buri cyumweru kuri imeyili yawe. Nta makuru azabura.</p>
                    </div>
                    <NewsletterForm variant="inline" />
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
