import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Ibigwi",
    description: "Ibigwi n'ibikorwa by'abakristu bisangirwa n'abandi.",
    path: "/ibigwi",
});

export default function IbigwiPage() {
    return (
        <SectionPage
            title="Ibigwi"
            subtitle="URUGERO MEDIA — IBIGWI"
            description="Ibigwi n'ibikorwa by'abakristu bisangirwa n'abandi ngo bibihe imbaraga."
            icon="🏆"
            color="#7C3AED"
            heroImage="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=1400&auto=format&fit=crop"
        />
    );
}
