"use client";

import { Pause, Play, RadioButton, Waveform } from "@phosphor-icons/react";
import { useSharedRadio } from "@/hooks/useSharedRadio";
import styles from "./LiveRadioPlayer.module.css";

type Props = {
    streamUrl: string;
    stationName?: string;
    compact?: boolean;
};

export default function LiveRadioPlayer({ streamUrl, stationName = "Urugero Live Radio", compact = false }: Props) {
    const radio = useSharedRadio(streamUrl);
    const statusText = radio.status === "playing"
        ? "Radio irimo gucuranga"
        : radio.status === "loading"
            ? "Radio irimo gufunguka"
            : radio.status === "error"
                ? "Radio yananiwe gufunguka"
                : "Kanda play wumve radio";

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

            <div className={`${styles.wave} ${radio.isPlaying ? styles.waveActive : ""}`} aria-hidden>
                <Waveform size={24} weight="bold" />
                <span />
                <span />
                <span />
            </div>

            <div className={styles.controls}>
                <button
                    type="button"
                    className={styles.playButton}
                    onClick={radio.toggle}
                    aria-label={radio.isPlaying ? "Pause live radio" : "Play live radio"}
                    aria-pressed={radio.isPlaying}
                >
                    {radio.isPlaying
                        ? <Pause size={18} weight="fill" />
                        : <Play size={18} weight="fill" />
                    }
                </button>
                <span className={styles.status}>{statusText}</span>
            </div>
        </section>
    );
}
