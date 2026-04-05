import SectionPage from "@/components/SectionPage";

export default function AbagaboPage() {
    return (
        <SectionPage
            title="Abagabo"
            subtitle="INYIGISHO"
            description="Inyigisho z'Imana zigenewe abagabo b'Ubukristu."
            icon="👨"
            color="#1E40AF"
            breadcrumb={[{ label: "Inyigisho", href: "/inyigisho" }]}
        />
    );
}
