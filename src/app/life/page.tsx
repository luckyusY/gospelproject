import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import SectionPage from "@/components/SectionPage";

export const metadata: Metadata = buildMeta({
    title:       "Ubuzima bw'Umukristu",
    description: "Inyigisho z'Imana ku buzima bw'umuryango, abagabo, abagore n'ubuzima bw'umwuka.",
    path:        "/life",
});

export default function LifePage() {
    return (
        <SectionPage
            title="Ubuzima bw'Umukristu"
            subtitle="INYIGISHO — UBUZIMA"
            description="Inyigisho z'Imana ku buzima bw'umuryango, abagabo, abagore n'ubuzima bw'umwuka mu gihe cya none."
            icon="🌿"
            color="var(--green)"
            subSections={[
                { label: "Umuryango",          href: "/inyigisho/umuryango",        desc: "Inyigisho z'umuryango n'uburere bw'abana" },
                { label: "Abagabo",            href: "/inyigisho/abagabo",           desc: "Inyigisho zigenewe abagabo" },
                { label: "Abagore",            href: "/inyigisho/abagore",           desc: "Inyigisho zigenewe abagore" },
                { label: "Urubyiruko",         href: "/inyigisho/urubyiruko",        desc: "Inyigisho z'urubyiruko" },
                { label: "Ubuzima bw'Umwuka",  href: "/inyigisho/ubuzima-bwumwuka", desc: "Kwiyungurura mu Mana" },
            ]}
        />
    );
}
