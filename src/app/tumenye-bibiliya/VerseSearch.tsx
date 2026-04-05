"use client";

import { useState, useTransition } from "react";
import styles from "./verse-search.module.css";

type VerseResult = { reference: string; text: string; translation_name: string };

const suggestions = [
    "John 3:16", "Psalm 23", "Romans 8:28", "Philippians 4:13",
    "Isaiah 40:31", "Proverbs 3:5-6", "Matthew 11:28-30", "Jeremiah 29:11",
];

export default function VerseSearch() {
    const [query,   setQuery]   = useState("");
    const [result,  setResult]  = useState<VerseResult | null>(null);
    const [error,   setError]   = useState<string | null>(null);
    const [isPending, start]    = useTransition();

    async function search(ref: string) {
        if (!ref.trim()) return;
        setError(null);
        setResult(null);

        const res = await fetch(`/api/bible?ref=${encodeURIComponent(ref.trim())}`);
        const data = await res.json() as VerseResult & { error?: string };

        start(() => {
            if (!res.ok || data.error) {
                setError(data.error ?? "Verse ntiboneka. Gerageza nk'iri: 'John 3:16'");
            } else {
                setResult(data);
            }
        });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        search(query);
    }

    return (
        <div className={styles.wrap}>
            <h3 className={styles.title}>🔍 Shakisha Imirongo ya Bibiliya</h3>
            <p className={styles.hint}>
                Injiza inzira nk&apos;iri: <em>John 3:16</em>, <em>Psalm 23</em>, <em>Romans 8:28</em>
            </p>

            <form onSubmit={handleSubmit} className={styles.form} role="search">
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="nk'iri: John 3:16"
                    className={styles.input}
                    aria-label="Shakisha imirongo ya Bibiliya"
                />
                <button
                    type="submit"
                    className={styles.btn}
                    disabled={isPending || !query.trim()}
                >
                    {isPending ? "..." : "Shakisha"}
                </button>
            </form>

            {/* Quick suggestions */}
            <div className={styles.suggestions} aria-label="Amashusho akozwe">
                {suggestions.map(s => (
                    <button
                        key={s}
                        className={styles.pill}
                        onClick={() => { setQuery(s); search(s); }}
                        type="button"
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Error */}
            {error && <p className={styles.error} role="alert">{error}</p>}

            {/* Result */}
            {result && (
                <div className={styles.result}>
                    <blockquote className={styles.verseText}>
                        &ldquo;{result.text}&rdquo;
                    </blockquote>
                    <div className={styles.resultMeta}>
                        <cite className={styles.verseRef}>— {result.reference}</cite>
                        <span className={styles.translation}>{result.translation_name}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
