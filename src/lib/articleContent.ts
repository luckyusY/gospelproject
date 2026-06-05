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

function tweetEmbed(url: string) {
    return `<blockquote class="twitter-tweet"><a href="${url}"></a></blockquote>`;
}

export function renderArticleContent(content: string) {
    return sanitizeArticleContent(content)
        .replace(
            /<p>\s*<a\b[^>]*href=(["'])([^"']+)\1[^>]*>[\s\S]*?<\/a>\s*<\/p>/gi,
            (full, _quote: string, href: string) => {
                const tweetUrl = getTweetUrl(href);
                return tweetUrl ? tweetEmbed(tweetUrl) : full;
            },
        )
        .replace(
            /<p>\s*(https?:\/\/(?:www\.|mobile\.)?(?:twitter\.com|x\.com)\/[A-Za-z0-9_]{1,20}\/status(?:es)?\/\d+(?:[/?#][^\s<]*)?)\s*<\/p>/gi,
            (full, href: string) => {
                const tweetUrl = getTweetUrl(href);
                return tweetUrl ? tweetEmbed(tweetUrl) : full;
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
