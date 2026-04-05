import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/metadata";
import BibleQuiz from "./BibleQuiz";
import styles from "./page.module.css";

export const metadata: Metadata = buildMeta({
    title: "Bible Quiz",
    description: "Ibibazo bya Bibiliya bigufasha kwiga no gusobanukirwa ijambo ry'Imana.",
    path: "/inyigisho/bible-quiz",
});

export default function BibleQuizPage() {
    return (
        <div className={styles.page}>
            <div className={styles.hero}>
                <div className="container">
                    <nav className={styles.breadcrumb} aria-label="Inzira">
                        <Link href="/">Ahabanza</Link>
                        <span aria-hidden>›</span>
                        <Link href="/inyigisho">Inyigisho</Link>
                        <span aria-hidden>›</span>
                        <span aria-current="page">Bible Quiz</span>
                    </nav>
                    <h1 className={styles.heading}>Bible Quiz</h1>
                    <p className={styles.subtitle}>
                        Gerageza ubumenyi bwawe bw&apos;Ijambo ry&apos;Imana. Ibibazo byingana!
                    </p>
                </div>
            </div>
            <div className="container">
                <BibleQuiz />
            </div>
        </div>
    );
}
