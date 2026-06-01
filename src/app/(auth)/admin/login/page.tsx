import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/adminAuth";
import styles from "./login.module.css";

export const metadata: Metadata = {
    title: "Sign in - Admin | Urugero Media",
    robots: { index: false, follow: false },
};

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    if (await getCurrentAdmin()) {
        redirect("/admin");
    }

    const { error } = await searchParams;

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.logo}>
                    <span className={styles.cross}>+</span>
                    <h1 className={styles.title}>Urugero Media</h1>
                    <p className={styles.subtitle}>Admin Panel - Sign in</p>
                </div>

                {error && (
                    <div className={styles.error} role="alert">
                        Incorrect username or password.
                    </div>
                )}

                <form action="/api/admin/login" method="POST" className={styles.form}>
                    <label className={styles.label} htmlFor="username">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        className={styles.input}
                        placeholder="admin"
                        autoComplete="username"
                        defaultValue="admin"
                        required
                        autoFocus
                    />

                    <label className={styles.label} htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className={styles.input}
                        placeholder="Password"
                        autoComplete="current-password"
                        required
                    />
                    <button type="submit" className={styles.btn}>
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
}
