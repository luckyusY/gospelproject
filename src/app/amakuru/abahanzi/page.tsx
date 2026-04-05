import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Abahanzi",
    description: "Amakuru mashya y'abahanzi b'Imana mu Rwanda no ku isi yose.",
    path: "/amakuru/abahanzi",
});

export default function AbahanziPage() {
    return (
        <SectionPage
            title="Abahanzi"
            subtitle="AMAKURU"
            description="Amakuru mashya y'abahanzi b'Imana mu Rwanda no ku isi yose."
            icon="🎤"
            color="#DC2626"
            breadcrumb={[{ label: "Amakuru", href: "/amakuru" }]}
        />
    );
}
