"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode, ElementType } from "react";
import { fadeUp, fadeDown, fadeLeft, fadeRight, fadeIn, scaleIn } from "@/lib/animations";

type Direction = "up" | "down" | "left" | "right" | "scale" | "none";

const variantMap: Record<Direction, Variants> = {
    up:    fadeUp,
    down:  fadeDown,
    left:  fadeLeft,
    right: fadeRight,
    scale: scaleIn,
    none:  fadeIn,
};

type FadeInProps = {
    children:   ReactNode;
    direction?: Direction;
    delay?:     number;
    duration?:  number;
    className?: string;
    once?:      boolean;
    amount?:    number | "some" | "all";
    /** Render as a different HTML element, default "div" */
    as?:        ElementType;
};

export default function FadeIn({
    children,
    direction = "up",
    delay     = 0,
    duration,
    className,
    once      = true,
    amount    = 0.15,
    as: Tag   = "div",
}: FadeInProps) {
    const base     = variantMap[direction];
    // Merge delay / duration override into the visible variant
    const baseHidden  = base.hidden  ?? {};
    const baseVisible = base.visible ?? {};
    const baseTrans   = (baseVisible as { transition?: object }).transition ?? {};

    const variants: Variants = {
        hidden:  baseHidden,
        visible: {
            ...(baseVisible as object),
            transition: {
                ...baseTrans,
                ...(delay    !== undefined ? { delay }    : {}),
                ...(duration !== undefined ? { duration } : {}),
            },
        },
    };

    const MotionTag = motion(Tag as "div");

    return (
        <MotionTag
            className={className}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount }}
        >
            {children}
        </MotionTag>
    );
}
