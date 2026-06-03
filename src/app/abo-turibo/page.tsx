import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { getPage } from "@/lib/pages";
import SectionPage from "@/components/SectionPage";

const FALLBACK = {
    title: "Abo Turibo",
    subtitle: "URUGERO MEDIA — ABO TURIBO",
    description: "Menya neza abo turibo, inzozi zacu n'ibyo twizeye mu gukorera Imana binyuze mu Urugero Media Group.",
    icon: "👥",
    color: "#1F1F1F",
    hero: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=1400&auto=format&fit=crop",
};

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPage("abo-turibo");
    return buildMeta({
        title: page?.title ?? FALLBACK.title,
        description: page?.subtitle || FALLBACK.description,
        path: "/abo-turibo",
    });
}

export default async function AboTuriboPage() {
    const page = await getPage("abo-turibo");
    return (
        <SectionPage
            title={page?.title ?? FALLBACK.title}
            subtitle={page?.subtitle || FALLBACK.subtitle}
            description={FALLBACK.description}
            icon={page?.icon ?? FALLBACK.icon}
            color={page?.color ?? FALLBACK.color}
            heroImage={page?.hero_image ?? FALLBACK.hero}
        >
            {page?.content && <div dangerouslySetInnerHTML={{ __html: page.content }} />}
        </SectionPage>
    );
}
