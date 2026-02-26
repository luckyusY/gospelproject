import styles from "./events.module.css";
import { Search, MapPin, Grid, Video, Music, Calendar, ChevronDown } from "lucide-react";

export default function EventsPage() {
    return (
        <div className={styles.page}>

            <section className={styles.heroSection} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=1600&auto=format&fit=crop)' }}>
                <div className={styles.heroOverlay}>
                    <div className="container">
                        <h1 className={styles.heroTitle}>Gospel Events Directory</h1>
                        <p className={styles.heroDescription}>
                            Connect with believers across the globe. Find local worship nights, global conferences, and spirit-filled festivals.
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.searchSection}>
                <div className="container">
                    <div className={styles.searchBox}>
                        <div className={styles.searchInputGroup}>
                            <Search className={styles.searchIcon} size={18} />
                            <input type="text" placeholder="Search events, artists, or venues..." className={styles.searchInput} />
                        </div>

                        <div className={styles.searchDivider}></div>

                        <div className={styles.searchInputGroup}>
                            <MapPin className={styles.searchIcon} size={18} />
                            <input type="text" placeholder="Location" className={styles.searchInput} />
                        </div>

                        <div className={styles.searchDivider}></div>

                        <div className={styles.searchSelectGroup}>
                            <Grid className={styles.searchIcon} size={18} />
                            <select className={styles.searchSelect}>
                                <option>All Event Types</option>
                                <option>Conference</option>
                                <option>Worship Night</option>
                                <option>Festival</option>
                            </select>
                        </div>

                        <button className={`btn btn-primary ${styles.searchBtn}`}>Find Events</button>
                    </div>

                    <div className={styles.tagsContainer}>
                        <button className={`${styles.filterTag} ${styles.tagActive}`}>Featured</button>
                        <button className={styles.filterTag}>This Weekend</button>
                        <button className={styles.filterTag}>Free Entry</button>
                        <button className={styles.filterTag}>Online/Virtual</button>
                        <button className={styles.filterTag}>Family Friendly</button>
                    </div>
                </div>
            </section>

            <section className={`container ${styles.eventsContainer}`}>
                <div className={styles.eventsGrid}>

                    <article className={styles.eventCard}>
                        <div className={styles.eventImage} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540039155732-6114b09ec4d5?q=80&w=800&auto=format&fit=crop)' }}>
                            <div className={styles.dateBadge}>
                                <span className={styles.badgeMonth}>OCT</span>
                                <span className={styles.badgeDay}>15</span>
                            </div>
                            <span className="tag">CONFERENCE</span>
                        </div>
                        <div className={styles.eventContent}>
                            <div className={styles.eventMeta}>
                                <MapPin size={14} /> <span>Music City Center, Nashville, TN</span>
                            </div>
                            <h2 className={styles.eventTitle}>National Gospel Summit 2024</h2>
                            <p className={styles.eventExcerpt}>
                                A transformative three-day gathering of gospel artists, leaders, and worshippers from around...
                            </p>

                            <div className={styles.eventFooter}>
                                <div className={styles.eventPrice}>
                                    <span className={styles.priceLabel}>Starts at</span>
                                    <span className={styles.priceValue}>$45.00</span>
                                </div>
                                <button className="btn btn-primary">Get Tickets</button>
                            </div>
                        </div>
                    </article>

                    <article className={styles.eventCard}>
                        <div className={styles.eventImage} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516280440508-3a1ecf92b76b?q=80&w=800&auto=format&fit=crop)' }}>
                            <div className={styles.dateBadge}>
                                <span className={styles.badgeMonth}>OCT</span>
                                <span className={styles.badgeDay}>22</span>
                            </div>
                            <span className="tag" style={{ backgroundColor: '#ef4444' }}>WORSHIP NIGHT</span>
                        </div>
                        <div className={styles.eventContent}>
                            <div className={styles.eventMeta}>
                                <Video size={14} /> <span>Online • Live from London</span>
                            </div>
                            <h2 className={styles.eventTitle}>Global Prayer & Praise Stream</h2>
                            <p className={styles.eventExcerpt}>
                                Join millions online for an evening of prayer, worship, and prophetic messages broadcasted...
                            </p>

                            <div className={styles.eventFooter}>
                                <div className={styles.eventPrice}>
                                    <span className={styles.priceLabel}>Access</span>
                                    <span className={styles.priceValue} style={{ color: '#16a34a' }}>FREE</span>
                                </div>
                                <button className={`btn ${styles.btnOutline}`}>Watch Live</button>
                            </div>
                        </div>
                    </article>

                    <article className={styles.eventCard}>
                        <div className={styles.eventImage} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1470229722913-7c090be5c5a4?q=80&w=800&auto=format&fit=crop)' }}>
                            <div className={styles.dateBadge}>
                                <span className={styles.badgeMonth}>NOV</span>
                                <span className={styles.badgeDay}>05</span>
                            </div>
                            <span className="tag" style={{ backgroundColor: '#eab308' }}>FESTIVAL</span>
                        </div>
                        <div className={styles.eventContent}>
                            <div className={styles.eventMeta}>
                                <MapPin size={14} /> <span>Sunshine Plaza, Atlanta, GA</span>
                            </div>
                            <h2 className={styles.eventTitle}>Autumn Grace Praise Festival</h2>
                            <p className={styles.eventExcerpt}>
                                Family-friendly outdoor festival featuring local choirs, food vendors, and a headline...
                            </p>

                            <div className={styles.eventFooter}>
                                <div className={styles.eventPrice}>
                                    <span className={styles.priceLabel}>Starts at</span>
                                    <span className={styles.priceValue}>$15.00</span>
                                </div>
                                <button className="btn btn-primary">Get Tickets</button>
                            </div>
                        </div>
                    </article>

                    <article className={styles.eventCard}>
                        <div className={styles.eventImage} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop)' }}>
                            <div className={styles.dateBadge}>
                                <span className={styles.badgeMonth}>NOV</span>
                                <span className={styles.badgeDay}>12</span>
                            </div>
                            <span className="tag" style={{ backgroundColor: '#8b5cf6' }}>YOUTH</span>
                        </div>
                        <div className={styles.eventContent}>
                            <div className={styles.eventMeta}>
                                <MapPin size={14} /> <span>City Arena, Chicago, IL</span>
                            </div>
                            <h2 className={styles.eventTitle}>Next Gen Revival Night</h2>
                            <p className={styles.eventExcerpt}>
                                Empowering the youth with modern worship, spoken word performances, and life-changing...
                            </p>

                            <div className={styles.eventFooter}>
                                <div className={styles.eventPrice}>
                                    <span className={styles.priceLabel}>Entry</span>
                                    <span className={styles.priceValue} style={{ color: '#16a34a' }}>FREE</span>
                                </div>
                                <button className={`btn ${styles.btnOutline}`}>Register</button>
                            </div>
                        </div>
                    </article>

                    <article className={styles.eventCard}>
                        <div className={styles.eventImage} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop)' }}>
                            <div className={styles.dateBadge}>
                                <span className={styles.badgeMonth}>DEC</span>
                                <span className={styles.badgeDay}>01</span>
                            </div>
                            <span className="tag">CONFERENCE</span>
                        </div>
                        <div className={styles.eventContent}>
                            <div className={styles.eventMeta}>
                                <MapPin size={14} /> <span>Grand Hall, London, UK</span>
                            </div>
                            <h2 className={styles.eventTitle}>Women of Faith Empowerment</h2>
                            <p className={styles.eventExcerpt}>
                                Celebrating faith, community, and purpose. A day of workshops and worship led by pioneeri...
                            </p>

                            <div className={styles.eventFooter}>
                                <div className={styles.eventPrice}>
                                    <span className={styles.priceLabel}>Starts at</span>
                                    <span className={styles.priceValue}>£30.00</span>
                                </div>
                                <button className="btn btn-primary">Get Tickets</button>
                            </div>
                        </div>
                    </article>

                    <article className={styles.eventCard}>
                        <div className={styles.eventImage} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511522851441-2b6d51bbd811?q=80&w=800&auto=format&fit=crop)' }}>
                            <div className={styles.dateBadge}>
                                <span className={styles.badgeMonth}>DEC</span>
                                <span className={styles.badgeDay}>24</span>
                            </div>
                            <span className="tag" style={{ backgroundColor: '#ef4444' }}>WORSHIP NIGHT</span>
                        </div>
                        <div className={styles.eventContent}>
                            <div className={styles.eventMeta}>
                                <MapPin size={14} /> <span>Grace Cathedral, New York, NY</span>
                            </div>
                            <h2 className={styles.eventTitle}>Christmas Eve Candlelight Service</h2>
                            <p className={styles.eventExcerpt}>
                                A classic and serene candlelight service with hymns, readings, and a special choir...
                            </p>

                            <div className={styles.eventFooter}>
                                <div className={styles.eventPrice}>
                                    <span className={styles.priceLabel}>Entry</span>
                                    <span className={styles.priceValue} style={{ color: '#16a34a' }}>FREE</span>
                                </div>
                                <button className={`btn ${styles.btnOutline}`}>RSVP</button>
                            </div>
                        </div>
                    </article>

                </div>

                <div className={styles.loadMoreContainer}>
                    <button className={`btn ${styles.btnOutline} ${styles.loadMoreBtn}`}>
                        View More Events <ChevronDown size={16} />
                    </button>
                </div>
            </section>

        </div>
    );
}
