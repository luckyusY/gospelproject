import styles from "./QuoteBlock.module.css";

export type QuoteBlockProps = {
    badge?:        string;
    quote:         string;
    reference:     string;
    shareLabel?:   string;
    readLabel?:    string;
    onShare?:      () => void;
    onReadChapter?: () => void;
};

export default function QuoteBlock({
    badge       = "IJAMBO RY'UMUNSI",
    quote,
    reference,
    shareLabel  = "Sangira Ijambo",
    readLabel   = "Soma Igice",
    onShare,
    onReadChapter,
}: QuoteBlockProps) {
    return (
        <section className={styles.section} aria-label={badge}>
            <div className={styles.bg} aria-hidden>&ldquo;</div>
            <div className={styles.inner}>
                <span className={styles.badge}>{badge}</span>
                <blockquote className={styles.quote}>
                    {quote}
                </blockquote>
                <cite className={styles.reference}>{reference}</cite>
                <div className={styles.actions}>
                    <button className={styles.btnOutline} onClick={onShare}>
                        {shareLabel}
                    </button>
                    <button className={styles.btnSolid} onClick={onReadChapter}>
                        {readLabel}
                    </button>
                </div>
            </div>
        </section>
    );
}
