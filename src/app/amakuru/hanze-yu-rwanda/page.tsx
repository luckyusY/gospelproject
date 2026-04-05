import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Hanze y'u Rwanda",
    description: "Amakuru y'Ubukristu avuye mu bihugu byo hanze y'u Rwanda.",
    path: "/amakuru/hanze-yu-rwanda",
});

export default function HanzeYuRwandaPage() {
    return (
        <SectionPage
            title="Hanze y'u Rwanda"
            subtitle="AMAKURU"
            description="Amakuru y'Ubukristu avuye mu bihugu byo hanze y'u Rwanda."
            icon="🌍"
            color="#DC2626"
            breadcrumb={[{ label: "Amakuru", href: "/amakuru" }]}
        />
    );
}
