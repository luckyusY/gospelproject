/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import LiveRadioPlayer from "@/components/LiveRadioPlayer";
import RadioComments from "@/components/RadioComments";
import YouTubePlaylistEmbed from "@/components/YouTubePlaylistEmbed";
import { YoutubeEmbed } from "@/components/ui";
import { DEFAULT_RADIO_STREAM_URL, getPublicSiteSettings } from "@/lib/siteSettings";
import { getPage } from "@/lib/pages";
import { supabase } from "@/lib/supabase";
import type { VideoRow } from "@/types/database";
import styles from "./tv-radio.module.css";

export const revalidate = 60;

export const metadata: Metadata = buildMeta({
    title: "Urugero TV & Radio",
    description: "Urugero TV na Radio - amajwi y'Imana, inyigisho, ibitaramo n'ubuhamya buri munsi.",
    path: "/urugero-tv-radio",
});

type TvVideo = {
    videoId: string;
    title: string;
    description: string;
    category?: string;
};

type ProgramCard = {
    title: string;
    text: string;
    href: string;
};

const DEFAULT_CHANNEL_URL = "https://www.youtube.com/@Urugerotv-r4o";
const DEFAULT_PLAYLIST_ID = "UU_ifGgLzPhW4lRUIA95lfEQ";

const fallbackFeaturedVideos: TvVideo[] = [
    {
        videoId: "a1IfX2-RIrk",
        title: "Aciye impaka abahangisha King James na Mbonyi",
        description: "Ibaruwa ifunguye n'ubutumwa bwubaka ku bahanzi n'abakunzi ba Gospel.",
        category: "Ibiganiro",
    },
    {
        videoId: "j2mcUosjKKc",
        title: "Ibyahishwe: Vestine na Dorcas",
        description: "Ikiganiro gicukumbura amakuru n'ibitekerezo by'abakunzi ba Gospel.",
        category: "Amakuru",
    },
    {
        videoId: "BlhLoe_YYP4",
        title: "Ibaruwa ifunguye ivuye ku mutima",
        description: "Inkuru y'urukundo, amarangamutima n'ubuzima bwa buri munsi.",
        category: "Ubuzima",
    },
];
const heroVideo = fallbackFeaturedVideos[0] as TvVideo;

const fallbackLatestVideos: TvVideo[] = [
    {
        videoId: "u5TFSRPjUdE",
        title: "Amakuru mashya ya Gospel",
        description: "Amakuru agezweho ya Urugero TV n'ibivugwa mu muryango wa Gospel.",
    },
    {
        videoId: "yhK2yce8kfs",
        title: "Ricard na Ruvuyanga babwizanyije ukuri",
        description: "Ikiganiro gikurikirana amakuru agezweho n'ibitekerezo by'abareba Urugero TV.",
    },
    {
        videoId: "Crauyv3Fggg",
        title: "Hantavirus: isi yahiye ubwoba",
        description: "Amakuru n'ubusesenguzi ku bibazo bikomeye bivugwa ku isi.",
    },
    {
        videoId: "9WG6gbM1kwI",
        title: "Papi na Dorcas babwiye iki abanya Kenya na Tanzania?",
        description: "Amakuru y'abahanzi n'ubutumwa bwabo ku bakunzi ba Gospel.",
    },
    {
        videoId: "7-ZjQkkujxw",
        title: "Kamanzi vs Hoziana YouTube",
        description: "Ikiganiro ku bibazo bya YouTube, abahanzi n'uburyo amakuru atambuka.",
    },
    {
        videoId: "22yPGIBvx88",
        title: "Ibyahishwe inyuma y'ikibazo cya Pastor Mutesi",
        description: "Amakuru akomeye n'ibisobanuro by'ingenzi ku byavuzwe.",
    },
    {
        videoId: "0IpAxJNyd2U",
        title: "Kiliziya Gatolika yatangiye iperereza rikomeye",
        description: "Inkuru ikurikiranwa n'abantu benshi mu Rwanda no hanze yarwo.",
    },
    {
        videoId: "eeQbH5I_S-A",
        title: "Amakuru y'impeta, urukundo, Israel n'inzozi",
        description: "Ikiganiro cyimbitse ku buzima, urugendo n'intego z'umushyitsi.",
    },
];

const fallbackSportsVideos: TvVideo[] = [
    {
        videoId: "hdcWJLKejn0",
        title: "Inshundura Sports News: Rayon, Mukura na Marine",
        description: "Amakuru mashya ya Rayon Sports n'ibivugwa mu makipe yo mu Rwanda.",
    },
    {
        videoId: "5Ihqq2jcKHM",
        title: "Inshundura Sports News: ubutumwa ku Rayon Sport",
        description: "Umutoza w'Amagaju n'ubutumwa yageneye abakunzi ba ruhago.",
    },
    {
        videoId: "EadgrQpJ7oA",
        title: "Ukuri ku byavuzwe kuri Gorilla na Rayon Sport",
        description: "Ubusobanuro ku mukino, abakinnyi n'ibivugwa mu bakunzi b'umupira.",
    },
];

const fallbackLibraryVideos: TvVideo[] = [
    { videoId: "YRRNCbtzGh0", title: "Urugero TV video 1", description: "Reba kuri YouTube" },
    { videoId: "4nW5S6-_RdE", title: "Urugero TV video 2", description: "Reba kuri YouTube" },
    { videoId: "pgb3Dblq8So", title: "Urugero TV video 3", description: "Reba kuri YouTube" },
    { videoId: "_V5GbAkfioc", title: "Urugero TV video 4", description: "Reba kuri YouTube" },
    { videoId: "vRuEuhVHNU4", title: "Urugero TV video 5", description: "Reba kuri YouTube" },
    { videoId: "liSLPETkyJY", title: "Urugero TV video 6", description: "Reba kuri YouTube" },
    { videoId: "_hBAT5IP3Cc", title: "Urugero TV video 7", description: "Reba kuri YouTube" },
    { videoId: "dtxhlmfkGnI", title: "Urugero TV video 8", description: "Reba kuri YouTube" },
];

const fallbackProgramCards: ProgramCard[] = [
    { title: "Live Radio", text: "Indirimbo, inyigisho n'amakuru byumvikana buri munsi.", href: "#radio-live" },
    { title: "Urugero TV", text: "Ibiganiro, amakuru, ubuhamya n'inkuru zigezweho.", href: "#featured-videos" },
    { title: "Sport Gospel", text: "Inshundura Sports News n'inkuru za ruhago.", href: "#sports" },
    { title: "Video Library", text: "Playlist yose ya YouTube iri hano ku rubuga.", href: "#playlist" },
];

function videosForSection(videos: VideoRow[], sections: string[], fallback: TvVideo[], category?: string): TvVideo[] {
    const rows = videos
        .filter(video => sections.includes(video.section))
        .map(video => ({
            videoId: video.youtube_id,
            title: video.title,
            description: video.description,
            category,
        }));

    return rows.length > 0 ? rows : fallback;
}

function programCardsFromSetting(value: string | undefined): ProgramCard[] {
    const cards = (value ?? "")
        .split("\n")
        .map(line => {
            const [title, text, href] = line.split("|").map(part => part.trim());
            return title && text
                ? { title, text, href: href || "#" }
                : null;
        })
        .filter((card): card is ProgramCard => Boolean(card));

    return cards.length > 0 ? cards : fallbackProgramCards;
}

export default async function UrgeroTvRadioPage() {
    const settings = await getPublicSiteSettings();
    const streamUrl = settings.radio_stream_url ?? DEFAULT_RADIO_STREAM_URL;
    const channelUrl = settings.youtube_channel_url || settings.social_youtube || DEFAULT_CHANNEL_URL;
    const playlistId = settings.youtube_playlist_id || DEFAULT_PLAYLIST_ID;
    const programCards = programCardsFromSetting(settings.tv_radio_program_cards);

    // Editable hero copy + admin-managed featured videos (fall back to defaults).
    const page = await getPage("urugero-tv-radio");
    const { data: tvVideosData } = await supabase
        .from("videos")
        .select("*")
        .in("section", ["tv-radio", "tv-radio-featured", "tv-radio-latest", "tv-radio-sports", "tv-radio-library"])
        .eq("is_published", true)
        .order("section", { ascending: true })
        .order("sort_order", { ascending: true });
    const tvVideos = (tvVideosData ?? []) as VideoRow[];

    const featured = videosForSection(tvVideos, ["tv-radio-featured", "tv-radio"], fallbackFeaturedVideos, "Urugero TV");
    const latest = videosForSection(tvVideos, ["tv-radio-latest"], fallbackLatestVideos);
    const sports = videosForSection(tvVideos, ["tv-radio-sports"], fallbackSportsVideos);
    const library = videosForSection(tvVideos, ["tv-radio-library"], fallbackLibraryVideos);
    const hero = featured[0] ?? heroVideo;

    const heroEyebrow = page?.subtitle || "URUGERO MEDIA GROUP";
    const heroTitle = page?.title || "Urugero TV & Radio";
    const heroDescription = settings.tv_radio_hero_description
        || "Aho usangirira live radio, ibiganiro bya Urugero TV, amakuru ya Gospel, sport, ubuhamya n'amashusho mashya ava kuri YouTube.";

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={`container ${styles.heroInner}`}>
                    <div className={styles.heroCopy}>
                        <p className={styles.eyebrow}>{heroEyebrow}</p>
                        <h1 className={styles.title}>{heroTitle}</h1>
                        <p className={styles.description}>
                            {heroDescription}
                        </p>
                        <div className={styles.heroActions}>
                            <a href="#featured-videos" className={styles.primaryAction}>Reba videos</a>
                            <a href="#radio-live" className={styles.secondaryAction}>Umva radio</a>
                        </div>
                    </div>
                    <div className={styles.heroPlayer}>
                        <YoutubeEmbed
                            videoId={hero.videoId}
                            title={hero.title}
                            description={hero.description}
                        />
                    </div>
                </div>
            </section>

            <div className={`container ${styles.content}`} id="radio-live">
                <section className={styles.mediaIntro} aria-label="Urugero media programs">
                    <div className={styles.radioStack}>
                        <LiveRadioPlayer
                            streamUrl={streamUrl}
                            stationName={settings.radio_station_name ?? "Urugero Live Radio"}
                        />
                        <RadioComments />
                    </div>
                    <div className={styles.programGrid}>
                        {programCards.map((card) => (
                            <a key={card.title} href={card.href} className={styles.programCard}>
                                <span>{card.title}</span>
                                <p>{card.text}</p>
                            </a>
                        ))}
                    </div>
                </section>

                {page?.content && (
                    <section className={styles.pageContent} aria-label="TV & Radio introduction">
                        <div dangerouslySetInnerHTML={{ __html: page.content }} />
                    </section>
                )}

                <section className={styles.featuredSection} id="featured-videos" aria-labelledby="featured-title">
                    <div className={styles.sectionHeader}>
                        <div>
                            <p className={styles.sectionEyebrow}>URUGERO TV</p>
                            <h2 id="featured-title">Ibiganiro bikunzwe</h2>
                        </div>
                        <a href={channelUrl} target="_blank" rel="noopener noreferrer" className={styles.channelButton}>
                            Reba channel
                        </a>
                    </div>
                    <div className={styles.featuredGrid}>
                        {featured.map((video) => (
                            <article key={video.videoId} className={styles.videoFeature}>
                                <span className={styles.videoCategory}>{video.category}</span>
                                <YoutubeEmbed
                                    videoId={video.videoId}
                                    title={video.title}
                                    description={video.description}
                                />
                            </article>
                        ))}
                    </div>
                </section>

                <section className={styles.videoSection} aria-labelledby="latest-title">
                    <div className={styles.sectionHeader}>
                        <div>
                            <p className={styles.sectionEyebrow}>AMAKURU &amp; IBIGANIRO</p>
                            <h2 id="latest-title">Amashusho mashya</h2>
                        </div>
                    </div>
                    <div className={styles.videoGrid}>
                        {latest.map((video) => (
                            <YoutubeEmbed
                                key={video.videoId}
                                videoId={video.videoId}
                                title={video.title}
                                description={video.description}
                            />
                        ))}
                    </div>
                </section>

                <section className={styles.videoSection} id="sports" aria-labelledby="sports-title">
                    <div className={styles.sectionHeader}>
                        <div>
                            <p className={styles.sectionEyebrow}>SPORT</p>
                            <h2 id="sports-title">Inshundura Sports News</h2>
                        </div>
                    </div>
                    <div className={styles.videoGridThree}>
                        {sports.map((video) => (
                            <YoutubeEmbed
                                key={video.videoId}
                                videoId={video.videoId}
                                title={video.title}
                                description={video.description}
                            />
                        ))}
                    </div>
                </section>

                <section className={styles.moreSection} aria-labelledby="more-title">
                    <div className={styles.sectionHeader}>
                        <div>
                            <p className={styles.sectionEyebrow}>VIDEO LIBRARY</p>
                            <h2 id="more-title">Andi mashusho menshi</h2>
                        </div>
                    </div>
                    <div className={styles.moreGrid}>
                        {library.map((video, index) => (
                            <a
                                key={video.videoId}
                                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.moreCard}
                            >
                                <img
                                    src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
                                    alt={video.title || `Urugero TV video ${index + 1}`}
                                    loading="lazy"
                                />
                                <span>{video.title || video.description || "Reba kuri YouTube"}</span>
                            </a>
                        ))}
                    </div>
                </section>

                <section id="playlist">
                    <YouTubePlaylistEmbed
                        title="Playlist yose ya Urugero TV"
                        playlistId={playlistId}
                        channelUrl={channelUrl}
                    />
                </section>
            </div>
        </div>
    );
}
