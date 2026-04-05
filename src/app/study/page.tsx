import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title:       "Inyigisho za Bibiliya",
    description: "Inyigisho zijya mu bunike bw'Ijambo ry'Imana — Bible Study, Bible Quiz na Tumenye Bibiliya.",
    path:        "/study",
});

export default function StudyPage() {
    return (
        <SectionPage
            title="Inyigisho za Bibiliya"
            subtitle="TUMENYE BIBILIYA — KWIGA"
            description="Inyigisho zijya mu bunike bw'Ijambo ry'Imana, zigufasha gusobanukirwa Bibiliya neza kandi ukore ibibazo bya Bible Quiz."
            icon="📖"
            color="var(--blue)"
            subSections={[
                { label: "Tumenye Bibiliya",   href: "/tumenye-bibiliya",         desc: "Inyigisho zijya mu bunike bw'Ijambo" },
                { label: "Bible Quiz",          href: "/inyigisho/bible-quiz",     desc: "Ibibazo bya Bibiliya" },
                { label: "Urugero Bible Quiz",  href: "/urugero-media-group/bible-quiz", desc: "Porogaramu ya Bible Quiz kuri YouTube" },
                { label: "Inyigisho",           href: "/inyigisho",               desc: "Inyigisho zose" },
            ]}
        />
    );
}
