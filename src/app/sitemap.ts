import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://urugero.rw";

// All static routes — update frequencies reflect content volatility
export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        // ── Core ─────────────────────────────────────────
        { url: BASE,                       lastModified: now, changeFrequency: "daily",   priority: 1.0 },
        { url: `${BASE}/abo-turibo`,       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE}/contact`,          lastModified: now, changeFrequency: "monthly", priority: 0.6 },
        { url: `${BASE}/tumenye-bibiliya`, lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
        { url: `${BASE}/urugero-tv-radio`, lastModified: now, changeFrequency: "daily",   priority: 0.9 },

        // ── Amakuru ──────────────────────────────────────
        { url: `${BASE}/amakuru`,                       lastModified: now, changeFrequency: "daily",   priority: 0.9 },
        { url: `${BASE}/amakuru/abahanzi`,              lastModified: now, changeFrequency: "daily",   priority: 0.8 },
        { url: `${BASE}/amakuru/amakorali`,             lastModified: now, changeFrequency: "daily",   priority: 0.8 },
        { url: `${BASE}/amakuru/amatorero`,             lastModified: now, changeFrequency: "daily",   priority: 0.8 },
        { url: `${BASE}/amakuru/abanyempano`,           lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
        { url: `${BASE}/amakuru/ibitaramo`,             lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
        { url: `${BASE}/amakuru/hanze-yu-rwanda`,       lastModified: now, changeFrequency: "daily",   priority: 0.7 },

        // ── Ubuhamya & Ibigwi ─────────────────────────────
        { url: `${BASE}/ubuhamya`,                      lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
        { url: `${BASE}/ibigwi`,                        lastModified: now, changeFrequency: "weekly",  priority: 0.7 },

        // ── Inyigisho ────────────────────────────────────
        { url: `${BASE}/inyigisho`,                     lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
        { url: `${BASE}/inyigisho/umuryango`,           lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
        { url: `${BASE}/inyigisho/abana`,               lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
        { url: `${BASE}/inyigisho/urubyiruko`,          lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
        { url: `${BASE}/inyigisho/abagabo`,             lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
        { url: `${BASE}/inyigisho/abagore`,             lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
        { url: `${BASE}/inyigisho/ubuzima-bwumwuka`,    lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
        { url: `${BASE}/inyigisho/bible-quiz`,          lastModified: now, changeFrequency: "weekly",  priority: 0.8 },

        // ── Urugero Media Group ───────────────────────────
        { url: `${BASE}/urugero-media-group`,                      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
        { url: `${BASE}/urugero-media-group/music-academy`,        lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE}/urugero-media-group/films`,                lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
        { url: `${BASE}/urugero-media-group/records`,              lastModified: now, changeFrequency: "monthly", priority: 0.6 },
        { url: `${BASE}/urugero-media-group/music-talent`,         lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE}/urugero-media-group/online-radio`,         lastModified: now, changeFrequency: "daily",   priority: 0.9 },
        { url: `${BASE}/urugero-media-group/bible-quiz`,           lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
        { url: `${BASE}/urugero-media-group/practice-room`,        lastModified: now, changeFrequency: "monthly", priority: 0.6 },
        { url: `${BASE}/urugero-media-group/podcast`,              lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    ];

    return staticRoutes;
}
