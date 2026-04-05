import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import styles from "./events.module.css";
import { Search, MapPin, Grid, Video, ChevronDown } from "lucide-react";

export const metadata: Metadata = buildMeta({
    title:       "Ibitaramo",
    description: "Shakisha ibitaramo bya Gikrisitu mu Rwanda — ibiganiro, ibitaramo by'indirimbo, amakonferansi n'ibindi.",
    path:        "/events",
});

const events = [
    {
        img:    "https://images.unsplash.com/photo-1540039155732-6114b09ec4d5?q=80&w=800&auto=format&fit=crop",
        month:  "MEI", day: "10",
        tag:    "AMAKONFERANSI", tagColor: "#DC2626",
        icon:   <MapPin size={14} />,
        venue:  "Kigali Arena, Kigali",
        title:  "Urugero Worship Night 2025",
        excerpt:"Ijoro ry'indirimbo z'Imana n'ubuhamya, ryakusanyije abantu bose b'Imana mu Rwanda.",
        price:  "Kubuntu", priceColor: "#16a34a",
        btnLabel: "Iyandikishe", btnClass: "btn btn-accent",
    },
    {
        img:    "https://images.unsplash.com/photo-1516280440508-3a1ecf92b76b?q=80&w=800&auto=format&fit=crop",
        month:  "JUN", day: "07",
        tag:    "IBITARAMO BY'INDIRIMBO", tagColor: "#7C3AED",
        icon:   <Video size={14} />,
        venue:  "Online — Live kuri Urugero TV",
        title:  "Iminsi ya Urugero Bible Quiz",
        excerpt:"Ibibazo bya Bibiliya birimo amashuri n'amatorero yo mu Rwanda yose.",
        price:  "Kubuntu", priceColor: "#16a34a",
        btnLabel: "Reba Live", btnClass: "btn btn-outline",
    },
    {
        img:    "https://images.unsplash.com/photo-1470229722913-7c090be5c5a4?q=80&w=800&auto=format&fit=crop",
        month:  "JUL", day: "20",
        tag:    "IMIKORERE", tagColor: "#F59E0B",
        icon:   <MapPin size={14} />,
        venue:  "Amahoro Stadium, Kigali",
        title:  "Urugero Music Academy Annual Show",
        excerpt:"Ibitaramo by'abanyeshuri ba Urugero Music Academy bisangira ibyo bize n'itorero.",
        price:  "Kubuntu", priceColor: "#16a34a",
        btnLabel: "Iyandikishe", btnClass: "btn btn-accent",
    },
    {
        img:    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop",
        month:  "AGO", day: "15",
        tag:    "URUBYIRUKO", tagColor: "#059669",
        icon:   <MapPin size={14} />,
        venue:  "IPRC Kigali",
        title:  "Urugero Youth Revival Night",
        excerpt:"Ijoro ry'urubyiruko rw'Imana — indirimbo, ubuhamya n'inyigisho zigenewe urubyiruko.",
        price:  "Kubuntu", priceColor: "#16a34a",
        btnLabel: "Iyandikishe", btnClass: "btn btn-outline",
    },
    {
        img:    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
        month:  "SEP", day: "06",
        tag:    "ABAGORE", tagColor: "#DC2626",
        icon:   <MapPin size={14} />,
        venue:  "Hôtel des Mille Collines, Kigali",
        title:  "Urugero Women of Faith Summit",
        excerpt:"Amakonferansi y'abagore b'Imana — inganji, inyigisho n'ubuhamya bw'abagore b'Ubukristu.",
        price:  "RWF 5,000", priceColor: "var(--navy)",
        btnLabel: "Gura Tiketi", btnClass: "btn btn-accent",
    },
    {
        img:    "https://images.unsplash.com/photo-1511522851441-2b6d51bbd811?q=80&w=800&auto=format&fit=crop",
        month:  "DEC", day: "25",
        tag:    "NOHELI", tagColor: "#DC2626",
        icon:   <MapPin size={14} />,
        venue:  "Amatorero yose mu Rwanda",
        title:  "Urugero Christmas Celebration",
        excerpt:"Twiyishime hamwe mu Noheli — indirimbo, ibitaramo n'ubuhamya mu mateka y'ivuka rya Yesu.",
        price:  "Kubuntu", priceColor: "#16a34a",
        btnLabel: "Reba Amatorero", btnClass: "btn btn-outline",
    },
];

export default function EventsPage() {
    return (
        <div className={styles.page}>

            {/* ── Hero ──────────────────────────────────── */}
            <section
                className={styles.heroSection}
                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=1600&auto=format&fit=crop)" }}
            >
                <div className={styles.heroOverlay}>
                    <div className="container">
                        <h1 className={styles.heroTitle}>Ibitaramo bya Urugero</h1>
                        <p className={styles.heroDescription}>
                            Shakisha ibitaramo bya Gikrisitu mu Rwanda — iminsi yo gusingiza,
                            amakonferansi, Bible Quiz n&apos;ibindi.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Search ────────────────────────────────── */}
            <section className={styles.searchSection}>
                <div className="container">
                    <div className={styles.searchBox}>
                        <div className={styles.searchInputGroup}>
                            <Search className={styles.searchIcon} size={18} />
                            <input
                                type="text"
                                placeholder="Shakisha ibitaramo, abahanzi, aho bibera…"
                                className={styles.searchInput}
                            />
                        </div>
                        <div className={styles.searchDivider} />
                        <div className={styles.searchInputGroup}>
                            <MapPin className={styles.searchIcon} size={18} />
                            <input type="text" placeholder="Aho bibera" className={styles.searchInput} />
                        </div>
                        <div className={styles.searchDivider} />
                        <div className={styles.searchSelectGroup}>
                            <Grid className={styles.searchIcon} size={18} />
                            <select className={styles.searchSelect}>
                                <option>Ubwoko bwose</option>
                                <option>Amakonferansi</option>
                                <option>Ibitaramo by&apos;indirimbo</option>
                                <option>Bible Quiz</option>
                                <option>Urubyiruko</option>
                            </select>
                        </div>
                        <button className={`btn btn-primary ${styles.searchBtn}`}>Shakisha</button>
                    </div>

                    <div className={styles.tagsContainer}>
                        <button className={`${styles.filterTag} ${styles.tagActive}`}>Byose</button>
                        <button className={styles.filterTag}>Iki cyumweru</button>
                        <button className={styles.filterTag}>Kubuntu</button>
                        <button className={styles.filterTag}>Online</button>
                        <button className={styles.filterTag}>Umuryango</button>
                    </div>
                </div>
            </section>

            {/* ── Events Grid ───────────────────────────── */}
            <section className={`container ${styles.eventsContainer}`}>
                <div className={styles.eventsGrid}>
                    {events.map((ev) => (
                        <article key={ev.title} className={styles.eventCard}>
                            <div
                                className={styles.eventImage}
                                style={{ backgroundImage: `url(${ev.img})` }}
                            >
                                <div className={styles.dateBadge}>
                                    <span className={styles.badgeMonth}>{ev.month}</span>
                                    <span className={styles.badgeDay}>{ev.day}</span>
                                </div>
                                <span className="tag" style={{ backgroundColor: ev.tagColor }}>
                                    {ev.tag}
                                </span>
                            </div>
                            <div className={styles.eventContent}>
                                <div className={styles.eventMeta}>
                                    {ev.icon}
                                    <span>{ev.venue}</span>
                                </div>
                                <h2 className={styles.eventTitle}>{ev.title}</h2>
                                <p className={styles.eventExcerpt}>{ev.excerpt}</p>
                                <div className={styles.eventFooter}>
                                    <div className={styles.eventPrice}>
                                        <span className={styles.priceLabel}>Kwinjira</span>
                                        <span className={styles.priceValue} style={{ color: ev.priceColor }}>
                                            {ev.price}
                                        </span>
                                    </div>
                                    <button className={ev.btnClass}>{ev.btnLabel}</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className={styles.loadMoreContainer}>
                    <button className={`btn btn-outline ${styles.loadMoreBtn}`}>
                        Reba Ibitaramo Byinshi <ChevronDown size={16} />
                    </button>
                </div>
            </section>

        </div>
    );
}
