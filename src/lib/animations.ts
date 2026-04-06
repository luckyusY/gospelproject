/**
 * Reusable Framer Motion animation variants for Urugero Media
 */
import type { Variants } from "framer-motion";

// ── Fade + slide variants ────────────────────────────────
export const fadeUp: Variants = {
    hidden:  { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0,  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeDown: Variants = {
    hidden:  { opacity: 0, y: -24 },
    visible: { opacity: 1, y: 0,  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeLeft: Variants = {
    hidden:  { opacity: 0, x: -36 },
    visible: { opacity: 1, x: 0,  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeRight: Variants = {
    hidden:  { opacity: 0, x: 36 },
    visible: { opacity: 1, x: 0,  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeIn: Variants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

// ── Scale in ────────────────────────────────────────────
export const scaleIn: Variants = {
    hidden:  { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1,    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// ── Stagger container ───────────────────────────────────
export const staggerContainer: Variants = {
    hidden:  {},
    visible: {
        transition: {
            staggerChildren:  0.1,
            delayChildren:    0.05,
        },
    },
};

export const staggerContainerFast: Variants = {
    hidden:  {},
    visible: {
        transition: {
            staggerChildren: 0.07,
            delayChildren:   0.02,
        },
    },
};

// ── Slide in from bottom with spring ────────────────────
export const springUp: Variants = {
    hidden:  { opacity: 0, y: 48 },
    visible: {
        opacity: 1, y: 0,
        transition: {
            type:      "spring",
            stiffness: 90,
            damping:   20,
            mass:      0.8,
        },
    },
};

// ── Hero title (word by word feel) ──────────────────────
export const heroTitle: Variants = {
    hidden:  { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
        opacity: 1, y: 0, filter: "blur(0px)",
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
};

// ── Horizontal divider line draw ────────────────────────
export const drawLine: Variants = {
    hidden:  { scaleX: 0, originX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 } },
};
