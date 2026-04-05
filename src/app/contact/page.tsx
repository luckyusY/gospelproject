import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Twandikire",
    description: "Twandikire kugira ngo dushobore gukorana cyangwa kukubwira ibindi bya Urugero Media.",
    path: "/contact",
});

export default function ContactPage() {
    return (
        <SectionPage
            title="Twandikire"
            subtitle="URUGERO MEDIA — CONTACT"
            description="Twandikire kugira ngo dushobore gukorana, gutumanahira cyangwa kukubwira ibindi bya Urugero Media Group."
            icon="✉️"
            color="#059669"
        />
    );
}
