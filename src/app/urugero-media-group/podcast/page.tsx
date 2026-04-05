import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Urugero Podcast",
    description: "Urugero Podcast — ibiganiro, ibibazo n'impaka ku bihuye n'Ubukristu n'ubuzima.",
    path: "/urugero-media-group/podcast",
});

export default function PodcastPage() {
    return (
        <SectionPage
            title="Urugero Podcast"
            subtitle="URUGERO MEDIA GROUP"
            description="Urugero Podcast ni gahunda y'ibiganiro, ibibazo n'ikiganiro ku bihuye n'Ubukristu n'ubuzima."
            icon="🎧"
            color="#F59E0B"
            breadcrumb={[{ label: "Urugero Media Group", href: "/urugero-media-group" }]}
            subSections={[
                { label: "Discussions", href: "/urugero-media-group/podcast", desc: "Ibiganiro by'indepth" },
                { label: "Interviews", href: "/urugero-media-group/podcast", desc: "Ibibazo n'abantu" },
                { label: "Debates", href: "/urugero-media-group/podcast", desc: "Impaka ku migani" },
            ]}
        />
    );
}
