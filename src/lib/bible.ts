// ── bible-api.com helper ──────────────────────────────────
// Free, no API key, no rate limits mentioned.
// Docs: https://bible-api.com/
// Translations: kjv (King James), web (World English Bible — default)

const BASE = "https://bible-api.com";
const TRANSLATION = "kjv";

export type BibleVerse = {
    reference: string;
    text:      string;
    translation_name: string;
};

export type BibleChapter = {
    reference: string;
    verses: { verse: number; text: string }[];
    translation_name: string;
};

/** Fetch a single verse or passage, e.g. "John 3:16" or "Psalm 23:1-6" */
export async function fetchVerse(ref: string): Promise<BibleVerse | null> {
    try {
        const encoded = encodeURIComponent(ref);
        const res = await fetch(
            `${BASE}/${encoded}?translation=${TRANSLATION}`,
            { next: { revalidate: 86400 } } // cache 24 h
        );
        if (!res.ok) return null;
        const data = await res.json() as {
            reference: string;
            text: string;
            translation_name: string;
        };
        return {
            reference:        data.reference,
            text:             data.text.trim(),
            translation_name: data.translation_name,
        };
    } catch {
        return null;
    }
}

/** Fetch a full chapter, e.g. "John 3" */
export async function fetchChapter(book: string, chapter: number): Promise<BibleChapter | null> {
    try {
        const ref = `${book}+${chapter}`;
        const res = await fetch(
            `${BASE}/${ref}?translation=${TRANSLATION}`,
            { next: { revalidate: 86400 } }
        );
        if (!res.ok) return null;
        const data = await res.json() as {
            reference: string;
            translation_name: string;
            verses: { verse: number; text: string }[];
        };
        return {
            reference:        data.reference,
            translation_name: data.translation_name,
            verses:           data.verses,
        };
    } catch {
        return null;
    }
}

// ── Daily verse pool (rotates by day of year) ────────────
const DAILY_VERSE_POOL = [
    "John 3:16",    "Psalm 23:1",   "Philippians 4:13", "Romans 8:28",
    "Jeremiah 29:11","John 14:6",   "Proverbs 3:5",     "Isaiah 40:31",
    "Matthew 11:28","2 Timothy 1:7","Romans 8:1",        "Psalm 46:1",
    "John 10:10",   "Ephesians 2:8","1 Corinthians 13:13","Galatians 5:22",
    "Psalm 119:105","Matthew 6:33", "Romans 12:2",       "Joshua 1:9",
    "Hebrews 11:1", "1 John 4:8",   "Matthew 28:19",     "Colossians 3:23",
    "Psalm 27:1",   "Romans 1:16",  "2 Corinthians 5:17","Proverbs 22:6",
    "Psalm 37:4",   "Micah 6:8",    "Isaiah 53:5",       "Acts 1:8",
];

export function getDailyVerseRef(): string {
    const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return DAILY_VERSE_POOL[dayOfYear % DAILY_VERSE_POOL.length] ?? "John 3:16";
}
