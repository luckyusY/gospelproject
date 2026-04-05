import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Urugero Music Talent",
    description: "Urugero Music Talent ishakisha no guteza imbere abahanzi bashya b'Imana mu Rwanda.",
    path: "/urugero-media-group/music-talent",
});

export default function MusicTalentPage() {
    return (
        <SectionPage
            title="Urugero Music Talent"
            subtitle="URUGERO MEDIA GROUP"
            description="Urugero Music Talent ishakisha no guteza imbere abahanzi bashya b'Imana mu Rwanda."
            icon="🌟"
            color="#F59E0B"
            breadcrumb={[{ label: "Urugero Media Group", href: "/urugero-media-group" }]}
            subSections={[
                { label: "Talent Search", href: "/urugero-media-group/music-talent", desc: "Gushaka abahanzi" },
                { label: "Competitions", href: "/urugero-media-group/music-talent", desc: "Imikino y'abahanzi" },
            ]}
        />
    );
}
