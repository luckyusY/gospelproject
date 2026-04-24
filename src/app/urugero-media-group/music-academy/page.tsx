import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Urugero Music Academy",
    description: "Urugero Music Academy itoza abakunzi b'Imana indirimbo, gusingiza no gukinira Imana.",
    path: "/urugero-media-group/music-academy",
});

export default function MusicAcademyPage() {
    return (
        <SectionPage
            title="Urugero Music Academy"
            subtitle="URUGERO MEDIA GROUP"
            description="Urugero Music Academy itoza abakunzi b'Imana indirimbo z'Imana, gusingiza no gukinira Imana binyuze mu Worship training na Vocal & instruments."
            icon="🎵"
            color="#B80000"
            breadcrumb={[{ label: "Urugero Media Group", href: "/urugero-media-group" }]}
            subSections={[
                { label: "Worship Training", href: "/urugero-media-group/music-academy", desc: "Inyigisho zo gusingiza Imana" },
                { label: "Vocal & Instruments", href: "/urugero-media-group/music-academy", desc: "Inyigisho z'ijwi no gukinira amakondo" },
            ]}
        />
    );
}
