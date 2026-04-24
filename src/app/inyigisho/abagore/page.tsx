import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Abagore",
    description: "Inyigisho z'Imana zigenewe abagore b'Ubukristu.",
    path: "/inyigisho/abagore",
});

export default function AbagorePage() {
    return (
        <SectionPage
            title="Abagore"
            subtitle="INYIGISHO"
            description="Inyigisho z'Imana zigenewe abagore b'Ubukristu."
            icon="👩"
            color="#B80000"
            breadcrumb={[{ label: "Inyigisho", href: "/inyigisho" }]}
        />
    );
}
