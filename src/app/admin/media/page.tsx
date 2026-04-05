import type { Metadata } from "next";
import styles from "../dashboard.module.css";

export const metadata: Metadata = { title: "Amafoto" };

export default function AdminMediaPage() {
    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Amafoto</h1>
            <p style={{ color: "var(--text-muted)" }}>
                Shyiraho URL y&apos;ifoto mu nyandiko. Supabase Storage izafungurwa vuba.
            </p>
        </div>
    );
}
