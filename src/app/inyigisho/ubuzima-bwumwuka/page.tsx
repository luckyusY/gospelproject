import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Ubuzima bw'Umwuka",
    description: "Inyigisho ku buzima bw'umwuka n'uburyo bwo kwiyungurura mu Mana.",
    path: "/inyigisho/ubuzima-bwumwuka",
});

export default function UbuzimaBwumwukaPage() {
    return (
        <SectionPage
            title="Ubuzima bw'Umwuka"
            subtitle="INYIGISHO"
            description="Inyigisho ku buzima bw'umwuka n'uburyo bwo kwiyungurura mu Mana."
            icon="✨"
            color="#B80000"
            breadcrumb={[{ label: "Inyigisho", href: "/inyigisho" }]}
        />
    );
}
