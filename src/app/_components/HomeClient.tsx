"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarBlank, ArrowRight, Sparkle } from "@phosphor-icons/react";
import styles from "../page.module.css";
import { ArticleCard, CategoryPill, QuoteBlock, YoutubeEmbed } from "@/components/ui";
import { EventMini } from "@/components/ui/EventCard";
import AdSlot from "@/components/AdSlot";
import FadeIn from "@/components/ui/FadeIn";
import LiveRadioPlayer from "@/components/LiveRadioPlayer";
import {
    staggerContainer,
    fadeUp,
    fadeLeft,
    scaleIn,
    heroTitle,
} from "@/lib/animations";
import type { ArticleRow, EventRow, CategoryRow } from "@/types/database";
import {
    DEFAULT_RADIO_STREAM_URL,
    defaultsAsSettingsMap,
    type SiteSettingsMap,
} from "@/lib/siteSettings";

const FALLBACK_HERO   = "https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?q=80&w=1400&auto=format&fit=crop";
const FALLBACK_SUB1   = "https://images.unsplash.com/photo-1445375011782-2384686778a0?q=80&w=800&auto=format&fit=crop";
const FALLBACK_SUB2   = "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=800&auto=format&fit=crop";
const FALLBACK_CARD   = "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop";
const MONTH_LABELS: string[] = ["JAN","FEV","MAR","APR","MEI","JUN","JUL","AGO","SEP","OKT","NOV","DES"];

const FEATURED_VIDEOS = [
    {
        videoId:     "u5TFSRPjUdE",
        title:       "Amakuru mashya ya Gospel yo ku mugoroba",
        description: "Amakuru ya Gospel yo mu Rwanda, Uganda no mu karere kuri Urugero Gospel News TV.",
    },
    {
        videoId:     "a1IfX2-RIrk",
        title:       "Ibaruwa ifunguye: ubutumwa bwa Murokore",
        description: "Ikiganiro cya Urugero TV ku bahanzi, ubuzima bwa Gospel n'ibivugwa mu bakunzi b'umuziki.",
    },
    {
        videoId:     "j2mcUosjKKc",
        title:       "Ibyahishwe: Vestine na Dorcas",
        description: "Ikiganiro gisesengura amakuru ya Gospel n'ibitekerezo by'abakunzi ba Urugero TV & Radio.",
    },
    {
        videoId:     "BlhLoe_YYP4",
        title:       "Ibaruwa ifunguye ivuye ku mutima",
        description: "Ikiganiro cyubaka ku rukundo, umuryango n'ubuzima bwa buri munsi.",
    },
    {
        videoId:     "yhK2yce8kfs",
        title:       "Ibiganiro bya Gospel na Sport",
        description: "Amakuru n'ibiganiro byo kuri Urugero TV & Radio Official.",
    },
    {
        videoId:     "hdcWJLKejn0",
        title:       "Inshundura Sports News",
        description: "Amakuru ya sport n'ibivugwa mu mikino kuri Urugero TV.",
    },
];

const EVENTS_FALLBACK = [
    { month: "MEI", day: "10", title: "Urugero Worship Night",      subtitle: "Kigali Arena • 18:00" },
    { month: "JUN", day: "07", title: "Iminsi ya Bible Quiz",        subtitle: "IPRC Kigali • 9:00 AM" },
    { month: "JUL", day: "20", title: "Urugero Music Academy Show",  subtitle: "Amahoro Stadium • 15:00" },
];

const BANNER_AD_SLIDES = [
    {
        imageUrl: "/ads/urugero-tv-banner.png",
        href: "/urugero-tv-radio",
        title: "Urugero TV videos",
        badge: "Urugero TV",
        headline: "Amashusho mashya",
        description: "Ibiganiro, ubuhamya, sport n'amakuru ya Gospel kuri YouTube.",
        cta: "Reba videos",
    },
];

const SQUARE_AD_SLIDES = [
    {
        imageUrl: "/ads/urugero-media-square.png",
        href: "/inyigisho/bible-quiz",
        title: "Urugero Bible Quiz",
        badge: "Bible Quiz",
        headline: "Inyigisho zubaka",
        description: "Tumenye Bibiliya n'ibiganiro byubaka umuryango.",
        cta: "Tangira",
    },
];

function adImage(imageUrl: string | undefined, fallback: string) {
    if (!imageUrl) return fallback;

    const oldSvgMap: Record<string, string> = {
        "/ads/urugero-live-radio-banner.svg": "/ads/urugero-live-radio-banner.png",
        "/ads/urugero-gospel-news-square.svg": "/ads/urugero-media-square.png",
        "/ads/urugero-tv-banner.svg": "/ads/urugero-tv-banner.png",
        "/ads/urugero-bible-quiz-square.svg": "/ads/urugero-media-square.png",
    };

    return oldSvgMap[imageUrl] ?? imageUrl;
}

type CatMeta = Pick<CategoryRow, "slug" | "name" | "color">;

type Props = {
    featured:     ArticleRow | null;
    subStories:   ArticleRow[];      // first two non-featured articles (for hero sub-panels)
    gridStories:  ArticleRow[];      // all non-featured articles for the grid
    events:       EventRow[];
    categories:   CatMeta[];         // from the categories table (proper display names)
    settings:     SiteSettingsMap;
};

export default function HomeClient({ featured, subStories, gridStories, events, categories, settings }: Props) {

    // Only show category pills for categories that actually have articles in the grid
    const activeSlugs = new Set(gridStories.map(a => a.category));
    const catPills = [
        { slug: "byose", name: "Byose" },
        ...categories
            .filter(c => activeSlugs.has(c.slug))
            .map(c => ({ slug: c.slug, name: c.name })),
    ];

    const [activeCategory, setActiveCategory] = useState("byose");

    const filtered = activeCategory === "byose"
        ? gridStories
        : gridStories.filter(s => s.category === activeCategory);

    const sub1 = subStories[0] ?? null;
    const sub2 = subStories[1] ?? null;
    const defaultSettings = defaultsAsSettingsMap();
    const radioStreamUrl = settings.radio_stream_url ?? DEFAULT_RADIO_STREAM_URL;
    const radioStationName = settings.radio_station_name ?? defaultSettings.radio_station_name ?? "Urugero Live Radio";

    return (
        <div className={styles.page}>

            {/* ── Categories Strip ──────────────────────── */}
            <FadeIn direction="down" duration={0.4}>
                <section className={styles.categoriesStrip} aria-label="Inzego z'amakuru">
                    <div className="container">
                        <div className={styles.categoriesRow}>
                            {catPills.map((cat) => (
                                <CategoryPill
                                    key={cat.slug}
                                    label={cat.name}
                                    active={activeCategory === cat.slug}
                                    onClick={() => setActiveCategory(cat.slug)}
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

                        <LiveRadioPlayer
                            streamUrl={radioStreamUrl}
                            stationName={radioStationName}
                            compact
                        />

                        <AdSlot
                            imageUrl={adImage(settings.ad_home_sidebar_image ?? defaultSettings.ad_home_sidebar_image, "/ads/urugero-media-square.png")}
                            href={settings.ad_home_sidebar_link ?? defaultSettings.ad_home_sidebar_link ?? "/contact"}
                            title="Kwamamaza kuri Urugero Media"
                            variant="square"
                            badge="Kwamamaza"
                            headline="Urugero Gospel News"
                            description="Amakuru, radio, sport n'ibiganiro bya Gospel."
                            cta="Menya byinshi"
                            slides={SQUARE_AD_SLIDES}
                        />

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
            <div className={`container ${styles.homeAd}`}>
                <AdSlot
                    imageUrl={adImage(settings.ad_home_top_image ?? defaultSettings.ad_home_top_image, "/ads/urugero-live-radio-banner.png")}
                    href={settings.ad_home_top_link ?? defaultSettings.ad_home_top_link ?? "/urugero-tv-radio"}
                    title="Urugero Live Radio"
                    badge="Live Radio"
                    headline="Urugero Online Radio"
                    description="Indirimbo z'Imana, inyigisho, amakuru na gahunda za buri munsi."
                    cta="Umva nonaha"
                    slides={BANNER_AD_SLIDES}
                />
            </div>

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
