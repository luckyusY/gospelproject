"use client";

import { useState, useCallback } from "react";
import styles from "./quiz.module.css";

type Question = {
    question: string;
    options:  [string, string, string, string];
    answer:   0 | 1 | 2 | 3;
    verse:    string;
};

const questions: Question[] = [
    {
        question: "Who was renamed by Jesus from 'Simon' to another name?",
        options:  ["James", "Peter", "Philip", "Andrew"],
        answer:   1,
        verse:    "John 1:42",
    },
    {
        question: "What happened when Jesus was baptized by John in the Jordan River?",
        options:  ["Thunder struck", "The heavens opened and the Spirit descended like a dove", "It rained heavily", "The water turned to wine"],
        answer:   1,
        verse:    "Matthew 3:16-17",
    },
    {
        question: "How many people were in Noah's ark with him during the flood?",
        options:  ["6", "8", "10", "12"],
        answer:   1,
        verse:    "Genesis 7:13",
    },
    {
        question: "Which Psalm begins with 'The LORD is my shepherd; I shall not want'?",
        options:  ["Psalm 1", "Psalm 91", "Psalm 23", "Psalm 119"],
        answer:   2,
        verse:    "Psalm 23:1",
    },
    {
        question: "How many days had Lazarus been in the tomb when Jesus arrived?",
        options:  ["1", "2", "3", "4"],
        answer:   3,
        verse:    "John 11:17",
    },
    {
        question: "What did Solomon ask God for when God said 'Ask what I shall give thee'?",
        options:  ["Wealth", "Long life", "An understanding heart", "Victory over enemies"],
        answer:   2,
        verse:    "1 Kings 3:9",
    },
    {
        question: "What sign accompanied the gift of the Holy Spirit on the Day of Pentecost?",
        options:  ["Thunder and lightning", "An earthquake", "Cloven tongues like fire", "A rainbow"],
        answer:   2,
        verse:    "Acts 2:3",
    },
    {
        question: "What were Paul and Silas doing at midnight in prison?",
        options:  ["Sleeping", "Praying and singing praises to God", "Preaching to prisoners", "Writing letters"],
        answer:   1,
        verse:    "Acts 16:25",
    },
    {
        question: "Jesus said 'I am the way, the truth, and the life' — to whom?",
        options:  ["Peter", "Mary Magdalene", "Thomas", "Judas"],
        answer:   2,
        verse:    "John 14:5-6",
    },
    {
        question: "How many books are in the New Testament?",
        options:  ["24", "27", "29", "39"],
        answer:   1,
        verse:    "Revelation 22:21",
    },
];

type Phase = "intro" | "playing" | "result";

export default function BibleQuiz() {
    const [phase,      setPhase]      = useState<Phase>("intro");
    const [current,    setCurrent]    = useState(0);
    const [selected,   setSelected]   = useState<number | null>(null);
    const [confirmed,  setConfirmed]  = useState(false);
    const [score,      setScore]      = useState(0);
    const [answers,    setAnswers]    = useState<(number | null)[]>(Array(questions.length).fill(null));

    const question = questions[current]!;

    const choose = useCallback((idx: number) => {
        if (confirmed) return;
        setSelected(idx);
    }, [confirmed]);

    const confirm = useCallback(() => {
        if (selected === null || confirmed) return;
        setConfirmed(true);
        const isCorrect = selected === question.answer;
        if (isCorrect) setScore(s => s + 1);
        setAnswers(prev => {
            const next = [...prev];
            next[current] = selected;
            return next;
        });
    }, [selected, confirmed, question.answer, current]);

    const next = useCallback(() => {
        if (current + 1 >= questions.length) {
            setPhase("result");
        } else {
            setCurrent(c => c + 1);
            setSelected(null);
            setConfirmed(false);
        }
    }, [current]);

    const restart = useCallback(() => {
        setPhase("intro");
        setCurrent(0);
        setSelected(null);
        setConfirmed(false);
        setScore(0);
        setAnswers(Array(questions.length).fill(null));
    }, []);

    const pct = Math.round((score / questions.length) * 100);
    const grade =
        pct >= 90 ? { label: "Ikirenga!", color: "#059669" } :
        pct >= 70 ? { label: "Byagenze neza!",   color: "#1E40AF" } :
        pct >= 50 ? { label: "Biragenda!",   color: "#F59E0B" } :
                    { label: "Komeza kwiga",  color: "#DC2626" };

    // ── Intro ───────────────────────────────────────────────
    if (phase === "intro") return (
        <div className={styles.intro}>
            <div className={styles.introIcon}>📖</div>
            <h2 className={styles.introTitle}>Urugero Bible Quiz</h2>
            <p className={styles.introDesc}>
                Ibibazo {questions.length} by&apos;ubusobanuro bwa Bibiliya. Igisubizo kimwe nicyo kizima!
                Gerageza ubumenyi bwawe — Uwiteka akukomeze!
            </p>
            <div className={styles.introStats}>
                <div className={styles.introStat}>
                    <span className={styles.introStatVal}>{questions.length}</span>
                    <span className={styles.introStatLbl}>Ibibazo</span>
                </div>
                <div className={styles.introStat}>
                    <span className={styles.introStatVal}>~5 min</span>
                    <span className={styles.introStatLbl}>Igihe</span>
                </div>
                <div className={styles.introStat}>
                    <span className={styles.introStatVal}>🏆</span>
                    <span className={styles.introStatLbl}>Ikirenga</span>
                </div>
            </div>
            <button className={styles.startBtn} onClick={() => setPhase("playing")}>
                Tangira Quiz →
            </button>
        </div>
    );

    // ── Result ──────────────────────────────────────────────
    if (phase === "result") return (
        <div className={styles.result}>
            <div className={styles.resultScore} style={{ color: grade.color }}>
                {score}/{questions.length}
            </div>
            <p className={styles.resultPct}>{pct}%</p>
            <p className={styles.resultGrade} style={{ color: grade.color }}>{grade.label}</p>

            <div className={styles.resultGrid}>
                {questions.map((q, i) => {
                    const ans = answers[i];
                    const isCorrect = ans === q.answer;
                    return (
                        <div key={i} className={`${styles.resultItem} ${isCorrect ? styles.correct : styles.wrong}`}>
                            <span className={styles.resultNum}>{i + 1}</span>
                            <div className={styles.resultItemBody}>
                                <p className={styles.resultQ}>{q.question}</p>
                                {!isCorrect && (
                                    <p className={styles.resultCorrectAns}>
                                        ✅ {q.options[q.answer]} — <em>{q.verse}</em>
                                    </p>
                                )}
                            </div>
                            <span className={styles.resultIcon}>{isCorrect ? "✅" : "❌"}</span>
                        </div>
                    );
                })}
            </div>

            <button className={styles.restartBtn} onClick={restart}>
                ↺ Subiramo Quiz
            </button>
        </div>
    );

    // ── Playing ─────────────────────────────────────────────
    return (
        <div className={styles.quiz}>
            {/* Progress */}
            <div className={styles.progress}>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                    />
                </div>
                <span className={styles.progressLabel}>
                    {current + 1} / {questions.length}
                </span>
            </div>

            {/* Question */}
            <div className={styles.questionCard}>
                <p className={styles.questionText}>{question.question}</p>

                <div className={styles.options} role="radiogroup" aria-label="Hitamo igisubizo">
                    {question.options.map((opt, i) => {
                        let cls = styles.option;
                        if (confirmed) {
                            if (i === question.answer)       cls = `${styles.option} ${styles.optCorrect}`;
                            else if (i === selected)         cls = `${styles.option} ${styles.optWrong}`;
                        } else if (i === selected) {
                            cls = `${styles.option} ${styles.optSelected}`;
                        }

                        return (
                            <button
                                key={i}
                                className={cls}
                                onClick={() => choose(i)}
                                aria-pressed={selected === i}
                                disabled={confirmed && i !== question.answer && i !== selected}
                            >
                                <span className={styles.optLetter}>{["A", "B", "C", "D"][i]}</span>
                                <span>{opt}</span>
                            </button>
                        );
                    })}
                </div>

                {confirmed && (
                    <div className={`${styles.feedback} ${selected === question.answer ? styles.fbCorrect : styles.fbWrong}`}>
                        {selected === question.answer
                            ? `✅ Ni yo! — ${question.verse}`
                            : `❌ Gisubizo nziza ni: "${question.options[question.answer]}" — ${question.verse}`}
                    </div>
                )}

                <div className={styles.quizActions}>
                    {!confirmed ? (
                        <button
                            className={styles.confirmBtn}
                            onClick={confirm}
                            disabled={selected === null}
                        >
                            Emeza igisubizo
                        </button>
                    ) : (
                        <button className={styles.nextBtn} onClick={next}>
                            {current + 1 < questions.length ? "Ikibazo gikurikira →" : "Reba ibisubizo →"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
