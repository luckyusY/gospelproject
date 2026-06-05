import sanitizeHtml from "sanitize-html";

const allowedTags = [
    "h2",
    "h3",
    "h4",
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "blockquote",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "figure",
    "figcaption",
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "hr",
    "span",
    "pre",
    "code",
] as const;

const twitterStatusUrlPattern =
    /^https?:\/\/(?:www\.|mobile\.)?(?:twitter\.com|x\.com)\/([A-Za-z0-9_]{1,20})\/status(?:es)?\/(\d+)(?:[/?#][^\s"'<>]*)?$/i;
const instagramUrlPattern =
    /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+\/?(?:[?#][^\s"'<>]*)?$/i;
const facebookPostUrlPattern =
    /^https?:\/\/(?:www\.|m\.)?facebook\.com\/[^\s"'<>]+$/i;
const youtubeUrlPattern =
    /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[&/?#][^\s"'<>]*)?$/i;
const standaloneUrlPattern =
    /^https?:\/\/[^\s"'<>]+$/i;

export function isRichHtmlContent(content: string) {
    return /<\/?[a-z][\s\S]*>/i.test(content);
}

function getTweetUrl(value: string) {
    const url = value
        .replace(/&amp;/g, "&")
        .trim();
    const match = url.match(twitterStatusUrlPattern);

    if (!match) return null;

    return `https://twitter.com/${match[1]}/status/${match[2]}`;
}

function cleanUrl(value: string) {
    return value
        .replace(/&amp;/g, "&")
        .trim();
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function tweetEmbed(url: string) {
    return `<blockquote class="twitter-tweet"><a href="${url}"></a></blockquote>`;
}

function instagramEmbed(url: string) {
    return `<blockquote class="instagram-media" data-instgrm-permalink="${escapeHtml(url)}" data-instgrm-version="14"><a href="${escapeHtml(url)}"></a></blockquote>`;
}

function facebookEmbed(url: string) {
    return `<div class="fb-post" data-href="${escapeHtml(url)}" data-width="500" data-show-text="true"></div>`;
}

function youtubeEmbed(url: string) {
    const match = cleanUrl(url).match(youtubeUrlPattern);
    if (!match) return null;

    return `<iframe class="article-embed article-embed-youtube" src="https://www.youtube-nocookie.com/embed/${match[1]}" title="YouTube video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
}

function linkCard(url: string) {
    const safeUrl = escapeHtml(url);
    let host = url;

    try {
        host = new URL(url).hostname.replace(/^www\./, "");
    } catch {
        // Keep the full URL as fallback display text.
    }

    return `<a class="article-link-card" href="${safeUrl}" target="_blank" rel="noopener noreferrer"><span class="article-link-card-label">External link</span><strong>${escapeHtml(host)}</strong><span>${safeUrl}</span></a>`;
}

function embedForUrl(value: string) {
    const url = cleanUrl(value);
    const tweetUrl = getTweetUrl(url);
    if (tweetUrl) return tweetEmbed(tweetUrl);
    if (instagramUrlPattern.test(url)) return instagramEmbed(url);
    if (facebookPostUrlPattern.test(url)) return facebookEmbed(url);

    const youtube = youtubeEmbed(url);
    if (youtube) return youtube;

    if (standaloneUrlPattern.test(url)) return linkCard(url);
    return null;
}

export function renderArticleContent(content: string) {
    return sanitizeArticleContent(content)
        .replace(
            /<p>\s*<a\b[^>]*href=(["'])([^"']+)\1[^>]*>[\s\S]*?<\/a>\s*<\/p>/gi,
            (full, _quote: string, href: string) => {
                return embedForUrl(href) ?? full;
            },
        )
        .replace(
            /<p>\s*(https?:\/\/[^\s<]+)\s*<\/p>/gi,
            (full, href: string) => {
                return embedForUrl(href) ?? full;
            },
        );
}

export function sanitizeArticleContent(content: string) {
    return sanitizeHtml(content, {
        allowedTags: [...allowedTags],
        allowedAttributes: {
            a: ["href", "target", "rel", "title"],
            img: ["src", "alt", "title", "width", "height", "loading"],
            blockquote: ["class"],
            th: ["colspan", "rowspan"],
            td: ["colspan", "rowspan"],
            span: ["style"],
            p: ["style"],
            h2: ["style"],
            h3: ["style"],
            h4: ["style"],
        },
        allowedSchemes: ["http", "https", "mailto", "tel"],
        transformTags: {
            a: sanitizeHtml.simpleTransform("a", {
                rel: "noopener noreferrer",
            }),
            img: sanitizeHtml.simpleTransform("img", {
                loading: "lazy",
            }),
        },
        allowedStyles: {
            "*": {
                "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
            },
        },
    }).trim();
}
