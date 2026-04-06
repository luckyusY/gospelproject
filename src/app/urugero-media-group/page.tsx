import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Urugero Media Group",
    description: "Itsinda ry'ibikorwa bya media bigamije gusakaza Ubukristu mu Rwanda no ku isi yose.",
    path: "/urugero-media-group",
});

export default function UrugeroMediaGroupPage() {
    return (
        <SectionPage
            title="Urugero Media Group"
            subtitle="URUGERO MEDIA GROUP"
            description="Urugero Media Group ni itsinda ry'ibikorwa bitandukanye bya media bigamije gusakaza Ubukristu mu Rwanda no ku isi yose."
            icon="🎬"
            color="#F59E0B"
            heroImage="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1400&auto=format&fit=crop"
            subSections={[
                { label: "🎵 Urugero Music Academy", href: "/urugero-media-group/music-academy", desc: "Worship training, Vocal & instruments" },
                { label: "🎬 Urugero Films", href: "/urugero-media-group/films", desc: "Video Production, Editing, Documentary" },
                { label: "🎙️ Urugero Records", href: "/urugero-media-group/records", desc: "Recording & Music production" },
                { label: "🌟 Urugero Music Talent", href: "/urugero-media-group/music-talent", desc: "Talent search & Competitions" },
                { label: "📻 Urugero Online Radio", href: "/urugero-media-group/online-radio", desc: "Shows, Music, Teaching" },
                { label: "📖 Urugero Bible Quiz", href: "/urugero-media-group/bible-quiz", desc: "Schools, Churches, YouTube" },
                { label: "🎹 Urugero Practice Room", href: "/urugero-media-group/practice-room", desc: "Rehearsals, Training, YouTube" },
                { label: "🎧 Urugero Podcast", href: "/urugero-media-group/podcast", desc: "Discussions, Interviews, Debates" },
            ]}
        />
    );
}
