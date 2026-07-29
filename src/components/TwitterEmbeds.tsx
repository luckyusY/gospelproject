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
        instgrm?: {
            Embeds?: {
                process: () => void;
            };
        };
        FB?: {
            XFBML?: {
                parse: () => void;
            };
        };
    }
}

export default function TwitterEmbeds() {
    const pathname = usePathname();

    function loadEmbeds() {
        window.twttr?.widgets?.load();
        window.instgrm?.Embeds?.process();
        window.FB?.XFBML?.parse();
    }

    useEffect(() => {
        loadEmbeds();
    }, [pathname]);

    return (
        <>
            <div id="fb-root" />
            <Script
                src="https://platform.twitter.com/widgets.js"
                strategy="afterInteractive"
                onLoad={loadEmbeds}
            />
            <Script
                src="https://www.instagram.com/embed.js"
                strategy="afterInteractive"
                onLoad={loadEmbeds}
            />
            <Script
                src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v20.0"
                strategy="afterInteractive"
                onLoad={loadEmbeds}
            />
        </>
    );
}
