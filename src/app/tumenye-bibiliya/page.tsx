import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Tumenye Bibiliya",
    description: "Inyigisho zijya mu bunike bw'Ijambo ry'Imana, zigufasha gusobanukirwa Bibiliya neza.",
    path: "/tumenye-bibiliya",
});

export default function TumenyeBibiliyaPage() {
    return (
        <SectionPage
            title="Tumenye Bibiliya"
            subtitle="URUGERO MEDIA"
            description="Inyigisho zijya mu bunike bw'Ijambo ry'Imana, zigufasha gusobanukirwa Bibiliya neza."
            icon="📖"
            color="#059669"
        />
    );
}
