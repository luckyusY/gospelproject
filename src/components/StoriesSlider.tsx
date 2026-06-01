"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { ArticleRow } from "@/types/database";
import styles from "./StoriesSlider.module.css";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?q=80&w=1400&auto=format&fit=crop";
const AUTOPLAY_MS = 6000;

type Slide = {
    id: number | string;
    href: string;
    image: string;
    category: string;
    categoryColor: string;
    title: string;
    excerpt: string;
    author: string;
    readTime: string;
};

const FALLBACK_SLIDE: Slide = {
    id: "fallback",
    href: "/amakuru",
    image: FALLBACK_IMG,
    category: "Urugero Media",
    categoryColor: "#B80000",
    title: "Urugero Media Group: Ijwi ry'Imana mu Rwanda no ku Isi Yose",
    excerpt: "Ubuhamya, inyigisho n'imyidagaduro y'Imana binyuze mu Music Academy, Films, Records, Online Radio na Podcast.",
    author: "Urugero Media",
    readTime: "5 min",
};

export default function StoriesSlider({ stories }: { stories: ArticleRow[] }) {
    const slides: Slide[] = stories.length
        ? stories.map(s => ({
            id: s.id,
            href: `/amakuru/${s.slug}`,
            image: s.image_url ?? FALLBACK_IMG,
            category: s.category,
            categoryColor: s.category_color,
            title: s.title,
            excerpt: s.excerpt,
            author: s.author,
            readTime: s.read_time,
        }))
        : [FALLBACK_SLIDE];

    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [paused, setPaused] = useState(false);
    const touchStartX = useRef<number | null>(null);

    const count = slides.length;

    const goTo = useCallback((next: number, dir: number) => {
        setDirection(dir);
        setIndex((next + count) % count);
    }, [count]);

    const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
    const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

    // Autoplay
    useEffect(() => {
        if (paused || count <= 1) return;
        const t = setInterval(() => setIndex(i => (i + 1) % count), AUTOPLAY_MS);
        return () => clearInterval(t);
    }, [paused, count, index]);

    const slide = slides[index] ?? FALLBACK_SLIDE;

    function onTouchStart(e: React.TouchEvent) {
        touchStartX.current = e.touches[0]?.clientX ?? null;
    }
    function onTouchEnd(e: React.TouchEvent) {
        if (touchStartX.current === null) return;
        const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
        const dx = endX - touchStartX.current;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
        touchStartX.current = null;
    }

    return (
        <div
            className={styles.slider}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            aria-roledescription="carousel"
            aria-label="Inkuru Nkuru"
        >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={slide.id}
                    className={styles.slide}
                    custom={direction}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Link href={slide.href} className={styles.slideLink} aria-label={slide.title}>
                        <div
                            className={styles.slideImage}
                            style={{ backgroundImage: `url(${slide.image})` }}
                            role="img"
                            aria-label={slide.title}
                        />
                        <div className={styles.overlay}>
                            <span
                                className={styles.badge}
                                style={{ backgroundColor: slide.categoryColor }}
                            >
                                {slide.category}
                            </span>
                            <h2 className={styles.title}>{slide.title}</h2>
                            <p className={styles.excerpt}>{slide.excerpt}</p>
                            <div className={styles.meta}>
                                <span>Na {slide.author}</span>
                                <span aria-hidden>•</span>
                                <span>{slide.readTime}</span>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </AnimatePresence>

            {count > 1 && (
                <>
                    <button
                        type="button"
                        className={`${styles.arrow} ${styles.arrowLeft}`}
                        onClick={prev}
                        aria-label="Inkuru ibanza"
                    >
                        <CaretLeft size={20} weight="bold" />
                    </button>
                    <button
                        type="button"
                        className={`${styles.arrow} ${styles.arrowRight}`}
                        onClick={next}
                        aria-label="Inkuru ikurikira"
                    >
                        <CaretRight size={20} weight="bold" />
                    </button>

                    <div className={styles.dots} role="tablist" aria-label="Hitamo inkuru">
                        {slides.map((s, i) => (
                            <button
                                key={s.id}
                                type="button"
                                className={i === index ? styles.dotActive : styles.dot}
                                onClick={() => goTo(i, i > index ? 1 : -1)}
                                aria-label={`Inkuru ${i + 1}`}
                                aria-selected={i === index}
                                role="tab"
                            />
                        ))}
                    </div>

                    <div className={styles.counter}>
                        {index + 1} / {count}
                    </div>
                </>
            )}
        </div>
    );
}
