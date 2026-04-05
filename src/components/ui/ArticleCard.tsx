import Link from "next/link";
import styles from "./ArticleCard.module.css";

export type ArticleCardProps = {
    href?:          string;
    category:       string;
    categoryColor:  string;
    title:          string;
    excerpt:        string;
    image:          string;
    author:         string;
    readTime:       string;
    featured?:      boolean;
};

export default function ArticleCard({
    href = "#",
    category,
    categoryColor,
    title,
    excerpt,
    image,
    author,
    readTime,
    featured = false,
}: ArticleCardProps) {
    return (
        <Link
            href={href}
            className={`${styles.card} ${featured ? styles.featured : ""}`}
            aria-label={`${category}: ${title}`}
        >
            <div
                className={styles.image}
                role="img"
                aria-label={title}
                style={{ backgroundImage: `url(${image})` }}
            />
            <div className={styles.body}>
                <span
                    className={styles.tag}
                    style={{ backgroundColor: categoryColor }}
                >
                    {category}
                </span>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.excerpt}>{excerpt}</p>
                <div className={styles.meta}>
                    <span>{author}</span>
                    <span>{readTime}</span>
                </div>
            </div>
        </Link>
    );
}
