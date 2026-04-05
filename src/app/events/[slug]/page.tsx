import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { buildMeta } from "@/lib/metadata";
import type { EventRow } from "@/types/database";
import type { Metadata } from "next";
import styles from "./event-detail.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const metaResult = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
    const data = metaResult.data as EventRow | null;

    if (!data) return {};
    return buildMeta({
        title: data.title,
        description: data.description,
        path: `/events/${slug}`,
        image: data.image_url ?? undefined,
    });
}

export async function generateStaticParams() {
    const result = await supabase
        .from("events")
        .select("*")
        .eq("is_published", true);
    const rows = (result.data ?? []) as EventRow[];
    return rows.map((e) => ({ slug: e.slug }));
}

export default async function EventDetailPage({ params }: Props) {
    const { slug } = await params;
    const eventResult = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
    const event = eventResult.data as EventRow | null;

    if (!event) notFound();

    const eventDate = new Date(event.event_date).toLocaleDateString("rw-RW", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    return (
        <article className={styles.page}>
            <nav className={styles.breadcrumb} aria-label="Inzira">
                <Link href="/">Ahabanza</Link>
                <span aria-hidden>›</span>
                <Link href="/events">Ibikorwa</Link>
                <span aria-hidden>›</span>
                <span aria-current="page">{event.title}</span>
            </nav>

            <div className={styles.hero}>
                <span className={styles.tag}>{event.tag}</span>
                <h1 className={styles.title}>{event.title}</h1>
                <p className={styles.description}>{event.description}</p>

                <div className={styles.infoBar}>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Itariki</span>
                        <span className={styles.infoValue}>{eventDate}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Ahantu</span>
                        <span className={styles.infoValue}>{event.location}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Igiciro</span>
                        <span className={styles.infoValue}>
                            {event.is_free ? "Ubuntu" : (event.price ?? "Baza")}
                        </span>
                    </div>
                </div>
            </div>

            {event.image_url && (
                <div className={styles.coverWrap}>
                    <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className={styles.coverImg}
                        priority
                    />
                </div>
            )}

            {event.content && (
                <div className={styles.body}>
                    {event.content.split("\n").filter(Boolean).map((para, i) => (
                        <p key={i} className={styles.para}>{para}</p>
                    ))}
                </div>
            )}

            <div className={styles.footer}>
                <Link href="/events" className={styles.backLink}>
                    ← Garuka ku bikorwa
                </Link>
            </div>
        </article>
    );
}
