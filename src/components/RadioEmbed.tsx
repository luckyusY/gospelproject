"use client";

import { useState } from "react";
import { Play, RadioButton, ArrowSquareOut, X } from "@phosphor-icons/react";
import styles from "./RadioEmbed.module.css";

type Props = {
    embedUrl:     string;
    stationName?: string;
    /** Height of the embedded player frame in px (default 480). */
    height?:      number;
};

/**
 * Embeds an external radio station's own web player in an iframe so its
 * JavaScript resolves and plays the live stream — useful when the host
 * (e.g. listen2myradio / radio12345) doesn't expose a direct stream URL.
 *
 * Loads on click (not on page load) so visitors don't pay for the heavy
 * third-party page unless they want the radio, and so the click counts as a
 * user gesture for autoplay.
 */
export default function RadioEmbed({ embedUrl, stationName = "Urugero Online Radio", height = 480 }: Props) {
    const [loaded, setLoaded] = useState(false);
    const url = embedUrl.trim();
    if (!url) return null;

    return (
        <section className={styles.card} aria-label="Live radio">
            <div className={styles.header}>
                <span className={styles.liveBadge}>
                    <RadioButton size={13} weight="fill" />
                    LIVE
                </span>
                <div className={styles.headText}>
                    <h2>{stationName}</h2>
                    <p>Umva radio ya Gospel live hano ku rubuga.</p>
                </div>
                {loaded && (
                    <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={() => setLoaded(false)}
                        aria-label="Funga radio"
                        title="Funga radio"
                    >
                        <X size={16} weight="bold" />
                    </button>
                )}
            </div>

            {loaded ? (
                <div className={styles.frameWrap} style={{ height }}>
                    <iframe
                        src={url}
                        title={`${stationName} live player`}
                        className={styles.frame}
                        loading="lazy"
                        allow="autoplay; encrypted-media; fullscreen"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            ) : (
                <button type="button" className={styles.poster} onClick={() => setLoaded(true)}>
                    <span className={styles.playCircle}>
                        <Play size={26} weight="fill" />
                    </span>
                    <span className={styles.posterTitle}>Fungura Radio Live</span>
                    <span className={styles.posterHint}>
                        Kanda hano kugira ngo radio ifunguke maze utangire kumva.
                    </span>
                </button>
            )}

            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.openLink}
            >
                <ArrowSquareOut size={13} weight="bold" />
                Fungura kuri tab nshya
            </a>
        </section>
    );
}
