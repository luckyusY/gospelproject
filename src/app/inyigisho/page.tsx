import SectionPage from "@/components/SectionPage";

export default function InyigishoPage() {
    return (
        <SectionPage
            title="Inyigisho"
            subtitle="URUGERO MEDIA — INYIGISHO"
            description="Inyigisho z'Imana ku bihuye n'umuryango, abana, urubyiruko, abagabo, abagore n'ubuzima bw'umwuka."
            icon="📚"
            color="#1E40AF"
            subSections={[
                { label: "Umuryango", href: "/inyigisho/umuryango", desc: "Inyigisho z'umuryango" },
                { label: "Abana", href: "/inyigisho/abana", desc: "Inyigisho z'abana" },
                { label: "Urubyiruko", href: "/inyigisho/urubyiruko", desc: "Inyigisho z'urubyiruko" },
                { label: "Abagabo", href: "/inyigisho/abagabo", desc: "Inyigisho z'abagabo" },
                { label: "Abagore", href: "/inyigisho/abagore", desc: "Inyigisho z'abagore" },
                { label: "Ubuzima bw'Umwuka", href: "/inyigisho/ubuzima-bwumwuka", desc: "Ubuzima bw'umwuka" },
                { label: "Bible Quiz", href: "/inyigisho/bible-quiz", desc: "Ibibazo bya Bibiliya" },
            ]}
        />
    );
}
