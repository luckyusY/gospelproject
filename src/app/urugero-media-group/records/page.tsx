import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Urugero Records",
    description: "Urugero Records iteranya abahanzi bo gurecodi indirimbo z'Imana.",
    path: "/urugero-media-group/records",
});

export default function RecordsPage() {
    return (
        <SectionPage
            title="Urugero Records"
            subtitle="URUGERO MEDIA GROUP"
            description="Urugero Records iteranya abahanzi bo gurecodi indirimbo z'Imana mu studio yabo ya kinyaboneka."
            icon="🎙️"
            color="#B80000"
            breadcrumb={[{ label: "Urugero Media Group", href: "/urugero-media-group" }]}
            subSections={[
                { label: "Recording", href: "/urugero-media-group/records", desc: "Gurecodi indirimbo" },
                { label: "Music Production", href: "/urugero-media-group/records", desc: "Gushyira indirimbo mu ntangiriro" },
            ]}
        />
    );
}
