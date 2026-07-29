"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * SmoothScrollProvider
 * Wraps the app with Lenis smooth scrolling.
 * Place inside RootLayout (client boundary only — server-rendered HTML is untouched).
 */
export default function SmoothScrollProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        // Use the browser's native scrolling on touch devices (phones/tablets).
        // Lenis smooth-scroll feels laggy / hijacked on mobile, especially
        // Android Chrome; native scroll is what users expect there.
        const isTouchDevice = typeof window !== "undefined"
            && (window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0);
        if (isTouchDevice) return;

        const lenis = new Lenis({
            duration:        1.15,
            easing:          (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel:     true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite:        false,
        });

        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
