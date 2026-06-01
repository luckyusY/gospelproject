"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "../crud.module.css";

type Props = {
    endpoint: string;   // DELETE endpoint, e.g. /api/admin/events/12
    label: string;      // item title, shown in the confirm dialog
};

export default function DeleteRowButton({ endpoint, label }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [busy, setBusy] = useState(false);

    async function handleDelete() {
        if (!confirm(`Delete "${label}"? This cannot be undone.`)) return;
        setBusy(true);
        const res = await fetch(endpoint, { method: "DELETE" });
        setBusy(false);
        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            alert((json as { error?: string }).error ?? "Delete failed.");
            return;
        }
        startTransition(() => router.refresh());
    }

    return (
        <button
            type="button"
            className={styles.deleteRowBtn}
            onClick={handleDelete}
            disabled={busy || isPending}
        >
            Delete
        </button>
    );
}
