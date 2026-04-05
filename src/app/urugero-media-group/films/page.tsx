import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Urugero Films",
    description: "Urugero Films ikorera filimi, videos n'ibiganiro by'Ubukristu.",
    path: "/urugero-media-group/films",
});

export default function FilmsPage() {
    return (
        <SectionPage
            title="Urugero Films"
            subtitle="URUGERO MEDIA GROUP"
            description="Urugero Films ikorera filimi, videos n'ibiganiro by'Ubukristu bifasha abantu kwizerana n'Imana."
            icon="🎬"
            color="#F59E0B"
            breadcrumb={[{ label: "Urugero Media Group", href: "/urugero-media-group" }]}
            subSections={[
                { label: "Video Production", href: "/urugero-media-group/films", desc: "Gukora videos za Gikrisitu" },
                { label: "Editing", href: "/urugero-media-group/films", desc: "Gukoraho videos" },
                { label: "Event Coverage", href: "/urugero-media-group/films", desc: "Kwandika ibitaramo" },
                { label: "Documentary", href: "/urugero-media-group/films", desc: "Filimi z'ubuhamya" },
            ]}
        />
    );
}
