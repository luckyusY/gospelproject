import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import LiveRadioPlayer from "@/components/LiveRadioPlayer";
import YouTubePlaylistEmbed from "@/components/YouTubePlaylistEmbed";
import { DEFAULT_RADIO_STREAM_URL, getPublicSiteSettings } from "@/lib/siteSettings";
import styles from "./tv-radio.module.css";

export const metadata: Metadata = buildMeta({
    title: "Urugero TV & Radio",
    description: "Urugero TV na Radio - amajwi y'Imana, inyigisho, ibitaramo n'ubuhamya buri munsi.",
    path: "/urugero-tv-radio",
});

export default async function UrgeroTvRadioPage() {
    const settings = await getPublicSiteSettings();
    const streamUrl = settings.radio_stream_url ?? DEFAULT_RADIO_STREAM_URL;

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
                <LiveRadioPlayer
                    streamUrl={streamUrl}
                    stationName={settings.radio_station_name ?? "Urugero Live Radio"}
                />
                <YouTubePlaylistEmbed
                    title="Amashusho yose ya Urugero TV"
                    playlistId="UU_ifGgLzPhW4lRUIA95lfEQ"
                    channelUrl="https://www.youtube.com/@Urugerotv-r4o"
                />
            </div>
        </div>
    );
}
