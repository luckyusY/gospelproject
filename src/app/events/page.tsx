import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/metadata";
import { supabase } from "@/lib/supabase";
import type { EventRow } from "@/types/database";
import styles from "./events.module.css";
import { Search, MapPin, Grid } from "lucide-react";

export const metadata: Metadata = buildMeta({
    title:       "Ibitaramo",
    description: "Shakisha ibitaramo bya Gikrisitu mu Rwanda — ibiganiro, ibitaramo by'indirimbo, amakonferansi n'ibindi.",
    path:        "/events",
});

// Revalidate so newly published events show without a full rebuild.
export const revalidate = 60;

const MONTHS_RW = ["MUT", "GAS", "WER", "MAT", "GIC", "KAM", "NYA", "KAN", "NZE", "UKW", "UGU", "UKB"];

export default async function EventsPage() {
    const { data } = await supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .order("event_date", { ascending: true });
    const events = (data ?? []) as EventRow[];

    // Server component renders per-request; current time is stable within a render.
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const upcoming = events.filter(e => new Date(e.event_date).getTime() >= now);
    const past = events.filter(e => new Date(e.event_date).getTime() < now).reverse();
    const ordered = [...upcoming, ...past];

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

            {/* ── Search (decorative quick links) ──────────── */}
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
                </div>
            </section>

            {/* ── Events Grid ───────────────────────────── */}
            <section className={`container ${styles.eventsContainer}`}>
                {ordered.length > 0 ? (
                    <div className={styles.eventsGrid}>
                        {ordered.map((ev) => {
                            const d = new Date(ev.event_date);
                            const month = MONTHS_RW[d.getMonth()] ?? "";
                            const day = String(d.getDate()).padStart(2, "0");
                            return (
                                <Link key={ev.id} href={`/events/${ev.slug}`} className={styles.eventCard}>
                                    <div
                                        className={styles.eventImage}
                                        style={ev.image_url ? { backgroundImage: `url(${ev.image_url})` } : undefined}
                                    >
                                        <div className={styles.dateBadge}>
                                            <span className={styles.badgeMonth}>{month}</span>
                                            <span className={styles.badgeDay}>{day}</span>
                                        </div>
                                        {ev.tag && (
                                            <span className="tag" style={{ backgroundColor: "#B80000" }}>
                                                {ev.tag}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.eventContent}>
                                        <div className={styles.eventMeta}>
                                            <MapPin size={14} />
                                            <span>{ev.location}</span>
                                        </div>
                                        <h2 className={styles.eventTitle}>{ev.title}</h2>
                                        <p className={styles.eventExcerpt}>{ev.description}</p>
                                        <div className={styles.eventFooter}>
                                            <div className={styles.eventPrice}>
                                                <span className={styles.priceLabel}>Kwinjira</span>
                                                <span
                                                    className={styles.priceValue}
                                                    style={{ color: ev.is_free ? "#16a34a" : "var(--navy)" }}
                                                >
                                                    {ev.is_free ? "Kubuntu" : (ev.price ?? "Baza")}
                                                </span>
                                            </div>
                                            <span className="btn btn-outline">Reba byinshi</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <p className={styles.emptyState}>
                        Nta bitaramo biteganyijwe ubu. Subira vuba urebe ibishya!
                    </p>
                )}
            </section>

        </div>
    );
}
