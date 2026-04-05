import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import styles from "./login.module.css";

export const metadata: Metadata = {
    title: "Injira — Admin | Urugero Media",
    robots: { index: false, follow: false },
};

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const cookieStore = await cookies();
    if (cookieStore.get("admin_auth")?.value === "1") {
        redirect("/admin");
    }

    const { error } = await searchParams;

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.logo}>
                    <span className={styles.cross}>✝</span>
                    <h1 className={styles.title}>Urugero Media</h1>
                    <p className={styles.subtitle}>Admin Panel — Injira</p>
                </div>

                {error && (
                    <div className={styles.error} role="alert">
                        Ijambo banga ntiryo. Gerageza nanone.
                    </div>
                )}

                <form action="/api/admin/login" method="POST" className={styles.form}>
                    <label className={styles.label} htmlFor="password">
                        Ijambo banga
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className={styles.input}
                        placeholder="••••••••"
                        required
                        autoFocus
                    />
                    <button type="submit" className={styles.btn}>
                        Injira
                    </button>
                </form>
            </div>
        </div>
    );
}
