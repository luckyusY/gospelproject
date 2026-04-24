import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Abo Turibo",
    description: "Menya abo turibo, inzozi zacu n'ibyo twizeye mu gukorera Imana binyuze mu Urugero Media.",
    path: "/abo-turibo",
});

export default function AboTuriboPage() {
    return (
        <SectionPage
            title="Abo Turibo"
            subtitle="URUGERO MEDIA — ABO TURIBO"
            description="Menya neza abo turibo, inzozi zacu n'ibyo twizeye mu gukorera Imana binyuze mu Urugero Media Group."
            icon="👥"
            color="#1F1F1F"
            heroImage="https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=1400&auto=format&fit=crop"
        />
    );
}
