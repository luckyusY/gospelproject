import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Bible Quiz",
    description: "Ibibazo bya Bibiliya bigufasha kwiga no gusobanukirwa ijambo ry'Imana.",
    path: "/inyigisho/bible-quiz",
});

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
