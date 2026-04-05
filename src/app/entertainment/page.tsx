import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title:       "Imyidagaduro y'Imana",
    description: "Imyidagaduro y'Imana — indirimbo, filimi, ibitaramo na podcast bya Urugero Media.",
    path:        "/entertainment",
});

export default function EntertainmentPage() {
    return (
        <SectionPage
            title="Imyidagaduro y'Imana"
            subtitle="URUGERO MEDIA — IMYIDAGADURO"
            description="Imyidagaduro y'Imana igabanyijwe na Urugero Media — indirimbo, filimi, podcast, ibitaramo n'ibindi byinshi."
            icon="🎵"
            color="var(--gold)"
            subSections={[
                { label: "Abahanzi",           href: "/amakuru/abahanzi",                  desc: "Amakuru y'abahanzi b'Imana" },
                { label: "Amakorali",           href: "/amakuru/amakorali",                 desc: "Amakuru y'amakorali" },
                { label: "Urugero Films",        href: "/urugero-media-group/films",         desc: "Filimi n'ibiganiro" },
                { label: "Urugero Records",      href: "/urugero-media-group/records",       desc: "Indirimbo z'Imana" },
                { label: "Urugero Podcast",      href: "/urugero-media-group/podcast",       desc: "Ibiganiro n'impaka" },
                { label: "Urugero Online Radio", href: "/urugero-media-group/online-radio",  desc: "Radio ya Gikrisitu" },
            ]}
        />
    );
}
