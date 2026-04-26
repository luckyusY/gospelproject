"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarBlank, ArrowRight, Sparkle } from "@phosphor-icons/react";
import styles from "../page.module.css";
import { ArticleCard, CategoryPill, QuoteBlock, YoutubeEmbed } from "@/components/ui";
import { EventMini } from "@/components/ui/EventCard";
import FadeIn from "@/components/ui/FadeIn";
import {
    staggerContainer,
    fadeUp,
    fadeLeft,
    scaleIn,
    heroTitle,
} from "@/lib/animations";
import type { ArticleRow, EventRow } from "@/types/database";

const FALLBACK_HERO   = "https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?q=80&w=1400&auto=format&fit=crop";
const FALLBACK_SUB1   = "https://images.unsplash.com/photo-1445375011782-2384686778a0?q=80&w=800&auto=format&fit=crop";
const FALLBACK_SUB2   = "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=800&auto=format&fit=crop";
const FALLBACK_CARD   = "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop";
const MONTH_LABELS: string[] = ["JAN","FEV","MAR","APR","MEI","JUN","JUL","AGO","SEP","OKT","NOV","DES"];

const FEATURED_VIDEOS = [
    {
        videoId:     "ZiCmBIyALYA",
        title:       "Sinzarakaza — Gloire Ishimwe (Official Video)",
        description: "Indirimbo y'indirimbo z'Imana zizwi cyane mu Rwanda. Sinzarakaza igaragaza kwizera no gutura Imana.",
    },
    {
        videoId:     "9DRBNLfOlYY",
        title:       "Way Maker — Sinach (Live Worship)",
        description: "Indirimbo y'impanda izimanye isi yose igaragaza ubushobozi bw'Imana mu buzima bwacu.",
    },
    {
        videoId:     "6Arbdu1BWKU",
        title:       "Amazing Grace (My Chains Are Gone) — Chris Tomlin",
        description: "Indirimbo yo gutuza imitima igaragaza ubuntu bw'Imana no gukizwa kwacu.",
    },
];

const EVENTS_FALLBACK = [
    { month: "MEI", day: "10", title: "Urugero Worship Night",      subtitle: "Kigali Arena • 18:00" },
    { month: "JUN", day: "07", title: "Iminsi ya Bible Quiz",        subtitle: "IPRC Kigali • 9:00 AM" },
    { month: "JUL", day: "20", title: "Urugero Music Academy Show",  subtitle: "Amahoro Stadium • 15:00" },
];

type Props = {
    featured:     ArticleRow | null;
    subStories:   ArticleRow[];      // first two non-featured articles (for hero sub-panels)
    gridStories:  ArticleRow[];      // all non-featured articles for the grid
    events:       EventRow[];
};

export default function HomeClient({ featured, subStories, gridStories, events }: Props) {

    // Build category list from real articles
    const uniqueCats = Array.from(new Set(gridStories.map(a => a.category)));
    const categories = [{ name: "Byose" }, ...uniqueCats.map(c => ({ name: c }))];

    const [activeCategory, setActiveCategory] = useState("Byose");

    const filtered = activeCategory === "Byose"
        ? gridStories
        : gridStories.filter(s => s.category === activeCategory);

    const sub1 = subStories[0] ?? null;
    const sub2 = subStories[1] ?? null;

    return (
        <div className={styles.page}>

            {/* ── Categories Strip ──────────────────────── */}
            <FadeIn direction="down" duration={0.4}>
                <section className={styles.categoriesStrip} aria-label="Inzego z'amakuru">
                    <div className="container">
                        <div className={styles.categoriesRow}>
                            {categories.map((cat) => (
                                <CategoryPill
                                    key={cat.name}
                                    label={cat.name}
                                    active={activeCategory === cat.name}
                                    onClick={() => setActiveCategory(cat.name)}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </FadeIn>

            {/* ── Hero Section ──────────────────────────── */}
            <section className={`container ${styles.heroSection}`} aria-label="Inkuru Nkuru">
                <div className={styles.heroGrid}>

                    <motion.div
                        className={styles.mainStories}
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* ── Main featured story */}
                        <Link href={featured ? `/amakuru/${featured.slug}` : "/amakuru"}>
                            <motion.div
                                className={styles.featuredStory}
                                style={{
                                    backgroundImage: `url(${featured?.image_url ?? FALLBACK_HERO})`,
                                }}
                                role="img"
                                aria-label={`Inkuru Nkuru: ${featured?.title ?? "Urugero Media"}`}
                                variants={scaleIn}
                            >
                                <motion.div
                                    className={styles.featuredOverlay}
                                    variants={staggerContainer}
                                >
                                    <span className="tag">Inkuru Nkuru</span>
                                    <motion.h1 className={styles.featuredTitle} variants={heroTitle}>
                                        {featured?.title ?? "Urugero Media Group: Ijwi ry'Imana mu Rwanda no ku Isi Yose"}
                                    </motion.h1>
                                    <motion.p className={styles.featuredExcerpt} variants={fadeUp}>
                                        {featured?.excerpt ?? "Urugero Media Group ikomeza gusakaza ubuhamya, inyigisho n'imyidagaduro y'Imana binyuze mu Music Academy, Films, Records, Online Radio na Podcast."}
                                    </motion.p>
                                    <motion.div className={styles.featuredMeta} variants={fadeUp}>
                                        <span>Na {featured?.author ?? "Urugero Media"}</span>
                                        <span>•</span>
                                        <span>{featured?.read_time ?? "5 min"}</span>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </Link>

                        {/* ── Sub-stories */}
                        <div className={styles.subStories}>
                            <Link href={sub1 ? `/amakuru/${sub1.slug}` : "/amakuru"}>
                                <motion.div
                                    className={styles.subStory}
                                    style={{ backgroundImage: `url(${sub1?.image_url ?? FALLBACK_SUB1})` }}
                                    variants={fadeLeft}
                                >
                                    <div className={styles.subOverlay}>
                                        <span className="tag tag-blue">{sub1?.category ?? "Inyigisho"}</span>
                                        <h3 className={styles.subTitle}>
                                            {sub1?.title ?? "Ubuzima bw'Umwuka mu Gihe cya Tekinoloji"}
                                        </h3>
                                    </div>
                                </motion.div>
                            </Link>

                            <Link href={sub2 ? `/amakuru/${sub2.slug}` : "/amakuru"}>
                                <motion.div
                                    className={styles.subStory}
                                    style={{ backgroundImage: `url(${sub2?.image_url ?? FALLBACK_SUB2})` }}
                                    variants={fadeUp}
                                >
                                    <div className={styles.subOverlay}>
                                        <span className="tag tag-gold">{sub2?.category ?? "Urubyiruko"}</span>
                                        <h3 className={styles.subTitle}>
                                            {sub2?.title ?? "Urubyiruko Rw'u Rwanda mu Bikorwa by'Imana 2025"}
                                        </h3>
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    </motion.div>

                    {/* ── Sidebar */}
                    <motion.aside
                        className={styles.sidebar}
                        aria-label="Sidebar"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className={styles.widget}>
                            <div className={styles.widgetHead}>
                                <CalendarBlank size={16} weight="fill" className={styles.widgetIcon} aria-hidden />
                                <h2>Ibitaramo Bizaza</h2>
                                <Link href="/amakuru/ibitaramo" className={styles.viewAll} aria-label="Reba ibitaramo byose">
                                    REBA BYOSE
                                </Link>
                            </div>
                            <ul className={styles.eventList} role="list">
                                {events.length > 0
                                    ? events.map((ev) => {
                                        const d     = new Date(ev.event_date);
                                        const month = MONTH_LABELS[d.getMonth()] ?? "---";
                                        const day   = String(d.getDate()).padStart(2, "0");
                                        return (
                                            <li key={ev.id}>
                                                <EventMini
                                                    month={month}
                                                    day={day}
                                                    title={ev.title}
                                                    subtitle={ev.location}
                                                    href={`/events/${ev.slug}`}
                                                />
                                            </li>
                                        );
                                    })
                                    : EVENTS_FALLBACK.map((ev) => (
                                        <li key={ev.title}>
                                            <EventMini
                                                month={ev.month}
                                                day={ev.day}
                                                title={ev.title}
                                                subtitle={ev.subtitle}
                                                href="/events"
                                            />
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>

                        <div className={styles.newsletterWidget}>
                            <div className={styles.newsletterIcon} aria-hidden>📖</div>
                            <h2>Inyigisho za buri Cyumweru</h2>
                            <p>Yandikisha kuri Urugero kugira ngo ubone inyigisho n&apos;amakuru y&apos;Imana buri cyumweru.</p>
                            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Emeyili yawe"
                                    required
                                    aria-label="Emeyili yawe yo kwiyandikisha"
                                />
                                <button type="submit" className="btn btn-accent">
                                    Iyandikishe — Kubuntu
                                </button>
                            </form>
                        </div>
                    </motion.aside>
                </div>
            </section>

            {/* ── Verse of the Day ──────────────────────── */}
            <FadeIn direction="scale">
                <QuoteBlock
                    badge="IJAMBO RY'UMUNSI"
                    quote="Kuko nzi imigambi ndimo ndibanza kuri wewe, ni Uhoraho uvuga, imigambi y'amahoro si iy'ibibazo, kugira ngo nkuhe amaherezo n'icyiringiro."
                    reference="— Yeremiya 29:11"
                />
            </FadeIn>

            {/* ── Latest Stories ────────────────────────── */}
            <section className={`container ${styles.latestSection}`} aria-label="Inkuru Nshya">
                <FadeIn direction="up">
                    <div className={styles.latestHeader}>
                        <div className={styles.sectionTitleWrap}>
                            <Sparkle size={18} weight="fill" className={styles.sectionIcon} aria-hidden />
                            <h2 className="section-title" style={{ marginBottom: 0 }}>Inkuru Nshya</h2>
                        </div>
                        <Link href="/amakuru" className={styles.seeAllLink} aria-label="Reba inkuru zose">
                            Reba Inkuru Zose <ArrowRight size={15} weight="bold" aria-hidden />
                        </Link>
                    </div>
                </FadeIn>

                <motion.div
                    className={styles.storiesGrid}
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.05 }}
                >
                    {filtered.map((story, i) => (
                        <motion.div key={story.id} variants={fadeUp} custom={i}>
                            <ArticleCard
                                href={`/amakuru/${story.slug}`}
                                category={story.category}
                                categoryColor={story.category_color}
                                title={story.title}
                                excerpt={story.excerpt}
                                image={story.image_url ?? FALLBACK_CARD}
                                author={story.author}
                                readTime={story.read_time}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ── Featured Videos ───────────────────────── */}
            <section className={`container ${styles.videoSection}`} aria-label="Amashusho y'Indirimbo n'Ubuhamya">
                <FadeIn direction="up">
                    <div className={styles.latestHeader}>
                        <div className={styles.sectionTitleWrap}>
                            <span className={styles.sectionEmoji} aria-hidden>🎵</span>
                            <h2 className="section-title" style={{ marginBottom: 0 }}>
                                Indirimbo z&apos;Imana — Ibiganiro
                            </h2>
                        </div>
                        <Link href="/urugero-tv-radio" className={styles.seeAllLink} aria-label="Reba amashusho yose">
                            Urugero TV <ArrowRight size={15} weight="bold" aria-hidden />
                        </Link>
                    </div>
                </FadeIn>

                <motion.div
                    className={styles.videoGrid}
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {FEATURED_VIDEOS.map((v, i) => (
                        <motion.div key={v.videoId} variants={fadeUp} custom={i}>
                            <YoutubeEmbed
                                videoId={v.videoId}
                                title={v.title}
                                description={v.description}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </section>

        </div>
    );
}
