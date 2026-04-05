import SectionPage from "@/components/SectionPage";

export default function MusicAcademyPage() {
    return (
        <SectionPage
            title="Urugero Music Academy"
            subtitle="URUGERO MEDIA GROUP"
            description="Urugero Music Academy itoza abakunzi b'Imana indirimbo z'Imana, gusingiza no gukinira Imana binyuze mu Worship training na Vocal & instruments."
            icon="🎵"
            color="#F59E0B"
            breadcrumb={[{ label: "Urugero Media Group", href: "/urugero-media-group" }]}
            subSections={[
                { label: "Worship Training", href: "/urugero-media-group/music-academy", desc: "Inyigisho zo gusingiza Imana" },
                { label: "Vocal & Instruments", href: "/urugero-media-group/music-academy", desc: "Inyigisho z'ijwi no gukinira amakondo" },
            ]}
        />
    );
}
