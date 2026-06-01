import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import type { CategoryRow } from "@/types/database";
import CategoryManager from "./_components/CategoryManager";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
    const { data } = await supabaseAdmin()
        .from("categories")
        .select("*")
        .order("id");
    const categories = (data ?? []) as CategoryRow[];

    return <CategoryManager categories={categories} />;
}
