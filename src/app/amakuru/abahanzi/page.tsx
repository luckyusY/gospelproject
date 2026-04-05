import SectionPage from "@/components/SectionPage";

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
