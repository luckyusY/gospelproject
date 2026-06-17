"use client";

import { useState } from "react";
import { ShareNetwork, Check } from "@phosphor-icons/react";
import styles from "./ShareIconButton.module.css";

type Props = {
    /** Absolute canonical URL to share (use absoluteUrl(...) on the server). */
    url: string;
    title: string;
    className?: string;
};

/**
 * Compact circular share button for cards. Uses the native share sheet when
 * available (mobile), otherwise copies the link. Stops propagation so it can
 * sit on top of a card without triggering the card's link.
 */
export default function ShareIconButton({ url, title, className }: Props) {
    const [copied, setCopied] = useState(false);

    async function handleShare(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
            try {
                await navigator.share({ title, url });
            } catch {
                /* user dismissed the share sheet — ignore */
            }
            return;
        }

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard unavailable — ignore */
        }
    }

    return (
        <button
            type="button"
            onClick={handleShare}
            className={`${styles.btn} ${className ?? ""}`}
            aria-label={`Sangiza: ${title}`}
            title="Sangiza inshuti"
        >
            {copied
                ? <Check size={16} weight="bold" aria-hidden />
                : <ShareNetwork size={16} weight="fill" aria-hidden />}
        </button>
    );
}
