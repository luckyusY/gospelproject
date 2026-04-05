import type { Metadata } from "next";

const SITE_NAME = "Urugero Media";
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? "https://urugero.rw";
const SITE_DESC = "Urugero Media Group — Ubuhamya, Inyigisho n'Imyidagaduro y'Imana mu Rwanda no ku isi yose.";

/**
 * Build consistent page metadata.
 * Usage: export const metadata = buildMeta({ title: "Amakuru", description: "..." });
 */
export function buildMeta(opts: {
    title:        string;
    description:  string;
    path?:        string;
    image?:       string;
    noIndex?:     boolean;
}): Metadata {
    const url   = `${SITE_URL}${opts.path ?? ""}`;
    const image = opts.image ?? `${SITE_URL}/og-default.png`;

    return {
        title:       `${opts.title} — ${SITE_NAME}`,
        description: opts.description,
        metadataBase: new URL(SITE_URL),
        alternates: { canonical: url },
        robots: opts.noIndex
            ? { index: false, follow: false }
            : { index: true,  follow: true  },

        openGraph: {
            title:       `${opts.title} — ${SITE_NAME}`,
            description: opts.description,
            url,
            siteName:    SITE_NAME,
            locale:      "rw_RW",
            type:        "website",
            images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
        },

        twitter: {
            card:        "summary_large_image",
            title:       `${opts.title} — ${SITE_NAME}`,
            description: opts.description,
            images:      [image],
        },
    };
}

/** Root/fallback metadata used in layout.tsx */
export const rootMetadata: Metadata = {
    title: {
        default:  `${SITE_NAME} — Ubuhamya · Inyigisho · Imyidagaduro`,
        template: `%s — ${SITE_NAME}`,
    },
    description:  SITE_DESC,
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    keywords: ["Urugero", "Media", "Rwanda", "Gospel", "Ubukristu", "Inyigisho", "Ubuhamya"],
    authors: [{ name: "Urugero Media Group", url: SITE_URL }],
    creator: "Urugero Media Group",

    openGraph: {
        title:    `${SITE_NAME} — Ubuhamya · Inyigisho · Imyidagaduro`,
        description: SITE_DESC,
        url:      SITE_URL,
        siteName: SITE_NAME,
        locale:   "rw_RW",
        type:     "website",
    },

    twitter: {
        card:  "summary_large_image",
        title: `${SITE_NAME} — Ubuhamya · Inyigisho · Imyidagaduro`,
        description: SITE_DESC,
    },

    robots: { index: true, follow: true },
};
