import styles from "./YouTubePlaylistEmbed.module.css";

type Props = {
    playlistId: string;
    title: string;
    channelUrl: string;
};

export default function YouTubePlaylistEmbed({ playlistId, title, channelUrl }: Props) {
    return (
        <section className={styles.wrap} aria-labelledby="youtube-playlist-title">
            <div className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>URUGERO TV</p>
                    <h2 id="youtube-playlist-title" className={styles.title}>{title}</h2>
                </div>
                <a href={channelUrl} target="_blank" rel="noopener noreferrer" className={styles.channelLink}>
                    Reba channel
                </a>
            </div>
            <div className={styles.frameBox}>
                <iframe
                    src={`https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    className={styles.iframe}
                />
            </div>
        </section>
    );
}
