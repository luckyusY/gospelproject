import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import type { PageRow } from "@/types/database";
import styles from "../crud.module.css";
import DeleteRowButton from "../_components/DeleteRowButton";

export const metadata: Metadata = { title: "Pages" };

function publicHref(page: PageRow) {
    return page.nav_group === "media-group"
        ? `/urugero-media-group/${page.slug}`
        : `/${page.slug}`;
}

export default async function AdminPagesPage() {
    const result = await supabaseAdmin()
        .from("pages")
        .select("*")
        .order("nav_group", { ascending: true })
        .order("sort_order", { ascending: true });
    const pages = (result.data ?? []) as PageRow[];

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <h1 className={styles.heading}>Pages</h1>
                <Link href="/admin/pages/new" className={styles.newBtn}>+ New page</Link>
            </div>

            <div className={styles.table}>
                <div className={styles.tableHead} style={{ gridTemplateColumns: "1fr auto auto auto" }}>
                    <span>Title</span><span>Type</span><span>Status</span><span>Actions</span>
                </div>
                {pages.map(page => (
                    <div key={page.id} className={styles.tableRow} style={{ gridTemplateColumns: "1fr auto auto auto" }}>
                        <div>
                            <span className={styles.rowTitle}>{page.icon ? `${page.icon} ` : ""}{page.title}</span>
                            <div className={styles.catSlug}>{publicHref(page)}</div>
                        </div>
                        <span className={styles.catChip}>{page.nav_group === "media-group" ? "Media Group" : "Standalone"}</span>
                        <span className={page.is_published ? styles.published : styles.draft}>
                            {page.is_published ? "Published" : "Draft"}
                        </span>
                        <div className={styles.rowActions}>
                            <Link href={`/admin/pages/${page.id}/edit`} className={styles.editBtn}>Edit</Link>
                            <Link href={publicHref(page)} className={styles.viewBtn} target="_blank">View</Link>
                            <DeleteRowButton endpoint={`/api/admin/pages/${page.id}`} label={page.title} />
                        </div>
                    </div>
                ))}
                {pages.length === 0 && (
                    <p className={styles.empty}>
                        No pages yet. Run <code>supabase/content_driven.sql</code>, or create one with “+ New page”.
                    </p>
                )}
            </div>

            <p className={styles.catHint}>
                <strong>Standalone</strong> pages (e.g. Abo Turibo, Ibigwi) use their own URL like <code>/abo-turibo</code>.
                <strong> Media Group</strong> pages appear under <code>/urugero-media-group/&lt;slug&gt;</code>.
            </p>
        </div>
    );
}
