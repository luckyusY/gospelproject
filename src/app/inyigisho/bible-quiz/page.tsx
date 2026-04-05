import SectionPage from "@/components/SectionPage";

export default function BibleQuizInyigishoPage() {
    return (
        <SectionPage
            title="Bible Quiz"
            subtitle="INYIGISHO"
            description="Ibibazo bya Bibiliya bigufasha kwiga no gusobanukirwa ijambo ry'Imana."
            icon="❓"
            color="#1E40AF"
            breadcrumb={[{ label: "Inyigisho", href: "/inyigisho" }]}
        />
    );
}
