"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Ticket, ArrowRight, CalendarBlank } from "@phosphor-icons/react";
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
                <p className={styles.miniSub}>
                    <MapPin size={11} weight="fill" aria-hidden />
                    {subtitle}
                </p>
            </div>
            <ArrowRight size={14} weight="bold" className={styles.miniArrow} aria-hidden />
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
        <motion.article
            className={styles.full}
            whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(13,27,46,0.13)" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
            <div
                className={styles.fullImage}
                style={{ backgroundImage: `url(${image})` }}
            >
                <div className={styles.fullDateBadge}>
                    <CalendarBlank size={12} weight="fill" className={styles.calIcon} aria-hidden />
                    <span className={styles.fullMonth}>{month}</span>
                    <span className={styles.fullDay}>{day}</span>
                </div>
                <span className="tag" style={{ backgroundColor: tagColor, alignSelf: "flex-start" }}>
                    {tag}
                </span>
            </div>
            <div className={styles.fullBody}>
                <div className={styles.fullMeta}>
                    <MapPin size={13} weight="fill" aria-hidden />
                    <span>{venue}</span>
                </div>
                <h2 className={styles.fullTitle}>{title}</h2>
                <p className={styles.fullExcerpt}>{excerpt}</p>
                <div className={styles.fullFooter}>
                    <div className={styles.priceWrap}>
                        <Ticket size={14} weight="fill" className={styles.ticketIcon} aria-hidden />
                        <div>
                            <span className={styles.priceLabel}>Kwinjira</span>
                            <span className={styles.priceValue} style={priceColor ? { color: priceColor } : undefined}>
                                {price}
                            </span>
                        </div>
                    </div>
                    <Link href={href} className={btnClass}>
                        {btnLabel}
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}
