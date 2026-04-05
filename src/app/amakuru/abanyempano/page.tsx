import SectionPage from "@/components/SectionPage";

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
