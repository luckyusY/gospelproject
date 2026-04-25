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

export function isRichHtmlContent(content: string) {
    return /<\/?[a-z][\s\S]*>/i.test(content);
}

export function sanitizeArticleContent(content: string) {
    return sanitizeHtml(content, {
        allowedTags: [...allowedTags],
        allowedAttributes: {
            a: ["href", "target", "rel", "title"],
            img: ["src", "alt", "title", "width", "height", "loading"],
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
