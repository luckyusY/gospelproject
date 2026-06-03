import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { getPage, getPagesByGroup } from "@/lib/pages";
import SectionPage from "@/components/SectionPage";

const FALLBACK = {
    title: "Urugero Media Group",
    subtitle: "URUGERO MEDIA GROUP",
    description: "Urugero Media Group ni itsinda ry'ibikorwa bitandukanye bya media bigamije gusakaza Ubukristu mu Rwanda no ku isi yose.",
    icon: "🎬",
    color: "#B80000",
    hero: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1400&auto=format&fit=crop",
};

function textFromHtml(html: string) {
    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function pageDescription(page: Awaited<ReturnType<typeof getPage>>) {
    if (!page) return FALLBACK.description;

    const contentText = textFromHtml(page.content);
    return page.subtitle || contentText || FALLBACK.description;
}

const FALLBACK_CHILDREN = [
    { label: "🎵 Urugero Music Academy", href: "/urugero-media-group/music-academy", desc: "Worship training, Vocal & instruments" },
    { label: "🎬 Urugero Films", href: "/urugero-media-group/films", desc: "Video Production, Editing, Documentary" },
    { label: "🎙️ Urugero Records", href: "/urugero-media-group/records", desc: "Recording & Music production" },
    { label: "🌟 Urugero Music Talent", href: "/urugero-media-group/music-talent", desc: "Talent search & Competitions" },
    { label: "📻 Urugero Online Radio", href: "/urugero-media-group/online-radio", desc: "Shows, Music, Teaching" },
    { label: "📖 Urugero Bible Quiz", href: "/urugero-media-group/bible-quiz", desc: "Schools, Churches, YouTube" },
    { label: "🎹 Urugero Practice Room", href: "/urugero-media-group/practice-room", desc: "Rehearsals, Training, YouTube" },
    { label: "🎧 Urugero Podcast", href: "/urugero-media-group/podcast", desc: "Discussions, Interviews, Debates" },
];

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPage("urugero-media-group");
    return buildMeta({
        title: page?.title ?? FALLBACK.title,
        description: pageDescription(page),
        path: "/urugero-media-group",
    });
}

export default async function UrugeroMediaGroupPage() {
    const [page, children] = await Promise.all([
        getPage("urugero-media-group"),
        getPagesByGroup("media-group"),
    ]);

    const subSections = children.length > 0
        ? children.map(c => ({
            label: c.icon ? `${c.icon} ${c.title}` : c.title,
            href:  `/urugero-media-group/${c.slug}`,
            desc:  c.subtitle || undefined,
        }))
        : FALLBACK_CHILDREN;

    return (
        <SectionPage
            title={page?.title ?? FALLBACK.title}
            subtitle={page?.subtitle || FALLBACK.subtitle}
            description={pageDescription(page)}
            icon={page?.icon ?? FALLBACK.icon}
            color={page?.color ?? FALLBACK.color}
            heroImage={page?.hero_image ?? FALLBACK.hero}
            subSections={subSections}
        >
            {page?.content && <div dangerouslySetInnerHTML={{ __html: page.content }} />}
        </SectionPage>
    );
}
