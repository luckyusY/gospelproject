import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/metadata";
import LiveRadioTool from "@/components/LiveRadioTool";
import styles from "./online-radio.module.css";

export const metadata: Metadata = buildMeta({
    title: "Urugero Online Radio",
    description: "Urugero Online Radio isakaza amajwi y'Imana buri munsi.",
    path: "/urugero-media-group/online-radio",
});

export default function OnlineRadioPage() {
    const streamUrl = process.env.NEXT_PUBLIC_RADIO_STREAM_URL ?? "";

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className="container">
                    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                        <Link href="/">Ahabanza</Link>
                        <span>/</span>
                        <Link href="/urugero-media-group">Urugero Media Group</Link>
                    </nav>
                    <p className={styles.eyebrow}>URUGERO MEDIA GROUP</p>
                    <h1 className={styles.title}>Urugero Online Radio</h1>
                    <p className={styles.description}>
                        Urugero Online Radio isakaza amajwi y&apos;Imana buri munsi binyuze
                        mu makuru, inyigisho n&apos;indirimbo z&apos;Imana.
                    </p>
                </div>
            </section>

            <div className="container">
                <LiveRadioTool defaultStreamUrl={streamUrl} />
            </div>
        </div>
    );
}
