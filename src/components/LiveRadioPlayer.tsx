"use client";

import { RadioButton, Waveform } from "@phosphor-icons/react";
import styles from "./LiveRadioPlayer.module.css";

type Props = {
    streamUrl: string;
    stationName?: string;
    compact?: boolean;
};

export default function LiveRadioPlayer({ streamUrl, stationName = "Urugero Live Radio", compact = false }: Props) {
    return (
        <section className={`${styles.player} ${compact ? styles.compact : ""}`} aria-label="Live radio">
            <div className={styles.header}>
                <span className={styles.liveBadge}>
                    <RadioButton size={13} weight="fill" />
                    LIVE
                </span>
                <div>
                    <h2>{stationName}</h2>
                    <p>Umva radio ya Gospel live hano ku rubuga.</p>
                </div>
            </div>

            <div className={styles.wave} aria-hidden>
                <Waveform size={24} weight="bold" />
                <span />
                <span />
                <span />
            </div>

            <audio controls src={streamUrl} className={styles.audio}>
                Your browser does not support the audio element.
            </audio>
        </section>
    );
}
