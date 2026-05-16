"use client";

import { useMemo, useState } from "react";
import { Broadcast, ClipboardText, RadioButton, Waveform } from "@phosphor-icons/react";
import styles from "./LiveRadioTool.module.css";

type Props = {
    defaultStreamUrl?: string;
};

export default function LiveRadioTool({ defaultStreamUrl = "" }: Props) {
    const [streamUrl, setStreamUrl] = useState(defaultStreamUrl);
    const [copied, setCopied] = useState(false);

    const embedCode = useMemo(() => {
        const src = streamUrl.trim() || "YOUR_STREAM_URL";
        return `<audio controls src="${src}"></audio>`;
    }, [streamUrl]);

    async function copyEmbedCode() {
        await navigator.clipboard.writeText(embedCode);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    }

    return (
        <section className={styles.tool} aria-labelledby="radio-live-title">
            <div className={styles.panel}>
                <div className={styles.panelHeader}>
                    <span className={styles.statusBadge}>
                        <RadioButton size={14} weight="fill" />
                        LIVE TOOL
                    </span>
                    <h2 id="radio-live-title" className={styles.title}>Radio ijye live</h2>
                    <p className={styles.description}>
                        Shyiramo stream URL ya radio, abumva bahite bayumvira hano ku rubuga.
                    </p>
                </div>

                <label className={styles.field}>
                    <span>Stream URL</span>
                    <input
                        value={streamUrl}
                        onChange={(event) => setStreamUrl(event.target.value)}
                        placeholder="https://your-radio-host/live.mp3"
                        type="url"
                        inputMode="url"
                    />
                </label>

                <div className={styles.playerWrap}>
                    {streamUrl.trim() ? (
                        <audio controls src={streamUrl.trim()} className={styles.audio}>
                            Your browser does not support the audio element.
                        </audio>
                    ) : (
                        <div className={styles.emptyPlayer}>
                            <Waveform size={26} weight="bold" />
                            <span>Tegura stream URL kugira ngo player itangire gukora.</span>
                        </div>
                    )}
                </div>

                <div className={styles.actions}>
                    <a
                        className={styles.primaryAction}
                        href={streamUrl.trim() || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-disabled={!streamUrl.trim()}
                        onClick={(event) => {
                            if (!streamUrl.trim()) event.preventDefault();
                        }}
                    >
                        <Broadcast size={18} weight="fill" />
                        Fungura live stream
                    </a>
                    <button className={styles.secondaryAction} type="button" onClick={copyEmbedCode}>
                        <ClipboardText size={18} weight="fill" />
                        {copied ? "Byandukuwe" : "Copy embed"}
                    </button>
                </div>
            </div>

            <div className={styles.notes}>
                <h3>Uko bikoreshwa</h3>
                <p>
                    Ushobora gushyira `NEXT_PUBLIC_RADIO_STREAM_URL` muri `.env.local` kugira ngo live
                    player ihore ifite stream ya radio. Ushobora no gukoresha iyi box igihe ushaka
                    kugerageza stream nshya mbere yo kuyishyira ku rubuga.
                </p>
            </div>
        </section>
    );
}
