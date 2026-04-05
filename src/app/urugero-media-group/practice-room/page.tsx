import SectionPage from "@/components/SectionPage";

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
