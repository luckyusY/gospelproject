import Image from "next/link";
import styles from "./page.module.css";
import { PlayCircle, Calendar, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className={styles.page}>

      {/* Hero Section */}
      <section className={`container ${styles.heroSection}`}>
        <div className={styles.heroGrid}>

          <div className={styles.mainStories}>
            <div className={styles.featuredStory} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=1000&auto=format&fit=crop)' }}>
              <div className={styles.storyOverlay}>
                <span className="tag">Featured Story</span>
                <h1 className={styles.storyTitle}>The Global Impact of Modern Worship Movements</h1>
                <p className={styles.storyExcerpt}>How new generations are reshaping the landscape of praise and worship across different cultures and continents.</p>
              </div>
            </div>

            <div className={styles.subStories}>
              <div className={styles.subStory} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop)' }}>
                <div className={styles.storyOverlay}>
                  <h3 className={styles.subStoryTitle}>Finding Peace in the Digital Age</h3>
                </div>
              </div>
              <div className={styles.subStory} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=1000&auto=format&fit=crop)' }}>
                <div className={styles.storyOverlay}>
                  <h3 className={styles.subStoryTitle}>Youth Ministry Growth Trends for 2024</h3>
                </div>
              </div>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.sidebarWidget}>
              <div className={styles.widgetHeader}>
                <Calendar className={styles.widgetIcon} size={20} />
                <h3>Upcoming Events</h3>
                <a href="/events" className={styles.viewAll}>VIEW ALL</a>
              </div>
              <ul className={styles.eventList}>
                <li className={styles.eventItem}>
                  <div className={styles.eventDate}>
                    <span className={styles.eventMonth}>OCT</span>
                    <span className={styles.eventDay}>24</span>
                  </div>
                  <div className={styles.eventDetails}>
                    <h4>National Prayer Summit</h4>
                    <p>Washington, D.C. • 9:00 AM</p>
                  </div>
                </li>
                <li className={styles.eventItem}>
                  <div className={styles.eventDate}>
                    <span className={styles.eventMonth}>NOV</span>
                    <span className={styles.eventDay}>02</span>
                  </div>
                  <div className={styles.eventDetails}>
                    <h4>Worship Night Live</h4>
                    <p>Grace Cathedral • 7:30 PM</p>
                  </div>
                </li>
                <li className={styles.eventItem}>
                  <div className={styles.eventDate}>
                    <span className={styles.eventMonth}>DEC</span>
                    <span className={styles.eventDay}>15</span>
                  </div>
                  <div className={styles.eventDetails}>
                    <h4>Christmas Gala Charity</h4>
                    <p>Community Hall • 6:00 PM</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className={styles.newsletterWidget}>
              <h3>Bible Study Newsletter</h3>
              <p>Deepen your faith with weekly insights delivered to your inbox.</p>
              <form className={styles.newsletterForm}>
                <input type="email" placeholder="Your email address" required />
                <button type="button" className="btn btn-accent">Join 15k+ Readers</button>
              </form>
            </div>
          </aside>

        </div>
      </section>

      {/* Verse of the Day */}
      <section className={`container ${styles.verseSection}`}>
        <div className={styles.verseBox}>
          <h4 className={styles.verseLabel}>VERSE OF THE DAY</h4>
          <blockquote className={styles.verseText}>
            "For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."
          </blockquote>
          <cite className={styles.verseRef}>— Jeremiah 29:11</cite>

          <div className={styles.verseActions}>
            <button className={`${styles.verseBtn} ${styles.btnLight}`}>
              Share Verse
            </button>
            <button className={`${styles.verseBtn} ${styles.btnPrimary}`}>
              Read Chapter
            </button>
          </div>
        </div>
      </section>

      {/* Multimedia Testimonies */}
      <section className={`container ${styles.testimonySection}`}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleBlock}>
            <PlayCircle size={28} className={styles.sectionIcon} />
            <h2 className="section-title" style={{ marginBottom: 0 }}>Multimedia Testimonies</h2>
          </div>
          <div className={styles.sliderControls}>
            <button className={styles.sliderBtn}>&lt;</button>
            <button className={styles.sliderBtn}>&gt;</button>
          </div>
        </div>

        <div className={styles.testimonyGrid}>

          <div className={styles.testimonyCard}>
            <div className={styles.videoThumbnail} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop)' }}>
              <button className={styles.playBtn}><PlayCircle size={48} fill="white" stroke="var(--primary-color)" /></button>
            </div>
            <div className={styles.testimonyContent}>
              <h3>A Journey of Healing</h3>
              <p>Watch Sarah's miraculous story of recovery and restored faith.</p>
            </div>
          </div>

          <div className={styles.testimonyCard}>
            <div className={styles.videoThumbnail} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop)' }}>
              <button className={styles.playBtn}><PlayCircle size={48} fill="white" stroke="var(--primary-color)" /></button>
            </div>
            <div className={styles.testimonyContent}>
              <h3>Finding Purpose in Grace</h3>
              <p>Mark shares how he discovered his calling after a period of doubt.</p>
            </div>
          </div>

          <div className={styles.testimonyCard}>
            <div className={styles.videoThumbnail} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop)' }}>
            </div>
            <div className={styles.testimonyContent}>
              <h3>Stronger Together</h3>
              <p>The Smiths talk about building community through small groups.</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
