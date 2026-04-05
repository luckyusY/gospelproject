import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Abana",
    description: "Inyigisho z'Imana zigenewe abana ngo bakure mu kwizera.",
    path: "/inyigisho/abana",
});

export default function AbanaPage() {
    return (
        <SectionPage
            title="Abana"
            subtitle="INYIGISHO"
            description="Inyigisho z'Imana zigenewe abana ngo bakure mu kwizera."
            icon="👶"
            color="#1E40AF"
            breadcrumb={[{ label: "Inyigisho", href: "/inyigisho" }]}
        />
    );
}
