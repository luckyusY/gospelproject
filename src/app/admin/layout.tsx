import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import styles from "./admin.module.css";

export const metadata: Metadata = {
    title: { template: "%s — Admin | Urugero Media", default: "Admin | Urugero Media" },
    robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const auth = cookieStore.get("admin_auth");

    // Allow access to /admin/login without auth
    // (Next.js will render children; the login page itself doesn't need redirect)
    const isAuthenticated = auth?.value === "1";

    // We can't easily get the current pathname in a layout without a client component,
    // so we check cookies and let the login page handle the redirect logic.
    if (!isAuthenticated) {
        redirect("/admin/login");
    }

    return (
        <div className={styles.shell}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarLogo}>
                    <span className={styles.logoIcon}>✝</span>
                    <div>
                        <p className={styles.logoName}>Urugero Media</p>
                        <p className={styles.logoRole}>Admin Panel</p>
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
