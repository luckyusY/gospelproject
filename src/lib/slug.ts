/**
 * Turn any string into a URL-safe slug: lowercase ASCII letters, digits and
 * hyphens only. Strips accents and punctuation (e.g. a trailing "?" that would
 * otherwise break the public URL by being read as a query string).
 */
export function sanitizeSlug(value: string): string {
    return value
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "") // remove accent marks
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")     // any run of non-alphanumerics -> single dash
        .replace(/^-+|-+$/g, "")         // trim leading/trailing dashes
        .slice(0, 96)
        .replace(/-+$/, "");             // re-trim if slicing left a trailing dash
}
