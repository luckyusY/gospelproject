"use client";

import { useEffect } from "react";

/**
 * Google Website Translate widget. Drops a language picker into the navbar so
 * readers can translate the (Kinyarwanda) site into English, French, etc.
 * The default Google top banner is hidden via globals.css.
 */
type TranslateElementCtor = new (
    options: { pageLanguage: string; includedLanguages?: string; autoDisplay?: boolean },
    elementId: string,
) => unknown;

declare global {
    interface Window {
        googleTranslateElementInit?: () => void;
        google?: { translate?: { TranslateElement?: TranslateElementCtor } };
    }
}

const SCRIPT_ID = "google-translate-script";

export default function GoogleTranslate() {
    useEffect(() => {
        window.googleTranslateElementInit = () => {
            const ctor = window.google?.translate?.TranslateElement;
            if (!ctor) return;
            new ctor(
                {
                    pageLanguage: "rw",
                    includedLanguages: "en,fr,rw,sw",
                    autoDisplay: false,
                },
                "google_translate_element",
            );
        };

        if (!document.getElementById(SCRIPT_ID)) {
            const script = document.createElement("script");
            script.id = SCRIPT_ID;
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            document.body.appendChild(script);
        } else if (window.google?.translate?.TranslateElement) {
            // Script already loaded (client-side nav) — re-init into the element.
            window.googleTranslateElementInit();
        }
    }, []);

    return <div id="google_translate_element" aria-label="Hindura ururimi" />;
}
