/* eslint-disable @next/next/no-img-element */
import styles from "./AdSlot.module.css";

type Props = {
    imageUrl: string;
    href: string;
    title: string;
    variant?: "banner" | "square";
};

export default function AdSlot({ imageUrl, href, title, variant = "banner" }: Props) {
    return (
        <a
            href={href}
            className={`${styles.ad} ${variant === "square" ? styles.square : styles.banner}`}
            aria-label={title}
        >
            <span className={styles.label}>Ad</span>
            <img src={imageUrl} alt={title} className={styles.image} loading="lazy" />
        </a>
    );
}
