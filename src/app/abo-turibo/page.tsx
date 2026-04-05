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
            color="#0D1B2E"
        />
    );
}
