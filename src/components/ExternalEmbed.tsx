"use client";

import TwitterEmbeds from "@/components/TwitterEmbeds";
import styles from "./ExternalEmbed.module.css";

type Props = {
    url: string;
    title?: string;
};

const twitterStatusUrlPattern =
    /^https?:\/\/(?:www\.|mobile\.)?(?:twitter\.com|x\.com)\/([A-Za-z0-9_]{1,20})\/status(?:es)?\/(\d+)(?:[/?#][^\s"'<>]*)?$/i;
const instagramUrlPattern =
    /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[A-Za-z0-9_-]+\/?(?:[?#][^\s"'<>]*)?$/i;
const facebookPostUrlPattern =
    /^https?:\/\/(?:www\.|m\.)?facebook\.com\/[^\s"'<>]+$/i;
const youtubeUrlPattern =
    /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[&/?#][^\s"'<>]*)?$/i;

function normalizeTweetUrl(url: string) {
    const match = url.match(twitterStatusUrlPattern);
    return match ? `https://twitter.com/${match[1]}/status/${match[2]}` : null;
}

function getHost(url: string) {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
}

export default function ExternalEmbed({ url, title }: Props) {
    const cleanUrl = url.trim();
    if (!cleanUrl) return null;

    const tweetUrl = normalizeTweetUrl(cleanUrl);
    const youtubeMatch = cleanUrl.match(youtubeUrlPattern);

    let content: React.ReactNode;

    if (tweetUrl) {
        content = (
            <blockquote className="twitter-tweet">
                <a href={tweetUrl}>Twitter/X post</a>
            </blockquote>
        );
    } else if (instagramUrlPattern.test(cleanUrl)) {
        content = (
            <blockquote
                className="instagram-media"
                data-instgrm-permalink={cleanUrl}
                data-instgrm-version="14"
            >
                <a href={cleanUrl}>Instagram post</a>
            </blockquote>
        );
    } else if (facebookPostUrlPattern.test(cleanUrl)) {
        content = (
            <div
                className="fb-post"
                data-href={cleanUrl}
                data-width="500"
                data-show-text="true"
            />
        );
    } else if (youtubeMatch) {
        content = (
            <iframe
                className={styles.youtube}
                src={`https://www.youtube-nocookie.com/embed/${youtubeMatch[1]}`}
                title={title || "YouTube video"}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
        );
    } else {
        content = (
            <a className={styles.linkCard} href={cleanUrl} target="_blank" rel="noopener noreferrer">
                <span className={styles.label}>External link</span>
                <strong className={styles.host}>{getHost(cleanUrl)}</strong>
                <span className={styles.url}>{cleanUrl}</span>
            </a>
        );
    }

    return (
        <section className={styles.wrap} aria-label={title || "Embedded link"}>
            {title && <h2 className={styles.title}>{title}</h2>}
            <div className={styles.embed}>{content}</div>
            <TwitterEmbeds />
        </section>
    );
}
