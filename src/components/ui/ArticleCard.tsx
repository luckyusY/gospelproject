"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, UserCircle, ArrowRight } from "@phosphor-icons/react";
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
        <motion.div
            whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(31,31,31,0.14)" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ borderRadius: "var(--r-lg)" }}
        >
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
                        <span className={styles.metaItem}>
                            <UserCircle size={13} weight="fill" aria-hidden />
                            {author}
                        </span>
                        <span className={styles.metaItem}>
                            <Clock size={13} weight="regular" aria-hidden />
                            {readTime}
                        </span>
                    </div>
                    <span className={styles.readMore} aria-hidden>
                        Soma byinshi <ArrowRight size={12} weight="bold" />
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}
