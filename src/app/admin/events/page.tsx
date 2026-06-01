import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import type { EventRow } from "@/types/database";
import styles from "../crud.module.css";

export const metadata: Metadata = { title: "Events" };

export default async function AdminEventsPage() {
    const result = await supabaseAdmin()
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });
    const events = (result.data ?? []) as EventRow[];

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>Events</h1>
                <Link href="/admin/events/new" className={styles.newBtn}>+ New event</Link>
            </div>

            <div className={styles.table}>
                <div className={styles.tableHead} style={{ gridTemplateColumns: "1fr auto auto auto auto" }}>
                    <span>Title</span><span>Date</span><span>Location</span>
                    <span>Status</span><span>Actions</span>
                </div>
                {events.map(ev => (
                    <div key={ev.id} className={styles.tableRow} style={{ gridTemplateColumns: "1fr auto auto auto auto" }}>
                        <span className={styles.rowTitle}>{ev.title}</span>
                        <span>{new Date(ev.event_date).toLocaleDateString("en-GB")}</span>
                        <span>{ev.location}</span>
                        <span className={ev.is_published ? styles.published : styles.draft}>
                            {ev.is_published ? "Published" : "Draft"}
                        </span>
                        <div className={styles.rowActions}>
                            <Link href={`/admin/events/${ev.id}/edit`} className={styles.editBtn}>Edit</Link>
                            <Link href={`/events/${ev.slug}`} className={styles.viewBtn} target="_blank">View</Link>
                        </div>
                    </div>
                ))}
                {events.length === 0 && <p className={styles.empty}>No events yet.</p>}
            </div>
        </div>
    );
}
