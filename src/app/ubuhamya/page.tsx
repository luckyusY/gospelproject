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
            color="#059669"
        />
    );
}
