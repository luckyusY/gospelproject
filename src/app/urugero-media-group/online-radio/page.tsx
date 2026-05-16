import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/metadata";
import LiveRadioPlayer from "@/components/LiveRadioPlayer";
import { DEFAULT_RADIO_STREAM_URL, getPublicSiteSettings } from "@/lib/siteSettings";
import styles from "./online-radio.module.css";

export const metadata: Metadata = buildMeta({
    title: "Urugero Online Radio",
    description: "Urugero Online Radio isakaza amajwi y'Imana buri munsi.",
    path: "/urugero-media-group/online-radio",
});

export default async function OnlineRadioPage() {
    const settings = await getPublicSiteSettings();
    const streamUrl = settings.radio_stream_url ?? DEFAULT_RADIO_STREAM_URL;

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

            <div className={`container ${styles.content}`}>
                <LiveRadioPlayer
                    streamUrl={streamUrl}
                    stationName={settings.radio_station_name ?? "Urugero Live Radio"}
                />
            </div>
        </div>
    );
}
