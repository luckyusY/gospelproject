import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import type { TestimonyRow } from "@/types/database";
import styles from "../crud.module.css";
import DeleteRowButton from "../_components/DeleteRowButton";

export const metadata: Metadata = { title: "Testimonies" };

export default async function AdminTestimoniesPage() {
    const result = await supabaseAdmin()
        .from("testimonies")
        .select("*")
        .order("created_at", { ascending: false });
    const testimonies = (result.data ?? []) as TestimonyRow[];

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>Testimonies</h1>
                <Link href="/admin/testimonies/new" className={styles.newBtn}>+ New testimony</Link>
            </div>

            <div className={styles.table}>
                <div className={styles.tableHead} style={{ gridTemplateColumns: "1fr auto auto auto auto" }}>
                    <span>Title</span><span>Person</span><span>Church</span>
                    <span>Status</span><span>Actions</span>
                </div>
                {testimonies.map(t => (
                    <div key={t.id} className={styles.tableRow} style={{ gridTemplateColumns: "1fr auto auto auto auto" }}>
                        <span className={styles.rowTitle}>{t.title}</span>
                        <span>{t.person_name}</span>
                        <span>{t.person_church ?? "—"}</span>
                        <span className={t.is_published ? styles.published : styles.draft}>
                            {t.is_published ? "Published" : "Draft"}
                        </span>
                        <div className={styles.rowActions}>
                            <Link href={`/admin/testimonies/${t.id}/edit`} className={styles.editBtn}>Edit</Link>
                            <Link href={`/ubuhamya/${t.slug}`} className={styles.viewBtn} target="_blank">View</Link>
                            <DeleteRowButton endpoint={`/api/admin/testimonies/${t.id}`} label={t.title} />
                        </div>
                    </div>
                ))}
                {testimonies.length === 0 && <p className={styles.empty}>No testimonies yet.</p>}
            </div>
        </div>
    );
}
