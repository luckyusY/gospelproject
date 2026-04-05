import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import type { TestimonyRow } from "@/types/database";
import styles from "../crud.module.css";

export const metadata: Metadata = { title: "Ubuhamya" };

export default async function AdminTestimoniesPage() {
    const result = await supabaseAdmin()
        .from("testimonies")
        .select("*")
        .order("created_at", { ascending: false });
    const testimonies = (result.data ?? []) as TestimonyRow[];

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>Ubuhamya</h1>
                <Link href="/admin/testimonies/new" className={styles.newBtn}>+ Ubuhamya bushya</Link>
            </div>

            <div className={styles.table}>
                <div className={styles.tableHead} style={{ gridTemplateColumns: "1fr auto auto auto auto" }}>
                    <span>Umutwe</span><span>Wanditswe na</span><span>Kiliziya</span>
                    <span>Igenamiterere</span><span>Ibikorwa</span>
                </div>
                {testimonies.map(t => (
                    <div key={t.id} className={styles.tableRow} style={{ gridTemplateColumns: "1fr auto auto auto auto" }}>
                        <span className={styles.rowTitle}>{t.title}</span>
                        <span>{t.person_name}</span>
                        <span>{t.person_church ?? "—"}</span>
                        <span className={t.is_published ? styles.published : styles.draft}>
                            {t.is_published ? "Yashyizwe" : "Draft"}
                        </span>
                        <div className={styles.rowActions}>
                            <Link href={`/admin/testimonies/${t.id}/edit`} className={styles.editBtn}>Hindura</Link>
                            <Link href={`/ubuhamya/${t.slug}`} className={styles.viewBtn} target="_blank">Reba</Link>
                        </div>
                    </div>
                ))}
                {testimonies.length === 0 && <p className={styles.empty}>Nta buhamya bubonetse.</p>}
            </div>
        </div>
    );
}
