import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import type { EventRow } from "@/types/database";
import styles from "../crud.module.css";

export const metadata: Metadata = { title: "Ibikorwa" };

export default async function AdminEventsPage() {
    const result = await supabaseAdmin()
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });
    const events = (result.data ?? []) as EventRow[];

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>Ibikorwa</h1>
                <Link href="/admin/events/new" className={styles.newBtn}>+ Igikorwa gishya</Link>
            </div>

            <div className={styles.table}>
                <div className={styles.tableHead} style={{ gridTemplateColumns: "1fr auto auto auto auto" }}>
                    <span>Umutwe</span><span>Itariki</span><span>Ahantu</span>
                    <span>Igenamiterere</span><span>Ibikorwa</span>
                </div>
                {events.map(ev => (
                    <div key={ev.id} className={styles.tableRow} style={{ gridTemplateColumns: "1fr auto auto auto auto" }}>
                        <span className={styles.rowTitle}>{ev.title}</span>
                        <span>{new Date(ev.event_date).toLocaleDateString("rw-RW")}</span>
                        <span>{ev.location}</span>
                        <span className={ev.is_published ? styles.published : styles.draft}>
                            {ev.is_published ? "Yashyizwe" : "Draft"}
                        </span>
                        <div className={styles.rowActions}>
                            <Link href={`/admin/events/${ev.id}/edit`} className={styles.editBtn}>Hindura</Link>
                            <Link href={`/events/${ev.slug}`} className={styles.viewBtn} target="_blank">Reba</Link>
                        </div>
                    </div>
                ))}
                {events.length === 0 && <p className={styles.empty}>Nta bikorwa bibonetse.</p>}
            </div>
        </div>
    );
}
