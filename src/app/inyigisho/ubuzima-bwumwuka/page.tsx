import SectionPage from "@/components/SectionPage";

export default function UbuzimaBwumwukaPage() {
    return (
        <SectionPage
            title="Ubuzima bw'Umwuka"
            subtitle="INYIGISHO"
            description="Inyigisho ku buzima bw'umwuka n'uburyo bwo kwiyungurura mu Mana."
            icon="✨"
            color="#1E40AF"
            breadcrumb={[{ label: "Inyigisho", href: "/inyigisho" }]}
        />
    );
}
