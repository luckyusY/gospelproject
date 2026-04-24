import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Amakorali",
    description: "Amakuru y'amakorali azwi cyane mu Rwanda n'isi yose.",
    path: "/amakuru/amakorali",
});

export default function AmakoraliPage() {
    return (
        <SectionPage
            title="Amakorali"
            subtitle="AMAKURU"
            description="Amakuru y'amakorali azwi cyane mu Rwanda n'isi yose."
            icon="🎵"
            color="#EB0000"
            breadcrumb={[{ label: "Amakuru", href: "/amakuru" }]}
        />
    );
}
