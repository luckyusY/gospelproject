import SectionPage from "@/components/SectionPage";

export default function IbitaramoPage() {
    return (
        <SectionPage
            title="Ibitaramo"
            subtitle="AMAKURU"
            description="Amakuru y'ibitaramo bya Gikrisitu mu Rwanda."
            icon="🎪"
            color="#DC2626"
            breadcrumb={[{ label: "Amakuru", href: "/amakuru" }]}
        />
    );
}
