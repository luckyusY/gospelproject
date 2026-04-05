import SectionPage from "@/components/SectionPage";

export default function AbagorePage() {
    return (
        <SectionPage
            title="Abagore"
            subtitle="INYIGISHO"
            description="Inyigisho z'Imana zigenewe abagore b'Ubukristu."
            icon="👩"
            color="#1E40AF"
            breadcrumb={[{ label: "Inyigisho", href: "/inyigisho" }]}
        />
    );
}
