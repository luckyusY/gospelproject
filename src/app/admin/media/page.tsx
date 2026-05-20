import type { Metadata } from "next";
import styles from "../dashboard.module.css";
import RadioTrackManager from "./RadioTrackManager";

export const metadata: Metadata = { title: "Media" };

export default function AdminMediaPage() {
    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Media</h1>
            <p style={{ color: "var(--text-muted)" }}>
                Shyiraho amafoto n&apos;indirimbo zikoreshwa ku rubuga.
            </p>
            <div style={{ marginTop: "1.5rem" }}>
                <RadioTrackManager />
            </div>
        </div>
    );
}
