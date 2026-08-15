import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin, isFullAdmin, listAdminAccounts } from "@/lib/adminAuth";
import UserManager from "./UserManager";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage() {
    const currentAdmin = await getCurrentAdmin();
    if (!isFullAdmin(currentAdmin)) redirect("/admin/articles");

    const accounts = await listAdminAccounts();
    return <UserManager accounts={accounts} />;
}
