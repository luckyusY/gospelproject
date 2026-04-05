"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Pagination.module.css";

export type PaginationProps = {
    currentPage:  number;
    totalPages:   number;
    onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    // Build page numbers with ellipsis
    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3)           pages.push("…");
        const start = Math.max(2, currentPage - 1);
        const end   = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push("…");
        pages.push(totalPages);
    }

    return (
        <nav className={styles.nav} aria-label="Pagination">
            <button
                className={`${styles.btn} ${styles.arrowBtn}`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Paji ibanjirije"
            >
                <ChevronLeft size={16} aria-hidden /> Ibanjirije
            </button>

            {pages.map((p, i) =>
                p === "…" ? (
                    <span key={`e-${i}`} className={styles.ellipsis} aria-hidden>…</span>
                ) : (
                    <button
                        key={p}
                        className={`${styles.btn} ${p === currentPage ? styles.active : ""}`}
                        onClick={() => onPageChange(p as number)}
                        aria-label={`Paji ${p}`}
                        aria-current={p === currentPage ? "page" : undefined}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                className={`${styles.btn} ${styles.arrowBtn}`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Paji ikurikira"
            >
                Ikurikira <ChevronRight size={16} aria-hidden />
            </button>
        </nav>
    );
}
