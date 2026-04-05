import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Urubyiruko",
    description: "Inyigisho z'Imana zigenewe urubyiruko mu bihe bya none.",
    path: "/inyigisho/urubyiruko",
});

export default function UrubyirukoPage() {
    return (
        <SectionPage
            title="Urubyiruko"
            subtitle="INYIGISHO"
            description="Inyigisho z'Imana zigenewe urubyiruko mu bihe bya none."
            icon="🌱"
            color="#1E40AF"
            breadcrumb={[{ label: "Inyigisho", href: "/inyigisho" }]}
        />
    );
}
