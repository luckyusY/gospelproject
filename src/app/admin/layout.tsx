import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/adminAuth";
import styles from "./admin.module.css";
import AdminNav from "./_components/AdminNav";

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
            <AdminNav username={admin.username} />

            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
