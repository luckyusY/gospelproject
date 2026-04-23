"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarBlank, ArrowRight, Sparkle } from "@phosphor-icons/react";
import styles from "./page.module.css";
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

const categories = [
    { name: "Byose" },
    { name: "Abahanzi",   color: "#DC2626" },
    { name: "Amakorali",  color: "#1E40AF" },
    { name: "Amatorero",  color: "#059669" },
    { name: "Ibitaramo",  color: "#7C3AED" },
    { name: "Ubuhamya",   color: "#F59E0B" },
    { name: "Urubyiruko", color: "#0D1B2E" },
];

const latestStories = [
    {
        id: 1,
        category: "Abahanzi", categoryColor: "#DC2626",
        title:   "Umuhanzi Mushya Yatangije Indirimbo Yuzuyemo Ubuhamya",
        excerpt: "Indirimbo nshya yavuzweho n'abantu benshi mu Rwanda, igaragaza ubuhamya bw'umuhanzi wagize ibihe bikomeye mu buzima.",
        image:   "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
        author:  "Urugero Media", readTime: "5 min",
    },
    {
        id: 2,
        category: "Inyigisho", categoryColor: "#1E40AF",
        title:   "Inyigisho ku Gukunda Imana: Amateka ya Yobu",
        excerpt: "Inyigisho nziza ku gitabo cya Yobu igaragaza uburyo twashobora kwizera Imana no mu bihe bikomeye.",
        image:   "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop",
        author:  "Pasteri wa Urugero", readTime: "8 min",
    },
    {
        id: 3,
        category: "Ibitaramo", categoryColor: "#7C3AED",
        title:   "Ibitaramo by'Urugero Byakuye Abantu 5,000 i Kigali",
        excerpt: "Ibitaramo by'indirimbo z'Imana byabaye i Kigali byakusanyije abantu benshi basingiwe n'Imana.",
        image:   "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800&auto=format&fit=crop",
        author:  "Urugero Events", readTime: "4 min",
    },
    {
        id: 4,
        category: "Ubuhamya", categoryColor: "#059669",
        title:   "Ubuhamya: Imana Yankoranije Mu Bihe Bikomeye",
        excerpt: "Umukrisitu asangira ubuhamya bwe bw'uburwayi bwagira akamaro ko kumwibutsa ingufu z'Imana.",
        image:   "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=800&auto=format&fit=crop",
        author:  "Urugero Ubuhamya", readTime: "6 min",
    },
    {
        id: 5,
        category: "Amakorali", categoryColor: "#D97706",
        title:   "Amakorali 10 Azwi Cyane Mu Rwanda Muri 2025",
        excerpt: "Reba urutonde rw'amakorali azwi cyane mu Rwanda ari hafi kurekura indirimbo nshya.",
        image:   "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=800&auto=format&fit=crop",
        author:  "Urugero Music", readTime: "7 min",
    },
    {
        id: 6,
        category: "Urubyiruko", categoryColor: "#0D1B2E",
        title:   "Urubyiruko rw'u Rwanda Ruriyongera mu Bikorwa by'Imana",
        excerpt: "Urubyiruko rwinshi rwarinjiye mu bikorwa by'Imana bigaragaza ko Itorero rikura mu Rwanda.",
        image:   "https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=800&auto=format&fit=crop",
        author:  "Urugero Youth", readTime: "5 min",
    },
];

const featuredVideos = [
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

const upcomingEvents = [
    { month: "MEI", day: "10", title: "Urugero Worship Night",      subtitle: "Kigali Arena • 18:00" },
    { month: "JUN", day: "07", title: "Iminsi ya Bible Quiz",        subtitle: "IPRC Kigali • 9:00 AM" },
    { month: "JUL", day: "20", title: "Urugero Music Academy Show",  subtitle: "Amahoro Stadium • 15:00" },
];

export default function Home() {
    const [activeCategory, setActiveCategory] = useState("Byose");

    const filtered = activeCategory === "Byose"
        ? latestStories
        : latestStories.filter(s => s.category === activeCategory);

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
                        <motion.div
                            className={styles.featuredStory}
                            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?q=80&w=1400&auto=format&fit=crop)" }}
                            role="img"
                            aria-label="Inkuru Nkuru: Urugero Media Group"
                            variants={scaleIn}
                        >
                            <motion.div
                                className={styles.featuredOverlay}
                                variants={staggerContainer}
                            >
                                <span className="tag">Inkuru Nkuru</span>
                                <motion.h1 className={styles.featuredTitle} variants={heroTitle}>
                                    Urugero Media Group: Ijwi ry&apos;Imana mu Rwanda no ku Isi Yose
                                </motion.h1>
                                <motion.p className={styles.featuredExcerpt} variants={fadeUp}>
                                    Urugero Media Group ikomeza gusakaza ubuhamya, inyigisho n&apos;imyidagaduro y&apos;Imana binyuze mu Music Academy, Films, Records, Online Radio na Podcast.
                                </motion.p>
                                <motion.div className={styles.featuredMeta} variants={fadeUp}>
                                    <span>Na Urugero Media</span>
                                    <span>•</span>
                                    <span>6 min</span>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        <div className={styles.subStories}>
                            <motion.div
                                className={styles.subStory}
                                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1445375011782-2384686778a0?q=80&w=800&auto=format&fit=crop)" }}
                                variants={fadeLeft}
                            >
                                <div className={styles.subOverlay}>
                                    <span className="tag tag-blue">Inyigisho</span>
                                    <h3 className={styles.subTitle}>Ubuzima bw&apos;Umwuka mu Gihe cya Tekinoloji</h3>
                                </div>
                            </motion.div>
                            <motion.div
                                className={styles.subStory}
                                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=800&auto=format&fit=crop)" }}
                                variants={fadeUp}
                            >
                                <div className={styles.subOverlay}>
                                    <span className="tag tag-gold">Urubyiruko</span>
                                    <h3 className={styles.subTitle}>Urubyiruko Rw&apos;u Rwanda mu Bikorwa by&apos;Imana 2025</h3>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Sidebar */}
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
                                {upcomingEvents.map((ev) => (
                                    <li key={ev.title}>
                                        <EventMini
                                            month={ev.month}
                                            day={ev.day}
                                            title={ev.title}
                                            subtitle={ev.subtitle}
                                            href="/events"
                                        />
                                    </li>
                                ))}
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
                                <button type="submit" className="btn btn-accent">Iyandikishe — Kubuntu</button>
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
                                href={`/amakuru/${story.category.toLowerCase()}`}
                                category={story.category}
                                categoryColor={story.categoryColor}
                                title={story.title}
                                excerpt={story.excerpt}
                                image={story.image}
                                author={story.author}
                                readTime={story.readTime}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ── Featured Videos — Worship & Testimony ─── */}
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
                    {featuredVideos.map((v, i) => (
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
