import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/metadata";
import { fetchVerse, getDailyVerseRef } from "@/lib/bible";
import VerseSearch from "./VerseSearch";
import styles from "./bible.module.css";

export const metadata: Metadata = buildMeta({
    title: "Tumenye Bibiliya",
    description: "Inyigisho zijya mu bunike bw'Ijambo ry'Imana. Soma, wige no gusobanukirwa Bibiliya neza.",
    path: "/tumenye-bibiliya",
});

// Sidebar quick-reference list (static labels + live text fetched below)
const sidebarRefs = ["John 3:16", "Psalm 23:1", "Philippians 4:13", "Romans 8:28", "Isaiah 40:31"];

const books = [
    { name: "Isezerano rya Kera",  items: ["Itangiriro", "Kuva", "Zaburi", "Imigani", "Yesaya", "Yeremiya", "Ezekiele"] },
    { name: "Isezerano Rishya", items: ["Matayo", "Mariko", "Luka", "Yohana", "Ibyakozwe", "Abaroma", "1 Abakorinto", "Ibyahishuwe"] },
];

const plans = [
    { title: "Bibiliya yose mu mwaka",     desc: "Soma Bibiliya yose mu mezi 12 — ingingo 3-4 buri munsi.", duration: "12 Amezi", icon: "📅" },
    { title: "Isezerano Rishya mu mezi 3", desc: "Soma Isezerano Rishya ryose mu mezi 3.",                   duration: "3 Amezi",  icon: "✝️" },
    { title: "Zaburi na Imigani",           desc: "Soma Igitabo cya Zaburi n'Imigani mu mezi 2.",             duration: "2 Amezi",  icon: "🎵" },
    { title: "Ubutumwa bwa Yohana",         desc: "Inyigisho zo kuri Injili ya Yohana — inzira nziza.",       duration: "1 Ukwezi", icon: "📖" },
];

export default async function TumenyeBibiliyaPage() {
    // Fetch today's verse live from bible-api.com (cached 24 h by Next.js)
    const dailyRef   = getDailyVerseRef();
    const dailyVerse = await fetchVerse(dailyRef);

    // Fetch sidebar quick-reference verses in parallel
    const sidebarVerses = await Promise.all(sidebarRefs.map(r => fetchVerse(r)));

    return (
        <div className={styles.page}>
            <div className={styles.hero}>
                <div className="container">
                    <span className={styles.eyebrow}>📖 URUGERO MEDIA</span>
                    <h1 className={styles.heading}>Tumenye Bibiliya</h1>
                    <p className={styles.subtitle}>
                        Inyigisho zijya mu bunike bw&apos;Ijambo ry&apos;Imana. Soma, wige no gusobanukirwa Bibiliya neza.
                    </p>
                </div>
            </div>

            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.main}>
                        {/* Daily verse — live from bible-api.com */}
                        <section className={styles.verseOfDay} aria-label="Verse of the day">
                            <div className={styles.verseBadge}>📅 Verse of the Day — {dailyRef}</div>
                            {dailyVerse ? (
                                <>
                                    <blockquote className={styles.verseText}>
                                        &ldquo;{dailyVerse.text}&rdquo;
                                    </blockquote>
                                    <div className={styles.verseFooter}>
                                        <cite className={styles.verseRef}>— {dailyVerse.reference}</cite>
                                        <span className={styles.verseTrans}>{dailyVerse.translation_name}</span>
                                    </div>
                                </>
                            ) : (
                                <p className={styles.verseText} style={{ opacity: 0.7 }}>
                                    &ldquo;For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.&rdquo;
                                </p>
                            )}
                        </section>

                        {/* Reading plans */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Gahunda zo gusoma Bibiliya</h2>
                            <div className={styles.plansGrid}>
                                {plans.map(plan => (
                                    <div key={plan.title} className={styles.planCard}>
                                        <span className={styles.planIcon}>{plan.icon}</span>
                                        <div>
                                            <h3 className={styles.planTitle}>{plan.title}</h3>
                                            <p className={styles.planDesc}>{plan.desc}</p>
                                            <span className={styles.planDuration}>{plan.duration}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Bible books */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Ibitabo bya Bibiliya</h2>
                            {books.map(group => (
                                <div key={group.name} className={styles.bookGroup}>
                                    <h3 className={styles.bookGroupTitle}>{group.name}</h3>
                                    <div className={styles.bookList}>
                                        {group.items.map(book => (
                                            <span key={book} className={styles.bookChip}>{book}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </section>
                    </div>

                    <aside className={styles.sidebar}>
                        <div className={styles.sideWidget}>
                            <h3 className={styles.widgetTitle}>Bible Quiz</h3>
                            <p className={styles.widgetText}>
                                Gerageza ubumenyi bwawe bw&apos;Ijambo ry&apos;Imana! Imikino itangaza y&apos;ubusobanuro bwa Bibiliya.
                            </p>
                            <Link href="/inyigisho/bible-quiz" className={styles.widgetBtn}>
                                Tangira Quiz →
                            </Link>
                        </div>

                        {/* Live verse search widget */}
                        <VerseSearch />

                        <div className={styles.sideWidget}>
                            <h3 className={styles.widgetTitle}>Key Verses (KJV)</h3>
                            <div className={styles.verseList}>
                                {sidebarVerses.map((v, i) => v && (
                                    <div key={i} className={styles.verseItem}>
                                        <span className={styles.verseRef2}>{v.reference}</span>
                                        <p className={styles.versePreview}>
                                            &ldquo;{v.text.slice(0, 90)}&hellip;&rdquo;
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
