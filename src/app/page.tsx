import Link from "next/link";
import styles from "./page.module.css";
import { PlayCircle, Calendar, ArrowRight, TrendingUp } from "lucide-react";

const categories = [
    { name: "All",           active: true  },
    { name: "Trending",      color: "#DC2626" },
    { name: "Bible Study",   color: "#1E40AF" },
    { name: "Christian Life",color: "#059669" },
    { name: "Events",        color: "#7C3AED" },
    { name: "Entertainment", color: "#F59E0B" },
    { name: "Youth",         color: "#0D1B2E" },
];

const latestStories = [
    {
        id: 1,
        category: "Trending",
        categoryColor: "#DC2626",
        title: "Revival Movement Spreads Across 40 Nations",
        excerpt: "A historic wave of spiritual awakening is being reported in churches across Asia, Africa, and Latin America.",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop",
        author: "James Okafor",
        readTime: "5 min read",
    },
    {
        id: 2,
        category: "Bible Study",
        categoryColor: "#1E40AF",
        title: "The Book of Job: Finding Faith in Suffering",
        excerpt: "A deep dive into one of Scripture's most challenging texts and what it means for believers today.",
        image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop",
        author: "Pastor Grace Lee",
        readTime: "8 min read",
    },
    {
        id: 3,
        category: "Events",
        categoryColor: "#7C3AED",
        title: "Worship Night Live Returns to Madison Square Garden",
        excerpt: "The annual event sold out in under 24 hours, with overflow venues set up across New York City.",
        image: "https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=800&auto=format&fit=crop",
        author: "Sarah Mitchell",
        readTime: "4 min read",
    },
    {
        id: 4,
        category: "Christian Life",
        categoryColor: "#059669",
        title: "How Fasting Transformed My Relationship With God",
        excerpt: "One believer shares her 40-day journey and the surprising lessons she learned along the way.",
        image: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=800&auto=format&fit=crop",
        author: "Maria Santos",
        readTime: "6 min read",
    },
    {
        id: 5,
        category: "Entertainment",
        categoryColor: "#D97706",
        title: "Top 10 Gospel Albums That Defined the Decade",
        excerpt: "From intimate acoustic sessions to stadium anthems — the records that shaped a generation of faith.",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop",
        author: "DJ Kingdom",
        readTime: "7 min read",
    },
    {
        id: 6,
        category: "Youth",
        categoryColor: "#0D1B2E",
        title: "Gen Z Is Reshaping What Church Looks Like",
        excerpt: "A new generation of believers is challenging traditions and breathing fresh life into old spaces.",
        image: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=800&auto=format&fit=crop",
        author: "Caleb Torres",
        readTime: "5 min read",
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
                                <span className="tag">Featured Story</span>
                                <h1 className={styles.featuredTitle}>
                                    The Global Impact of Modern Worship Movements
                                </h1>
                                <p className={styles.featuredExcerpt}>
                                    How new generations are reshaping the landscape of praise and worship across different cultures and continents.
                                </p>
                                <div className={styles.featuredMeta}>
                                    <span>By Michael Davis</span>
                                    <span>•</span>
                                    <span>6 min read</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.subStories}>
                            <div
                                className={styles.subStory}
                                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop)" }}
                            >
                                <div className={styles.subOverlay}>
                                    <span className="tag tag-blue">Christian Life</span>
                                    <h3 className={styles.subTitle}>Finding Peace in the Digital Age</h3>
                                </div>
                            </div>
                            <div
                                className={styles.subStory}
                                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=800&auto=format&fit=crop)" }}
                            >
                                <div className={styles.subOverlay}>
                                    <span className="tag tag-gold">Youth</span>
                                    <h3 className={styles.subTitle}>Youth Ministry Growth Trends for 2025</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className={styles.sidebar}>

                        <div className={styles.widget}>
                            <div className={styles.widgetHead}>
                                <Calendar size={16} className={styles.widgetIcon} />
                                <h3>Upcoming Events</h3>
                                <Link href="/events" className={styles.viewAll}>VIEW ALL</Link>
                            </div>
                            <ul className={styles.eventList}>
                                {[
                                    { month: "OCT", day: "24", title: "National Prayer Summit",  sub: "Washington, D.C. • 9:00 AM" },
                                    { month: "NOV", day: "02", title: "Worship Night Live",       sub: "Grace Cathedral • 7:30 PM" },
                                    { month: "DEC", day: "15", title: "Christmas Gala Charity",   sub: "Community Hall • 6:00 PM" },
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
                            <h3>Bible Study Newsletter</h3>
                            <p>Deepen your faith with weekly insights delivered straight to your inbox.</p>
                            <form className={styles.newsletterForm}>
                                <input type="email" placeholder="Your email address" required />
                                <button type="button" className="btn btn-accent">Join 15k+ Readers</button>
                            </form>
                        </div>

                    </aside>

                </div>
            </section>

            {/* ── Verse of the Day ──────────────────────── */}
            <section className={styles.verseSection}>
                <div className={styles.verseQuoteMark}>&ldquo;</div>
                <div className={styles.verseInner}>
                    <span className={styles.verseBadge}>VERSE OF THE DAY</span>
                    <blockquote className={styles.verseText}>
                        For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.
                    </blockquote>
                    <cite className={styles.verseRef}>— Jeremiah 29:11</cite>
                    <div className={styles.verseActions}>
                        <button className={styles.verseBtnOutline}>Share Verse</button>
                        <button className={styles.verseBtnSolid}>Read Chapter</button>
                    </div>
                </div>
            </section>

            {/* ── Latest Stories ────────────────────────── */}
            <section className={`container ${styles.latestSection}`}>
                <div className={styles.latestHeader}>
                    <h2 className="section-title" style={{ marginBottom: 0 }}>Latest Stories</h2>
                    <Link href="/news" className={styles.seeAllLink}>
                        See all stories <ArrowRight size={15} />
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
                    <h2 className="section-title" style={{ marginBottom: 0 }}>Multimedia Testimonies</h2>
                    <div className={styles.sliderBtns}>
                        <button className={styles.sliderBtn} aria-label="Previous">&lt;</button>
                        <button className={styles.sliderBtn} aria-label="Next">&gt;</button>
                    </div>
                </div>

                <div className={styles.testimonyGrid}>
                    {[
                        {
                            img:   "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
                            title: "A Journey of Healing",
                            desc:  "Watch Sarah's miraculous story of recovery and restored faith.",
                            hasPlay: true,
                        },
                        {
                            img:   "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
                            title: "Finding Purpose in Grace",
                            desc:  "Mark shares how he discovered his calling after a period of doubt.",
                            hasPlay: true,
                        },
                        {
                            img:   "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
                            title: "Stronger Together",
                            desc:  "The Smiths talk about building community through small groups.",
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
