/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./AdSlot.module.css";

type AdSlide = {
    imageUrl: string;
    href: string;
    title: string;
};

type Props = {
    imageUrl: string;
    href: string;
    title: string;
    variant?: "banner" | "square";
    slides?: AdSlide[];
};

const EMPTY_SLIDES: AdSlide[] = [];

export default function AdSlot({ imageUrl, href, title, variant = "banner", slides = EMPTY_SLIDES }: Props) {
    const fallbackSlide = useMemo(() => ({ imageUrl, href, title }), [href, imageUrl, title]);
    const adSlides = useMemo(() => {
        const allSlides = [fallbackSlide, ...slides].filter(slide => slide.imageUrl && slide.href);
        return allSlides.length ? allSlides : [fallbackSlide];
    }, [fallbackSlide, slides]);
    const [activeIndex, setActiveIndex] = useState(0);
    const active = adSlides[activeIndex] ?? fallbackSlide;

    useEffect(() => {
        if (adSlides.length < 2) return;

        const timer = window.setInterval(() => {
            setActiveIndex(index => (index + 1) % adSlides.length);
        }, 5200);

        return () => window.clearInterval(timer);
    }, [adSlides.length]);

    return (
        <a
            href={active.href}
            className={`${styles.ad} ${variant === "square" ? styles.square : styles.banner}`}
            aria-label={active.title}
        >
            <span className={styles.label}>Ad</span>
            <img key={active.imageUrl} src={active.imageUrl} alt={active.title} className={styles.image} loading="lazy" />
            {adSlides.length > 1 && (
                <span className={styles.dots} aria-hidden>
                    {adSlides.map((slide, index) => (
                        <span
                            key={`${slide.imageUrl}-${index}`}
                            className={index === activeIndex ? styles.dotActive : styles.dot}
                        />
                    ))}
                </span>
            )}
        </a>
    );
}
