import styles from "./news.module.css";
import { Grid, Globe, Music, Heart, Star, Film, ChevronDown, Clock } from "lucide-react";
import Link from "next/link";

export default function NewsPage() {
    return (
        <div className={styles.page}>

            <section className={styles.pageHeader}>
                <div className="container">
                    <div className={styles.breadcrumb}>
                        <Link href="/">Home</Link> &gt; <span>Archive</span>
                    </div>
                    <h1 className={styles.pageTitle}>Trending News &<br />Entertainment</h1>
                    <p className={styles.pageDescription}>
                        Your spiritual home for the latest updates from the global church, gospel music, and faith-filled lifestyle.
                    </p>
                </div>
            </section>

            <section className="container">
                <div className={styles.contentGrid}>

                    <aside className={styles.sidebar}>
                        <div className={styles.widget}>
                            <h3 className={styles.widgetTitle}>Categories</h3>
                            <p className={styles.widgetSub}>Filter stories by your interest</p>

                            <ul className={styles.categoryList}>
                                <li>
                                    <a href="#" className={styles.activeCategory}>
                                        <Grid size={18} /> All Stories
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <Globe size={18} /> Global Church
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <Music size={18} /> Music Review
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <Heart size={18} /> Lifestyle
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <Star size={18} /> Faith & Culture
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <Film size={18} /> Entertainment
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className={`${styles.widget} ${styles.newsletterWidget}`}>
                            <h3 className={styles.widgetTitle}>Newsletter</h3>
                            <p className={styles.widgetSub}>Get daily faith inspiration and news directly to your inbox.</p>
                            <form className={styles.subscribeForm}>
                                <input type="email" placeholder="Email address" />
                                <button type="button" className="btn btn-primary">Sign Up</button>
                            </form>
                        </div>
                    </aside>

                    <main className={styles.mainContent}>

                        <div className={styles.filterBar}>
                            <button className={`${styles.filterBtn} ${styles.filterActive}`}>
                                Latest <ChevronDown size={14} />
                            </button>
                            <button className={styles.filterBtn}>
                                Most Read <ChevronDown size={14} />
                            </button>
                            <button className={styles.filterBtn}>
                                Editors&apos; Pick <ChevronDown size={14} />
                            </button>
                            <button className={styles.filterBtn}>
                                Video <ChevronDown size={14} />
                            </button>
                        </div>

                        <div className={styles.articleGrid}>

                            <article className={styles.articleCard}>
                                <div className={styles.articleImage} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=800&auto=format&fit=crop)' }}>
                                    <span className="tag">GLOBAL CHURCH</span>
                                </div>
                                <div className={styles.articleContent}>
                                    <div className={styles.articleMeta}>
                                        <Clock size={14} /> <span>2 hours ago</span>
                                    </div>
                                    <h2 className={styles.articleTitle}>The Resurgence of Faith-Based Communities in Modern Cities</h2>
                                    <p className={styles.articleExcerpt}>
                                        As urbanization increases, small community-driven faith groups are seeing a significant rise in attendance and social impact...
                                    </p>
                                </div>
                            </article>

                            <article className={styles.articleCard}>
                                <div className={styles.articleImage} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=800&auto=format&fit=crop)' }}>
                                    <span className="tag">FAITH & CULTURE</span>
                                </div>
                                <div className={styles.articleContent}>
                                    <div className={styles.articleMeta}>
                                        <Clock size={14} /> <span>Oct 24, 2023</span>
                                    </div>
                                    <h2 className={styles.articleTitle}>How Modern Artists Are Reimagining Sacred Art</h2>
                                    <p className={styles.articleExcerpt}>
                                        A look at the contemporary creators using digital media and street art to express age-old spiritual truths.
                                    </p>
                                </div>
                            </article>

                            <article className={styles.articleCard}>
                                <div className={styles.articleImage} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop)' }}>
                                    <span className="tag">MUSIC REVIEW</span>
                                </div>
                                <div className={styles.articleContent}>
                                    <div className={styles.articleMeta}>
                                        <Clock size={14} /> <span>5 hours ago</span>
                                    </div>
                                    <h2 className={styles.articleTitle}>Top 10 Gospel Albums That Defined This Decade</h2>
                                    <p className={styles.articleExcerpt}>
                                        We take a deep dive into the melodies and messages that shifted the landscape of modern gospel music since 2020.
                                    </p>
                                </div>
                            </article>

                            <article className={styles.articleCard}>
                                <div className={styles.articleImage} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop)' }}>
                                    <span className="tag">DEVOTIONALS</span>
                                </div>
                                <div className={styles.articleContent}>
                                    <div className={styles.articleMeta}>
                                        <Clock size={14} /> <span>Oct 23, 2023</span>
                                    </div>
                                    <h2 className={styles.articleTitle}>The Silence of the Morning: Morning Meditations</h2>
                                    <p className={styles.articleExcerpt}>
                                        Exploring the power of early morning solitude and prayer in strengthening your daily walk of faith.
                                    </p>
                                </div>
                            </article>

                        </div>

                        <div className={styles.pagination}>
                            <button className={styles.pageBtn}>&lt;</button>
                            <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
                            <button className={styles.pageBtn}>2</button>
                            <button className={styles.pageBtn}>3</button>
                            <span className={styles.pageEllipsis}>...</span>
                            <button className={styles.pageBtn}>12</button>
                            <button className={styles.pageBtn}>&gt;</button>
                        </div>

                    </main>

                </div>
            </section>

        </div>
    );
}
