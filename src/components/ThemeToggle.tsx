"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const isDark = stored ? stored === "dark" : prefersDark;
        setDark(isDark);
        document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    }, []);

    function toggle() {
        const next = !dark;
        setDark(next);
        const value = next ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", value);
        localStorage.setItem("theme", value);
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
