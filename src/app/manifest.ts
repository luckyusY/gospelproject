import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name:             "Urugero Media",
        short_name:       "Urugero",
        description:      "Urugero Media Group — Ubuhamya, Inyigisho n'Imyidagaduro y'Imana",
        start_url:        "/",
        display:          "standalone",
        background_color: "#0D1B2E",
        theme_color:      "#F59E0B",
        orientation:      "portrait",
        lang:             "rw",
        icons: [
            { src: "/icon-192.png",  sizes: "192x192",  type: "image/png" },
            { src: "/icon-512.png",  sizes: "512x512",  type: "image/png" },
            { src: "/icon-mask.png", sizes: "512x512",  type: "image/png", purpose: "maskable" },
        ],
        categories: ["news", "entertainment", "education", "religion"],
    };
}
