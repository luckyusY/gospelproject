import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { getPage } from "@/lib/pages";
import SectionPage from "@/components/SectionPage";

const FALLBACK = {
    title: "Ibigwi",
    subtitle: "URUGERO MEDIA — IBIGWI",
    description: "Ibigwi n'ibikorwa by'abakristu bisangirwa n'abandi ngo bibihe imbaraga.",
    icon: "🏆",
    color: "#1F1F1F",
    hero: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=1400&auto=format&fit=crop",
};

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPage("ibigwi");
    return buildMeta({
        title: page?.title ?? FALLBACK.title,
        description: page?.subtitle || FALLBACK.description,
        path: "/ibigwi",
    });
}

export default async function IbigwiPage() {
    const page = await getPage("ibigwi");
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
