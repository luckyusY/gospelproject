import SectionPage from "@/components/SectionPage";

export default function AmakoraliPage() {
    return (
        <SectionPage
            title="Amakorali"
            subtitle="AMAKURU"
            description="Amakuru y'amakorali azwi cyane mu Rwanda n'isi yose."
            icon="🎵"
            color="#DC2626"
            breadcrumb={[{ label: "Amakuru", href: "/amakuru" }]}
        />
    );
}
