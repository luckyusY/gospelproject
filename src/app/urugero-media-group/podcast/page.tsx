import SectionPage from "@/components/SectionPage";

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
