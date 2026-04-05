import { PlayCircle } from "lucide-react";
import styles from "./VideoCard.module.css";

export type VideoCardProps = {
    image:       string;
    title:       string;
    description: string;
    hasPlay?:    boolean;
    duration?:   string;
    href?:       string;
    onClick?:    () => void;
};

export default function VideoCard({
    image,
    title,
    description,
    hasPlay = true,
    duration,
    onClick,
}: VideoCardProps) {
    return (
        <div className={styles.card} onClick={onClick} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}>
            <div
                className={styles.thumb}
                style={{ backgroundImage: `url(${image})` }}
                aria-label={title}
            >
                <div className={styles.overlay} aria-hidden />
                {hasPlay && (
                    <button
                        className={styles.playBtn}
                        aria-label={`Tangira video: ${title}`}
                        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
                    >
                        <PlayCircle size={44} fill="white" stroke="#0D1B2E" aria-hidden />
                    </button>
                )}
                {duration && (
                    <span className={styles.durationBadge} aria-label={`Igihe: ${duration}`}>
                        {duration}
                    </span>
                )}
            </div>
            <div className={styles.body}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.desc}>{description}</p>
            </div>
        </div>
    );
}
