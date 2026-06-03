import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { supabase } from "@/lib/supabase";
import { getPage } from "@/lib/pages";
import SectionPage from "@/components/SectionPage";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const page = await getPage(slug);
    if (!page || page.nav_group !== "media-group") return {};
    return buildMeta({
        title: page.title,
        description: page.subtitle || page.title,
        path: `/urugero-media-group/${slug}`,
    });
}

export async function generateStaticParams() {
    const { data } = await supabase
        .from("pages")
        .select("slug")
        .eq("nav_group", "media-group")
        .eq("is_published", true);
    return ((data ?? []) as { slug: string }[]).map(row => ({ slug: row.slug }));
}

export default async function MediaGroupChildPage({ params }: Props) {
    const { slug } = await params;
    const page = await getPage(slug);
    if (!page || page.nav_group !== "media-group") notFound();

    return (
        <SectionPage
            title={page.title}
            subtitle={page.subtitle || "URUGERO MEDIA GROUP"}
            description={page.subtitle || page.title}
            icon={page.icon ?? "🎬"}
            color={page.color ?? "#B80000"}
            heroImage={page.hero_image ?? undefined}
            breadcrumb={[{ label: "Urugero Media Group", href: "/urugero-media-group" }]}
        >
            {page.content && <div dangerouslySetInnerHTML={{ __html: page.content }} />}
        </SectionPage>
    );
}
