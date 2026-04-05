import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/metadata";
import styles from "./bible.module.css";

export const metadata: Metadata = buildMeta({
    title: "Tumenye Bibiliya",
    description: "Inyigisho zijya mu bunike bw'Ijambo ry'Imana. Soma, wige no gusobanukirwa Bibiliya neza.",
    path: "/tumenye-bibiliya",
});

const dailyVerses = [
    { text: "Kuko Imana yarkunze isi cyane, ndetse ihaye Umwana wayo w'ikinege, kugira ngo uwo wese wemera we ntazimu, ahubwo agire ubugingo buhoraho.", reference: "Yohana 3:16" },
    { text: "Imana ni urukundo. Ukomeza mu rukundo akomera muri Imana, Imana na yo ikomera muri we.", reference: "1 Yohana 4:16" },
    { text: "Shyira ibyifuzo byawe byose imbere y'Uwiteka, Nawe azakurikirana ibikorwa byawe byose.", reference: "Imigani 16:3" },
    { text: "Nshobora ibintu byose muri Kristo unkomeza.", reference: "Abafilipo 4:13" },
    { text: "Uwiteka ni Umwungeri wanjye, nzabura ikimwe cyo gukenesha.", reference: "Zaburi 23:1" },
    { text: "Zera Uwiteka n'umutima wawe wose, ntwiringire ubwenge bwawe bwite.", reference: "Imigani 3:5" },
    { text: "Musabire abo babatera nabi, muzeze abababaza.", reference: "Matayo 5:44" },
];

const todayVerse = dailyVerses[new Date().getDay() % dailyVerses.length]!;

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

export default function TumenyeBibiliyaPage() {
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
                        {/* Daily verse */}
                        <section className={styles.verseOfDay} aria-label="Ijambo ry'uyu munsi">
                            <div className={styles.verseBadge}>📅 Ijambo ry&apos;uyu munsi</div>
                            <blockquote className={styles.verseText}>
                                &ldquo;{todayVerse.text}&rdquo;
                            </blockquote>
                            <cite className={styles.verseRef}>— {todayVerse.reference}</cite>
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

                        <div className={styles.sideWidget}>
                            <h3 className={styles.widgetTitle}>Imirongo ya buri munsi</h3>
                            <div className={styles.verseList}>
                                {dailyVerses.slice(0, 5).map((v, i) => (
                                    <div key={i} className={styles.verseItem}>
                                        <span className={styles.verseRef2}>{v.reference}</span>
                                        <p className={styles.versePreview}>
                                            &ldquo;{v.text.slice(0, 80)}&hellip;&rdquo;
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
