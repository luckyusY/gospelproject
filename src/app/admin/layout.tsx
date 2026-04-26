import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/adminAuth";
import styles from "./admin.module.css";

export const metadata: Metadata = {
    title: { template: "%s — Admin | Urugero Media", default: "Admin | Urugero Media" },
    robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const admin = await getCurrentAdmin();

    if (!admin) {
        redirect("/admin/login");
    }

    return (
        <div className={styles.shell}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarLogo}>
                    <span className={styles.logoIcon}>✝</span>
                    <div>
                        <p className={styles.logoName}>Urugero Media</p>
                        <p className={styles.logoRole}>Admin: {admin.username}</p>
                    </div>
                </div>

                <nav className={styles.sideNav}>
                    <a href="/admin"           className={styles.navLink}>📊 Dashboard</a>
                    <a href="/admin/articles"  className={styles.navLink}>📰 Inyandiko</a>
                    <a href="/admin/events"    className={styles.navLink}>📅 Ibikorwa</a>
                    <a href="/admin/testimonies" className={styles.navLink}>🙌 Ubuhamya</a>
                    <a href="/admin/media"     className={styles.navLink}>🖼️ Amafoto</a>
                </nav>

                <div className={styles.sidebarFooter}>
                    <a href="/" className={styles.viewSiteLink} target="_blank" rel="noopener noreferrer">
                        ↗ Reba Urubuga
                    </a>
                    <form action="/api/admin/logout" method="POST">
                        <button type="submit" className={styles.logoutBtn}>Sohoka</button>
                    </form>
                </div>
            </aside>

            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
