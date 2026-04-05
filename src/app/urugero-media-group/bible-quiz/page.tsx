import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Urugero Bible Quiz",
    description: "Urugero Bible Quiz iteranya amashuri, amatorero na YouTube mu gukora ibibazo bya Bibiliya.",
    path: "/urugero-media-group/bible-quiz",
});

export default function BibleQuizPage() {
    return (
        <SectionPage
            title="Urugero Bible Quiz"
            subtitle="URUGERO MEDIA GROUP"
            description="Urugero Bible Quiz iteranya amashuri, amatorero na YouTube mu gukora ibibazo bya Bibiliya."
            icon="📖"
            color="#F59E0B"
            breadcrumb={[{ label: "Urugero Media Group", href: "/urugero-media-group" }]}
            subSections={[
                { label: "Schools", href: "/urugero-media-group/bible-quiz", desc: "Bible Quiz mu mashuri" },
                { label: "Churches", href: "/urugero-media-group/bible-quiz", desc: "Bible Quiz mu amatorero" },
                { label: "YouTube Program", href: "/urugero-media-group/bible-quiz", desc: "Bible Quiz kuri YouTube" },
            ]}
        />
    );
}
