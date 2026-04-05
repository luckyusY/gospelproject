import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Ibitaramo",
    description: "Amakuru y'ibitaramo bya Gikrisitu mu Rwanda.",
    path: "/amakuru/ibitaramo",
});

export default function IbitaramoPage() {
    return (
        <SectionPage
            title="Ibitaramo"
            subtitle="AMAKURU"
            description="Amakuru y'ibitaramo bya Gikrisitu mu Rwanda."
            icon="🎪"
            color="#DC2626"
            breadcrumb={[{ label: "Amakuru", href: "/amakuru" }]}
        />
    );
}
