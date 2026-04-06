"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./YoutubeEmbed.module.css";

type Props = {
    videoId:    string;
    title:      string;
    /** Optional description shown below the player */
    description?: string;
    /** Aspect ratio class — default 16/9 */
    aspect?: "16/9" | "4/3" | "1/1";
};

export default function YoutubeEmbed({ videoId, title, description, aspect = "16/9" }: Props) {
    const [playing, setPlaying] = useState(false);
    const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    return (
        <div className={styles.wrap}>
            <div
                className={styles.playerBox}
                style={{ aspectRatio: aspect }}
            >
                {playing ? (
                    <iframe
                        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className={styles.iframe}
                        loading="lazy"
                    />
                ) : (
                    <button
                        className={styles.thumbnailBtn}
                        onClick={() => setPlaying(true)}
                        aria-label={`Tangira video: ${title}`}
                    >
                        <Image
                            src={thumb}
                            alt={title}
                            fill
                            className={styles.thumb}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {/* Dark overlay */}
                        <span className={styles.overlay} aria-hidden />
                        {/* Play button */}
                        <span className={styles.playBtn} aria-hidden>
                            <svg viewBox="0 0 68 48" width="68" height="48" fill="none">
                                <rect width="68" height="48" rx="10" fill="rgba(0,0,0,0.75)" />
                                <path d="M26 16l22 16-22 16V16z" fill="white" />
                            </svg>
                        </span>
                        {/* Title overlay */}
                        <span className={styles.videoTitle}>{title}</span>
                    </button>
                )}
            </div>
            {description && <p className={styles.description}>{description}</p>}
        </div>
    );
}
