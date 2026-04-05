import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Urugero TV & Radio",
    description: "Urugero TV na Radio — amajwi y'Imana, inyigisho, ibitaramo n'ubuhamya buri munsi.",
    path: "/urugero-tv-radio",
});

export default function UrgeroTvRadioPage() {
    return (
        <SectionPage
            title="Urugero TV & Radio"
            subtitle="URUGERO MEDIA GROUP"
            description="Urugero TV na Radio ni ahantu usangirira amajwi y'Imana, inyigisho, ibitaramo n'ubuhamya buri munsi."
            icon="📺"
            color="#DC2626"
        />
    );
}
