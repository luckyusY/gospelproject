import SectionPage from "@/components/SectionPage";

export default function UrubyirukoPage() {
    return (
        <SectionPage
            title="Urubyiruko"
            subtitle="INYIGISHO"
            description="Inyigisho z'Imana zigenewe urubyiruko mu bihe bya none."
            icon="🌱"
            color="#1E40AF"
            breadcrumb={[{ label: "Inyigisho", href: "/inyigisho" }]}
        />
    );
}
