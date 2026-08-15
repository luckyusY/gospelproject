"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import type { AdminAccountSummary, AdminRole } from "@/lib/adminAuth";
import form from "../form.module.css";
import styles from "./users.module.css";

export default function UserManager({ accounts }: { accounts: AdminAccountSummary[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function createUser(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        const target = event.currentTarget;
        const data = new FormData(target);
        const username = String(data.get("username") ?? "").trim().toLowerCase();
        const displayName = String(data.get("displayName") ?? "").trim();
        const password = String(data.get("password") ?? "");
        const role = String(data.get("role") ?? "journalist") as AdminRole;

        const response = await fetch("/api/admin/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, displayName, password, role }),
        });
        const result = await response.json().catch(() => ({})) as { error?: string };
        if (!response.ok) {
            setError(result.error ?? "Could not create the user account.");
            return;
        }

        target.reset();
        setShowPassword(false);
        setSuccess(`${displayName} can now log in at /admin/login using the new username and password.`);
        startTransition(() => router.refresh());
    }

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <div>
                    <h1 className={styles.heading}>User accounts</h1>
                    <p className={styles.intro}>Create login accounts for administrators and journalists.</p>
                </div>
                <a href="/admin" className={form.backBtn}>Back</a>
            </div>

            <section className={styles.createSection} aria-labelledby="create-user-title">
                <div className={styles.sectionHeading}>
                    <UserPlus size={20} aria-hidden />
                    <div>
                        <h2 id="create-user-title">Create account</h2>
                        <p>Journalists can create, edit, and publish only their own stories. Administrators have full dashboard access.</p>
                    </div>
                </div>

                <form onSubmit={createUser} className={styles.form}>
                    <label className={form.label}>
                        Full name
                        <input className={form.input} name="displayName" required minLength={2} maxLength={80} autoComplete="name" placeholder="e.g. Alice Uwimana" />
                    </label>
                    <label className={form.label}>
                        Username
                        <input className={form.input} name="username" required minLength={3} maxLength={40} pattern="[A-Za-z0-9._-]+" autoCapitalize="none" autoComplete="username" placeholder="e.g. alice.uwimana" />
                        <span className={form.hint}>Letters, numbers, dots, dashes, and underscores only.</span>
                    </label>
                    <label className={form.label}>
                        Role
                        <select className={form.select} name="role" defaultValue="journalist">
                            <option value="journalist">Journalist - own stories only</option>
                            <option value="admin">Administrator - full access</option>
                        </select>
                    </label>
                    <label className={form.label}>
                        Temporary password
                        <span className={styles.passwordField}>
                            <input className={form.input} name="password" type={showPassword ? "text" : "password"} required minLength={10} autoComplete="new-password" placeholder="At least 10 characters" />
                            <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide password" : "Show password"}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </span>
                    </label>
                    <button className={styles.createButton} type="submit" disabled={isPending}>
                        <UserPlus size={18} aria-hidden />
                        {isPending ? "Creating..." : "Create account"}
                    </button>
                </form>
                {error && <div className={form.error} role="alert">{error}</div>}
                {success && <div className={styles.success} role="status">{success}</div>}
            </section>

            <section className={styles.accountsSection} aria-labelledby="accounts-title">
                <div className={styles.listHeading}>
                    <h2 id="accounts-title">Existing accounts</h2>
                    <span>{accounts.length}</span>
                </div>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Source</th><th>Status</th></tr></thead>
                        <tbody>
                            {accounts.map((account, index) => (
                                <tr key={account.id ?? `${account.username}-${index}`}>
                                    <td><strong>{account.displayName}</strong></td>
                                    <td><code>{account.username}</code></td>
                                    <td><span className={styles.role}>{account.role}</span></td>
                                    <td>{account.source === "database" ? "Dashboard" : "Environment"}</td>
                                    <td><span className={account.isActive ? styles.active : styles.inactive}>{account.isActive ? "Active" : "Disabled"}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
