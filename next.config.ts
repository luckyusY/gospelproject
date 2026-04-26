import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {
        root: process.cwd(),
    },

    // ── Images ────────────────────────────────────────────
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "cdn.sanity.io" },
            { protocol: "https", hostname: "images.pexels.com" },
            { protocol: "https", hostname: "i.ytimg.com" },          // YouTube thumbnails
            { protocol: "https", hostname: "img.youtube.com" },      // YouTube thumbnails alt
            { protocol: "https", hostname: "lh3.googleusercontent.com" },
            { protocol: "https", hostname: "qtgmcbdkfqnwqshtimpz.supabase.co" }, // Supabase storage
            { protocol: "https", hostname: "res.cloudinary.com" },               // Cloudinary uploads
        ],
    },

    // ── Security Headers ──────────────────────────────────
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "X-Frame-Options",         value: "DENY" },
                    { key: "X-Content-Type-Options",   value: "nosniff" },
                    { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
                    { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
                    {
                        key:   "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                ],
            },
        ];
    },

    // ── Redirects (legacy routes → new Kinyarwanda routes) ─
    async redirects() {
        return [
            { source: "/news",          destination: "/amakuru",   permanent: false },
            { source: "/study",         destination: "/inyigisho", permanent: false },
            { source: "/life",          destination: "/inyigisho/umuryango", permanent: false },
            { source: "/entertainment", destination: "/amakuru/abahanzi",    permanent: false },
        ];
    },
};

export default nextConfig;
