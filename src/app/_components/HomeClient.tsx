"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarBlank, ArrowRight, Sparkle, Quotes } from "@phosphor-icons/react";
import styles from "../page.module.css";
import { ArticleCard, CategoryPill, QuoteBlock, YoutubeEmbed } from "@/components/ui";
import { EventMini } from "@/components/ui/EventCard";
import AdSlot from "@/components/AdSlot";
import FadeIn from "@/components/ui/FadeIn";
import LiveRadioPlayer from "@/components/LiveRadioPlayer";
import RadioEmbed from "@/components/RadioEmbed";
import ExternalEmbed from "@/components/ExternalEmbed";
import StoriesSlider from "@/components/StoriesSlider";
import NewsletterWidget from "./NewsletterWidget";
import {
    staggerContainer,
    fadeUp,
} from "@/lib/animations";
import type {
    ArticleRow,
    EventRow,
    CategoryRow,
    TestimonyRow,
    VideoRow,
    HomepageSectionRow,
} from "@/types/database";
import {
    DEFAULT_RADIO_STREAM_URL,
    defaultsAsSettingsMap,
    type SiteSettingsMap,
} from "@/lib/siteSettings";

const FALLBACK_CARD   = "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop";
const MONTH_LABELS: string[] = ["JAN","FEV","MAR","APR","MEI","JUN","JUL","AGO","SEP","OKT","NOV","DES"];

// Fallback videos used only when the `videos` table is empty.
const FALLBACK_VIDEOS: Pick<VideoRow, "youtube_id" | "title" | "description">[] = [
    { youtube_id: "u5TFSRPjUdE", title: "Amakuru mashya ya Gospel yo ku mugoroba", description: "Amakuru ya Gospel yo mu Rwanda, Uganda no mu karere kuri Urugero Gospel News TV." },
    { youtube_id: "a1IfX2-RIrk", title: "Ibaruwa ifunguye: ubutumwa bwa Murokore",  description: "Ikiganiro cya Urugero TV ku bahanzi, ubuzima bwa Gospel n'ibivugwa mu bakunzi b'umuziki." },
    { youtube_id: "j2mcUosjKKc", title: "Ibyahishwe: Vestine na Dorcas",            description: "Ikiganiro gisesengura amakuru ya Gospel n'ibitekerezo by'abakunzi ba Urugero TV & Radio." },
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

function personInitial(name: string) {
    return name.trim().charAt(0).toUpperCase() || "U";
}

type CatMeta = Pick<CategoryRow, "slug" | "name" | "color" | "nav_group">;

type Props = {
    heroStories:  ArticleRow[];      // top stories for the hero slideshow
    gridStories:  ArticleRow[];      // all non-featured articles for the grid
    events:       EventRow[];
    testimonies:  TestimonyRow[];
    videos:       VideoRow[];
    sections:     HomepageSectionRow[];   // toggle + order for the homepage sections
    categories:   CatMeta[];         // from the categories table (proper display names)
    settings:     SiteSettingsMap;
};

// Sections that flow vertically and can be reordered/toggled from the admin.
const FLOW_KEYS = ["verse", "latest", "testimonies", "videos"] as const;
type FlowKey = (typeof FLOW_KEYS)[number];

export default function HomeClient({ heroStories, gridStories, events, testimonies, videos, sections, categories, settings }: Props) {

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

    const defaultSettings = defaultsAsSettingsMap();
    const radioStreamUrl = settings.radio_stream_url ?? DEFAULT_RADIO_STREAM_URL;
    const radioStationName = settings.radio_station_name ?? defaultSettings.radio_station_name ?? "Urugero Live Radio";
    const radioEmbedUrl = (settings.radio_embed_url ?? "").trim();

    const verseText = settings.verse_text ?? defaultSettings.verse_text ?? "";
    const verseRef  = settings.verse_reference ?? defaultSettings.verse_reference ?? "";
    const homepageEmbedTitle = settings.homepage_embed_title ?? defaultSettings.homepage_embed_title ?? "";
    const homepageEmbedUrl = (settings.homepage_embed_url ?? defaultSettings.homepage_embed_url ?? "").trim();

    const videoList = videos.length > 0 ? videos : FALLBACK_VIDEOS;
    const categoryBasePaths = Object.fromEntries(
        categories.map((category) => {
            const basePath = category.nav_group === "inyigisho"
                ? "/inyigisho"
                : category.nav_group === "tumenye-bibiliya"
                    ? "/tumenye-bibiliya"
                    : category.nav_group === "media-group"
                        ? "/urugero-media-group"
                        : "/amakuru";

            return [category.slug, basePath];
        })
    );

    function articleHref(article: ArticleRow) {
        return `${categoryBasePaths[article.category] ?? "/amakuru"}/${article.slug}`;
    }

    // ── Section visibility + order ──────────────────────────
    const sectionMap = new Map(sections.map(s => [s.key, s]));
    const sectionOn = (key: string) => sectionMap.get(key)?.is_enabled ?? true;

    // Flow blocks rendered in admin-defined order (falls back to natural order).
    const flowOrder: FlowKey[] = sections.length
        ? sections
            .filter(s => (FLOW_KEYS as readonly string[]).includes(s.key) && s.is_enabled)
            .map(s => s.key as FlowKey)
        : [...FLOW_KEYS];

    // ── Block renderers ─────────────────────────────────────
    const renderVerse = () => (
        <FadeIn key="verse" direction="scale">
            <QuoteBlock
                badge="IJAMBO RY'UMUNSI"
                quote={verseText}
                reference={verseRef}
            />
        </FadeIn>
    );

    const renderLatest = () => (
        <div key="latest">
            {/* Banner ad above the latest stories */}
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
                                href={articleHref(story)}
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
        </div>
    );

    const renderTestimonies = () => {
        if (testimonies.length === 0) return null;
        return (
            <section key="testimonies" className={`container ${styles.testimonySection}`} aria-label="Ubuhamya">
                <FadeIn direction="up">
                    <div className={styles.testimonyHeader}>
                        <div className={styles.sectionTitleWrap}>
                            <Quotes size={20} weight="fill" className={styles.sectionIcon} aria-hidden />
                            <h2 className="section-title" style={{ marginBottom: 0 }}>Ubuhamya</h2>
                        </div>
                        <Link href="/ubuhamya" className={styles.seeAllLink} aria-label="Reba ubuhamya bwose">
                            Reba Ubuhamya Bwose <ArrowRight size={15} weight="bold" aria-hidden />
                        </Link>
                    </div>
                </FadeIn>

                <motion.div
                    className={styles.testimonyGrid}
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {testimonies.map((t, i) => (
                        <motion.div key={t.id} variants={fadeUp} custom={i}>
                            <Link href={`/ubuhamya/${t.slug}`} className={styles.testimonyCard} style={{ display: "block" }}>
                                <div
                                    className={styles.storyCardImg}
                                    style={t.image_url ? { backgroundImage: `url(${t.image_url})` } : undefined}
                                    role="img"
                                    aria-label={t.title}
                                />
                                <div className={styles.testimonyBody}>
                                    <h3>{t.title}</h3>
                                    <p>{t.excerpt}</p>
                                    <div className={styles.testimonyPerson}>
                                        <span className={styles.testimonyAvatar} aria-hidden>{personInitial(t.person_name)}</span>
                                        <span className={styles.testimonyPersonName}>{t.person_name}</span>
                                        {t.person_church && <span>· {t.person_church}</span>}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        );
    };

    const renderVideos = () => (
        <section key="videos" className={`container ${styles.videoSection}`} aria-label="Amashusho y'Indirimbo n'Ubuhamya">
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
                {videoList.map((v, i) => (
                    <motion.div key={v.youtube_id} variants={fadeUp} custom={i}>
                        <YoutubeEmbed
                            videoId={v.youtube_id}
                            title={v.title}
                            description={v.description}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );

    const flowRenderers: Record<FlowKey, () => React.ReactNode> = {
        verse: renderVerse,
        latest: renderLatest,
        testimonies: renderTestimonies,
        videos: renderVideos,
    };

    return (
        <div className={styles.page}>

            {/* ── Categories Strip ──────────────────────── */}
            {sectionOn("categories") && (
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
            )}

            {/* ── Hero Section ──────────────────────────── */}
            {sectionOn("hero") && (
                <>
                    <section className={`container ${styles.heroSection}`} aria-label="Inkuru Nkuru">
                        <div className={styles.heroGrid}>

                            <div className={styles.mainStories}>
                                <StoriesSlider stories={heroStories} categoryBasePaths={categoryBasePaths} />
                            </div>

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

                                {radioEmbedUrl ? (
                                    <RadioEmbed
                                        embedUrl={radioEmbedUrl}
                                        stationName={radioStationName}
                                    />
                                ) : (
                                    <LiveRadioPlayer
                                        streamUrl={radioStreamUrl}
                                        stationName={radioStationName}
                                        compact
                                    />
                                )}

                                <NewsletterWidget />
                            </motion.aside>
                        </div>
                    </section>

                    {/* ── After-hero: square ad + newsletter band ── */}
                    <div className={`container ${styles.afterHeroGrid}`}>
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

                        <NewsletterWidget band />
                    </div>
                </>
            )}

            {/* ── Flow sections (verse / latest / testimonies / videos) ── */}
            {flowOrder.flatMap(key => {
                const section = flowRenderers[key]();

                if (key !== "verse" || !homepageEmbedUrl) return [section];

                return [
                    section,
                    <ExternalEmbed
                        key="homepage-embed"
                        title={homepageEmbedTitle}
                        url={homepageEmbedUrl}
                    />,
                ];
            })}

        </div>
    );
}
