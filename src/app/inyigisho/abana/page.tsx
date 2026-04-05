import SectionPage from "@/components/SectionPage";

export default function AbanaPage() {
    return (
        <SectionPage
            title="Abana"
            subtitle="INYIGISHO"
            description="Inyigisho z'Imana zigenewe abana ngo bakure mu kwizera."
            icon="👶"
            color="#1E40AF"
            breadcrumb={[{ label: "Inyigisho", href: "/inyigisho" }]}
        />
    );
}
