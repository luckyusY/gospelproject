import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Amatorero",
    description: "Amakuru y'amatorero n'ibikorwa by'itorero mu Rwanda.",
    path: "/amakuru/amatorero",
});

export default function AmatoreroPage() {
    return (
        <SectionPage
            title="Amatorero"
            subtitle="AMAKURU"
            description="Amakuru y'amatorero n'ibikorwa by'itorero mu Rwanda."
            icon="⛪"
            color="#DC2626"
            breadcrumb={[{ label: "Amakuru", href: "/amakuru" }]}
        />
    );
}
