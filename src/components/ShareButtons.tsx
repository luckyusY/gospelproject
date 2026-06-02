"use client";

import { useEffect, useState } from "react";
import {
    ShareNetwork,
    WhatsappLogo,
    FacebookLogo,
    TwitterLogo,
    TelegramLogo,
    LinkSimple,
    Check,
} from "@phosphor-icons/react";
import styles from "./ShareButtons.module.css";

type Props = {
    /** Absolute canonical URL (server-rendered fallback). */
    url:   string;
    title: string;
};

export default function ShareButtons({ url, title }: Props) {
    // Start from the server-provided canonical URL, then replace with the real
    // address the visitor is actually on — guarantees the correct link is shared
    // even if the canonical/site-URL config is wrong.
    const [shareUrl, setShareUrl] = useState(url);
    const [canNativeShare, setCanNativeShare] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Sync browser-only values once on mount (real URL + share capability).
        /* eslint-disable react-hooks/set-state-in-effect */
        if (typeof window !== "undefined") {
            setShareUrl(window.location.href);
        }
        if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
            setCanNativeShare(true);
        }
        /* eslint-enable react-hooks/set-state-in-effect */
    }, []);

    const enc = encodeURIComponent;
    const waText = `${title} ${shareUrl}`;
    const links = {
        whatsapp: `https://wa.me/?text=${enc(waText)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}`,
        x:        `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(shareUrl)}`,
        telegram: `https://t.me/share/url?url=${enc(shareUrl)}&text=${enc(title)}`,
    };

    async function nativeShare() {
        try {
            await navigator.share({ title, url: shareUrl });
        } catch {
            /* user dismissed the share sheet — ignore */
        }
    }

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const ta = document.createElement("textarea");
            ta.value = shareUrl;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
            document.body.removeChild(ta);
        }
    }

    return (
        <div className={styles.share}>
            <span className={styles.label}>
                <ShareNetwork size={18} weight="bold" aria-hidden /> Sangiza inshuti
            </span>

            <div className={styles.buttons}>
                {canNativeShare && (
                    <button type="button" onClick={nativeShare} className={`${styles.btn} ${styles.native}`}>
                        <ShareNetwork size={17} weight="fill" aria-hidden /> Sangira
                    </button>
                )}

                <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.whatsapp}`}>
                    <WhatsappLogo size={17} weight="fill" aria-hidden /> WhatsApp
                </a>
                <a href={links.facebook} target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.facebook}`}>
                    <FacebookLogo size={17} weight="fill" aria-hidden /> Facebook
                </a>
                <a href={links.x} target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.x}`}>
                    <TwitterLogo size={17} weight="fill" aria-hidden /> X
                </a>
                <a href={links.telegram} target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.telegram}`}>
                    <TelegramLogo size={17} weight="fill" aria-hidden /> Telegram
                </a>

                <button type="button" onClick={copyLink} className={`${styles.btn} ${styles.copy}`}>
                    {copied
                        ? <><Check size={17} weight="bold" aria-hidden /> Byakoporowe!</>
                        : <><LinkSimple size={17} weight="bold" aria-hidden /> Koporora link</>}
                </button>
            </div>
        </div>
    );
}
