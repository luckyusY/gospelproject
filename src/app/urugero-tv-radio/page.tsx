import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import LiveRadioTool from "@/components/LiveRadioTool";
import YouTubePlaylistEmbed from "@/components/YouTubePlaylistEmbed";
import styles from "./tv-radio.module.css";

export const metadata: Metadata = buildMeta({
    title: "Urugero TV & Radio",
    description: "Urugero TV na Radio - amajwi y'Imana, inyigisho, ibitaramo n'ubuhamya buri munsi.",
    path: "/urugero-tv-radio",
});

export default function UrgeroTvRadioPage() {
    const streamUrl = process.env.NEXT_PUBLIC_RADIO_STREAM_URL ?? "";

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className="container">
                    <p className={styles.eyebrow}>URUGERO MEDIA GROUP</p>
                    <h1 className={styles.title}>Urugero TV &amp; Radio</h1>
                    <p className={styles.description}>
                        Urugero TV na Radio ni ahantu usangirira amajwi y&apos;Imana,
                        inyigisho, ibitaramo n&apos;ubuhamya buri munsi.
                    </p>
                </div>
            </section>

            <div className={`container ${styles.content}`}>
                <LiveRadioTool defaultStreamUrl={streamUrl} />
                <YouTubePlaylistEmbed
                    title="Amashusho yose ya Urugero TV"
                    playlistId="UU_ifGgLzPhW4lRUIA95lfEQ"
                    channelUrl="https://www.youtube.com/@Urugerotv-r4o"
                />
            </div>
        </div>
    );
}
