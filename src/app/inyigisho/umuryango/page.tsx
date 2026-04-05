import SectionPage from "@/components/SectionPage";

export default function UmuryangaPage() {
    return (
        <SectionPage
            title="Umuryango"
            subtitle="INYIGISHO"
            description="Inyigisho z'Imana ku bihuye n'umuryango n'uburere bw'abana."
            icon="👨‍👩‍👧‍👦"
            color="#1E40AF"
            breadcrumb={[{ label: "Inyigisho", href: "/inyigisho" }]}
        />
    );
}
