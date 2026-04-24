import styles from "./loading.module.css";

export default function Loading() {
    return (
        <div className={styles.wrapper} aria-label="Gutegereza..." role="status">
            <div className={styles.logoMark}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                        d="M4 19.5V4.5C4 3.12 5.12 2 6.5 2h11C18.88 2 20 3.12 20 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-11C5.12 22 4 20.88 4 19.5z"
                        fill="#B80000"
                    />
                    <path
                        d="M8 7h8M8 11h8M8 15h5"
                        stroke="#1F1F1F"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
            <div className={styles.bar}>
                <div className={styles.progress} />
            </div>
            <p className={styles.label}>Gutegereza…</p>
        </div>
    );
}
