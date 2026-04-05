import SectionPage from "@/components/SectionPage";

export default function AmatoreroPage() {
    return (
        <SectionPage
            title="Amatorero"
            subtitle="AMAKURU"
            description="Amakuru y'amatorero n'ibikorwa by'itorero mu Rwanda."
            icon="⛪"
            color="#DC2626"
            breadcrumb={[{ label: "Amakuru", href: "/amakuru" }]}
        />
    );
}
