import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { supabase } from "@/lib/supabase";
import SectionPage from "@/components/SectionPage";
import type { CategoryRow } from "@/types/database";

export const metadata: Metadata = buildMeta({
    title: "Inyigisho",
    description: "Inyigisho z'Imana ku bihuye n'umuryango, abana, urubyiruko, abagabo n'abagore.",
    path: "/inyigisho",
});

export const revalidate = 60;

export default async function InyigishoPage() {
    const { data } = await supabase
        .from("categories")
        .select("slug, name, description, icon, nav_group, sort_order, show_in_nav")
        .eq("nav_group", "inyigisho")
        .order("sort_order", { ascending: true });

    const categories = ((data ?? []) as Pick<CategoryRow, "slug" | "name" | "description" | "icon" | "show_in_nav">[])
        .filter(c => c.show_in_nav !== false);

    const subSections = [
        ...categories.map(c => ({
            label: c.icon ? `${c.icon} ${c.name}` : c.name,
            href:  `/inyigisho/${c.slug}`,
            desc:  c.description ?? undefined,
        })),
        { label: "📖 Bible Quiz", href: "/inyigisho/bible-quiz", desc: "Ibibazo bya Bibiliya" },
    ];

    return (
        <SectionPage
            title="Inyigisho"
            subtitle="URUGERO MEDIA — INYIGISHO"
            description="Inyigisho z'Imana ku bihuye n'umuryango, abana, urubyiruko, abagabo, abagore n'ubuzima bw'umwuka."
            icon="📚"
            color="#B80000"
            heroImage="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1400&auto=format&fit=crop"
            subSections={subSections}
        />
    );
}
