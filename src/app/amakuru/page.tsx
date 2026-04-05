import SectionPage from "@/components/SectionPage";

export default function AmakuruPage() {
    return (
        <SectionPage
            title="Amakuru"
            subtitle="URUGERO MEDIA — AMAKURU"
            description="Amakuru mashya y'Ubukristu mu Rwanda no ku isi yose. Abahanzi, Amakorali, Amatorero n'ibindi."
            icon="📰"
            color="#DC2626"
            subSections={[
                { label: "Abahanzi", href: "/amakuru/abahanzi", desc: "Amakuru y'abahanzi b'Imana" },
                { label: "Amakorali", href: "/amakuru/amakorali", desc: "Amakuru y'amakorali" },
                { label: "Amatorero", href: "/amakuru/amatorero", desc: "Amakuru y'amatorero" },
                { label: "Abanyempano", href: "/amakuru/abanyempano", desc: "Abanyempano b'Imana" },
                { label: "Ibitaramo", href: "/amakuru/ibitaramo", desc: "Ibitaramo bya Gikrisitu" },
                { label: "Hanze y'u Rwanda", href: "/amakuru/hanze-yu-rwanda", desc: "Amakuru avuye hanze y'u Rwanda" },
            ]}
        />
    );
}
