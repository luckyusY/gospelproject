"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import styles from "./ThemeToggle.module.css";

type Theme = "dark" | "light";

function getPreferredTheme(): Theme {
    if (typeof window === "undefined") return "light";

    const stored = window.localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribeToThemeChanges(onStoreChange: () => void) {
    if (typeof window === "undefined") return () => {};

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const notify = () => onStoreChange();

    window.addEventListener("storage", notify);
    window.addEventListener("themechange", notify);
    media.addEventListener("change", notify);

    return () => {
        window.removeEventListener("storage", notify);
        window.removeEventListener("themechange", notify);
        media.removeEventListener("change", notify);
    };
}

export default function ThemeToggle() {
    const theme = useSyncExternalStore(subscribeToThemeChanges, getPreferredTheme, () => "light");
    const dark = theme === "dark";

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    function toggle() {
        const value = dark ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", value);
        localStorage.setItem("theme", value);
        window.dispatchEvent(new Event("themechange"));
    }

    return (
        <button
            className={styles.toggle}
            onClick={toggle}
            aria-label={dark ? "Hindura ku muco" : "Hindura mu gicucu"}
            title={dark ? "Hindura ku muco" : "Hindura mu gicucu"}
        >
            {dark ? <Sun size={17} aria-hidden /> : <Moon size={17} aria-hidden />}
        </button>
    );
}
