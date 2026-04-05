import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Abanyempano",
    description: "Amakuru y'abanyempano b'Imana n'ibyo bakora.",
    path: "/amakuru/abanyempano",
});

export default function AbanyempanoPage() {
    return (
        <SectionPage
            title="Abanyempano"
            subtitle="AMAKURU"
            description="Amakuru y'abanyempano b'Imana n'ibyo bakora."
            icon="🙌"
            color="#DC2626"
            breadcrumb={[{ label: "Amakuru", href: "/amakuru" }]}
        />
    );
}
