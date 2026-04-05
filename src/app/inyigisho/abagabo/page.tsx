import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Abagabo",
    description: "Inyigisho z'Imana zigenewe abagabo b'Ubukristu.",
    path: "/inyigisho/abagabo",
});

export default function AbagaboPage() {
    return (
        <SectionPage
            title="Abagabo"
            subtitle="INYIGISHO"
            description="Inyigisho z'Imana zigenewe abagabo b'Ubukristu."
            icon="👨"
            color="#1E40AF"
            breadcrumb={[{ label: "Inyigisho", href: "/inyigisho" }]}
        />
    );
}
