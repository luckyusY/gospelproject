import SectionPage from "@/components/SectionPage";

export default function HanzeYuRwandaPage() {
    return (
        <SectionPage
            title="Hanze y'u Rwanda"
            subtitle="AMAKURU"
            description="Amakuru y'Ubukristu avuye mu bihugu byo hanze y'u Rwanda."
            icon="🌍"
            color="#DC2626"
            breadcrumb={[{ label: "Amakuru", href: "/amakuru" }]}
        />
    );
}
