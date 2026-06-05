"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
    interface Window {
        twttr?: {
            widgets?: {
                load: (element?: HTMLElement) => void;
            };
        };
    }
}

export default function TwitterEmbeds() {
    const pathname = usePathname();

    useEffect(() => {
        window.twttr?.widgets?.load();
    }, [pathname]);

    return (
        <Script
            src="https://platform.twitter.com/widgets.js"
            strategy="afterInteractive"
            onLoad={() => window.twttr?.widgets?.load()}
        />
    );
}
