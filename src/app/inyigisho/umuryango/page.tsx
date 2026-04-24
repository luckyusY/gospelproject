import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Umuryango",
    description: "Inyigisho z'Imana ku bihuye n'umuryango n'uburere bw'abana.",
    path: "/inyigisho/umuryango",
});

export default function UmuryangaPage() {
    return (
        <SectionPage
            title="Umuryango"
            subtitle="INYIGISHO"
            description="Inyigisho z'Imana ku bihuye n'umuryango n'uburere bw'abana."
            icon="👨‍👩‍👧‍👦"
            color="#B80000"
            breadcrumb={[{ label: "Inyigisho", href: "/inyigisho" }]}
        />
    );
}
