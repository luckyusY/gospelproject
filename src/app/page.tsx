import Link from "next/link";
import styles from "./page.module.css";
import { PlayCircle, Calendar, ArrowRight } from "lucide-react";

const categories = [
    { name: "Byose",        active: true  },
    { name: "Abahanzi",     color: "#DC2626" },
    { name: "Amakorali",    color: "#1E40AF" },
    { name: "Amatorero",    color: "#059669" },
    { name: "Ibitaramo",    color: "#7C3AED" },
    { name: "Ubuhamya",     color: "#F59E0B" },
    { name: "Urubyiruko",   color: "#0D1B2E" },
];

const latestStories = [
    {
        id: 1,
        category: "Abahanzi",
        categoryColor: "#DC2626",
        title: "Umuhanzi Mushya Yatangije Indirimbo Yuzuyemo Ubuhamya",
        excerpt: "Indirimbo nshya yavuzweho n'abantu benshi mu Rwanda, igaragaza ubuhamya bw'umuhanzi wagize ibihe bikomeye mu buzima.",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop",
        author: "Urugero Media",
        readTime: "5 min",
    },
    {
        id: 2,
        category: "Inyigisho",
        categoryColor: "#1E40AF",
        title: "Inyigisho ku Gukunda Imana: Amateka ya Yobu",
        excerpt: "Inyigisho nziza ku gitabo cya Yobu igaragaza uburyo twashobora kwizera Imana no mu bihe bikomeye.",
        image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop",
        author: "Pasteri wa Urugero",
        readTime: "8 min",
    },
    {
        id: 3,
        category: "Ibitaramo",
        categoryColor: "#7C3AED",
        title: "Ibitaramo by'Urugero Byakuye Abantu 5,000 i Kigali",
        excerpt: "Ibitaramo by'indirimbo z'Imana byabaye i Kigali byakusanyije abantu benshi basingiwe n'Imana.",
        image: "https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=800&auto=format&fit=crop",
        author: "Urugero Events",
        readTime: "4 min",
    },
    {
        id: 4,
        category: "Ubuhamya",
        categoryColor: "#059669",
        title: "Ubuhamya: Imana Yankoranije Mu Bihe Bikomeye",
        excerpt: "Umukrisitu asangira ubuhamya bwe bw'uburwayi bwagira akamaro ko kumwibutsa ingufu z'Imana.",
        image: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=800&auto=format&fit=crop",
        author: "Urugero Ubuhamya",
        readTime: "6 min",
    },
    {
        id: 5,
        category: "Amakorali",
        categoryColor: "#D97706",
        title: "Amakorali 10 Azwi Cyane Mu Rwanda Muri 2025",
        excerpt: "Reba urutonde rw'amakorali azwi cyane mu Rwanda ari hafi kurekura indirimbo nshya.",
        image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800&auto=format&fit=crop",
        author: "Urugero Music",
        readTime: "7 min",
    },
    {
        id: 6,
        category: "Urubyiruko",
        categoryColor: "#0D1B2E",
        title: "Urubyiruko rw'u Rwanda Ruriyongera mu Bikorwa by'Imana",
        excerpt: "Urubyiruko rwinshi rwarinjiye mu bikorwa by'Imana bigaragaza ko Itorero rikura mu Rwanda.",
        image: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=800&auto=format&fit=crop",
        author: "Urugero Youth",
        readTime: "5 min",
    },
];

export default function Home() {
    return (
        <div className={styles.page}>

            {/* ── Categories Strip ──────────────────────── */}
            <section className={styles.categoriesStrip}>
                <div className="container">
                    <div className={styles.categoriesRow}>
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                className={`${styles.categoryPill} ${cat.active ? styles.categoryPillActive : ""}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Hero Section ──────────────────────────── */}
            <section className={`container ${styles.heroSection}`}>
                <div className={styles.heroGrid}>

                    <div className={styles.mainStories}>
                        <div
                            className={styles.featuredStory}
                            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=1400&auto=format&fit=crop)" }}
                        >
                            <div className={styles.featuredOverlay}>
                                <span className="tag">Inkuru Nkuru</span>
                                <h1 className={styles.featuredTitle}>
                                    Urugero Media Group: Ijwi ry&apos;Imana mu Rwanda no ku Isi Yose
                                </h1>
                                <p className={styles.featuredExcerpt}>
                                    Urugero Media Group ikomeza gusakaza ubuhamya, inyigisho n&apos;imyidagaduro y&apos;Imana binyuze mu Music Academy, Films, Records, Online Radio na Podcast.
                                </p>
                                <div className={styles.featuredMeta}>
                                    <span>Na Urugero Media</span>
                                    <span>•</span>
                                    <span>6 min</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.subStories}>
                            <div
                                className={styles.subStory}
                                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop)" }}
                            >
                                <div className={styles.subOverlay}>
                                    <span className="tag tag-blue">Inyigisho</span>
                                    <h3 className={styles.subTitle}>Ubuzima bw&apos;Umwuka mu Gihe cya Tekinoloji</h3>
                                </div>
                            </div>
                            <div
                                className={styles.subStory}
                                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=800&auto=format&fit=crop)" }}
                            >
                                <div className={styles.subOverlay}>
                                    <span className="tag tag-gold">Urubyiruko</span>
                                    <h3 className={styles.subTitle}>Urubyiruko Rw&apos;u Rwanda mu Bikorwa by&apos;Imana 2025</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className={styles.sidebar}>

                        <div className={styles.widget}>
                            <div className={styles.widgetHead}>
                                <Calendar size={16} className={styles.widgetIcon} />
                                <h3>Ibitaramo Bizaza</h3>
                                <Link href="/amakuru/ibitaramo" className={styles.viewAll}>REBA BYOSE</Link>
                            </div>
                            <ul className={styles.eventList}>
                                {[
                                    { month: "MEI", day: "10", title: "Urugero Worship Night",      sub: "Kigali Arena • 18:00" },
                                    { month: "JUN", day: "07", title: "Iminsi ya Bible Quiz",        sub: "IPRC Kigali • 9:00 AM" },
                                    { month: "JUL", day: "20", title: "Urugero Music Academy Show", sub: "Amahoro Stadium • 15:00" },
                                ].map((event) => (
                                    <li key={event.title} className={styles.eventItem}>
                                        <div className={styles.eventDate}>
                                            <span className={styles.eventMonth}>{event.month}</span>
                                            <span className={styles.eventDay}>{event.day}</span>
                                        </div>
                                        <div>
                                            <h4 className={styles.eventTitle}>{event.title}</h4>
                                            <p className={styles.eventSub}>{event.sub}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.newsletterWidget}>
                            <div className={styles.newsletterIcon}>📖</div>
                            <h3>Inyigisho za buri Cyumweru</h3>
                            <p>Yandikisha kuri Urugero kugira ngo ubone inyigisho n&apos;amakuru y&apos;Imana buri cyumweru.</p>
                            <form className={styles.newsletterForm}>
                                <input type="email" placeholder="Emeyili yawe" required />
                                <button type="button" className="btn btn-accent">Iyandikishe — Kubuntu</button>
                            </form>
                        </div>

                    </aside>

                </div>
            </section>

            {/* ── Verse of the Day ──────────────────────── */}
            <section className={styles.verseSection}>
                <div className={styles.verseQuoteMark}>&ldquo;</div>
                <div className={styles.verseInner}>
                    <span className={styles.verseBadge}>IJAMBO RY&apos;UMUNSI</span>
                    <blockquote className={styles.verseText}>
                        Kuko nzi imigambi ndimo ndibanza kuri wewe, ni Uhoraho uvuga, imigambi y&apos;amahoro si iy&apos;ibibazo, kugira ngo nkuhe amaherezo n&apos;icyiringiro.
                    </blockquote>
                    <cite className={styles.verseRef}>— Yeremiya 29:11</cite>
                    <div className={styles.verseActions}>
                        <button className={styles.verseBtnOutline}>Sangira Ijambo</button>
                        <button className={styles.verseBtnSolid}>Soma Igice</button>
                    </div>
                </div>
            </section>

            {/* ── Latest Stories ────────────────────────── */}
            <section className={`container ${styles.latestSection}`}>
                <div className={styles.latestHeader}>
                    <h2 className="section-title" style={{ marginBottom: 0 }}>Inkuru Nshya</h2>
                    <Link href="/amakuru" className={styles.seeAllLink}>
                        Reba Inkuru Zose <ArrowRight size={15} />
                    </Link>
                </div>
                <div className={styles.storiesGrid}>
                    {latestStories.map((story) => (
                        <article key={story.id} className={styles.storyCard}>
                            <div
                                className={styles.storyCardImg}
                                style={{ backgroundImage: `url(${story.image})` }}
                            />
                            <div className={styles.storyCardBody}>
                                <span
                                    className={styles.storyCardTag}
                                    style={{ backgroundColor: story.categoryColor }}
                                >
                                    {story.category}
                                </span>
                                <h3 className={styles.storyCardTitle}>{story.title}</h3>
                                <p className={styles.storyCardExcerpt}>{story.excerpt}</p>
                                <div className={styles.storyCardMeta}>
                                    <span>{story.author}</span>
                                    <span>{story.readTime}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* ── Multimedia Testimonies ────────────────── */}
            <section className={`container ${styles.testimonySection}`}>
                <div className={styles.testimonyHeader}>
                    <PlayCircle size={24} className={styles.sectionIcon} />
                    <h2 className="section-title" style={{ marginBottom: 0 }}>Ubuhamya bw&apos;Abaturage</h2>
                    <div className={styles.sliderBtns}>
                        <button className={styles.sliderBtn} aria-label="Previous">&lt;</button>
                        <button className={styles.sliderBtn} aria-label="Next">&gt;</button>
                    </div>
                </div>

                <div className={styles.testimonyGrid}>
                    {[
                        {
                            img:   "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
                            title: "Urugendo rw'Gukira",
                            desc:  "Reba ubuhamya bw'uwakijijwe n'Imana mu burwayi bukomeye.",
                            hasPlay: true,
                        },
                        {
                            img:   "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
                            title: "Imana Yangaragarije Inzira",
                            desc:  "Ubuhamya bw'umusore wabonetse inzira y'Imana nyuma y'ibihe bikomeye.",
                            hasPlay: true,
                        },
                        {
                            img:   "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
                            title: "Twizerana Hamwe",
                            desc:  "Umuryango usangira ubuhamya bw'ubumwe mu itorero no mu muryango.",
                            hasPlay: false,
                        },
                    ].map((t) => (
                        <div key={t.title} className={styles.testimonyCard}>
                            <div
                                className={styles.videoThumb}
                                style={{ backgroundImage: `url(${t.img})` }}
                            >
                                <div className={styles.videoOverlay} />
                                {t.hasPlay && (
                                    <button className={styles.playBtn} aria-label="Play video">
                                        <PlayCircle size={44} fill="white" stroke="#0D1B2E" />
                                    </button>
                                )}
                            </div>
                            <div className={styles.testimonyBody}>
                                <h3>{t.title}</h3>
                                <p>{t.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
