import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Urugero Practice Room",
    description: "Urugero Practice Room — ahantu abahanzi basezerana kwitoza no gusinya indirimbo z'Imana.",
    path: "/urugero-media-group/practice-room",
});

export default function PracticeRoomPage() {
    return (
        <SectionPage
            title="Urugero Practice Room"
            subtitle="URUGERO MEDIA GROUP"
            description="Urugero Practice Room ni ahantu abahanzi basezerana kwitoza no gusinya indirimbo z'Imana hamwe."
            icon="🎹"
            color="#F59E0B"
            breadcrumb={[{ label: "Urugero Media Group", href: "/urugero-media-group" }]}
            subSections={[
                { label: "Rehearsals", href: "/urugero-media-group/practice-room", desc: "Gusesengura indirimbo" },
                { label: "Training", href: "/urugero-media-group/practice-room", desc: "Kwiga no kwitoza" },
                { label: "YouTube Sessions", href: "/urugero-media-group/practice-room", desc: "Inyigisho kuri YouTube" },
            ]}
        />
    );
}
