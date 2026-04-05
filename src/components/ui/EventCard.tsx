import Link from "next/link";
import { MapPin } from "lucide-react";
import styles from "./EventCard.module.css";

// ── Mini variant (sidebar list item) ─────────────────────
export type EventMiniProps = {
    month:    string;
    day:      string;
    title:    string;
    subtitle: string;
    href?:    string;
};

export function EventMini({ month, day, title, subtitle, href = "#" }: EventMiniProps) {
    return (
        <Link href={href} className={styles.mini}>
            <div className={styles.dateBadge} aria-label={`${month} ${day}`}>
                <span className={styles.month}>{month}</span>
                <span className={styles.day}>{day}</span>
            </div>
            <div className={styles.info}>
                <h4 className={styles.miniTitle}>{title}</h4>
                <p className={styles.miniSub}>{subtitle}</p>
            </div>
        </Link>
    );
}

// ── Full card variant (events grid) ──────────────────────
export type EventCardProps = {
    image:       string;
    month:       string;
    day:         string;
    tag:         string;
    tagColor:    string;
    venue:       string;
    title:       string;
    excerpt:     string;
    price:       string;
    priceColor?: string;
    btnLabel:    string;
    btnClass?:   string;
    href?:       string;
};

export default function EventCard({
    image,
    month,
    day,
    tag,
    tagColor,
    venue,
    title,
    excerpt,
    price,
    priceColor,
    btnLabel,
    btnClass = "btn btn-accent",
    href = "#",
}: EventCardProps) {
    return (
        <article className={styles.full}>
            <div
                className={styles.fullImage}
                style={{ backgroundImage: `url(${image})` }}
            >
                <div className={styles.fullDateBadge}>
                    <span className={styles.fullMonth}>{month}</span>
                    <span className={styles.fullDay}>{day}</span>
                </div>
                <span className="tag" style={{ backgroundColor: tagColor, alignSelf: "flex-start" }}>
                    {tag}
                </span>
            </div>
            <div className={styles.fullBody}>
                <div className={styles.fullMeta}>
                    <MapPin size={13} aria-hidden />
                    <span>{venue}</span>
                </div>
                <h2 className={styles.fullTitle}>{title}</h2>
                <p className={styles.fullExcerpt}>{excerpt}</p>
                <div className={styles.fullFooter}>
                    <div>
                        <span className={styles.priceLabel}>Kwinjira</span>
                        <span className={styles.priceValue} style={priceColor ? { color: priceColor } : undefined}>
                            {price}
                        </span>
                    </div>
                    <Link href={href} className={btnClass}>
                        {btnLabel}
                    </Link>
                </div>
            </div>
        </article>
    );
}
