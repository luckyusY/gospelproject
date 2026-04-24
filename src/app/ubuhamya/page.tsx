import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title: "Ubuhamya",
    description: "Ubuhamya bw'abakristu basangira uko Imana yabakoranye mu buzima bwabo.",
    path: "/ubuhamya",
});

export default function UbuhamyaPage() {
    return (
        <SectionPage
            title="Ubuhamya"
            subtitle="URUGERO MEDIA — UBUHAMYA"
            description="Ubuhamya bw'abakristu basangira uko Imana yabakoranye mu buzima bwabo."
            icon="🙏"
            color="#B80000"
            heroImage="https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=1400&auto=format&fit=crop"
        />
    );
}
