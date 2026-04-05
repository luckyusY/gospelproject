import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { buildMeta } from "@/lib/metadata";
import type { TestimonyRow } from "@/types/database";
import type { Metadata } from "next";
import styles from "./testimony.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const metaResult = await supabase
        .from("testimonies")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
    const data = metaResult.data as TestimonyRow | null;

    if (!data) return {};
    return buildMeta({
        title: data.title,
        description: data.excerpt,
        path: `/ubuhamya/${slug}`,
        image: data.image_url ?? undefined,
    });
}

export async function generateStaticParams() {
    const result = await supabase
        .from("testimonies")
        .select("*")
        .eq("is_published", true);
    const rows = (result.data ?? []) as TestimonyRow[];
    return rows.map((t) => ({ slug: t.slug }));
}

export default async function TestimonyPage({ params }: Props) {
    const { slug } = await params;
    const testimonyResult = await supabase
        .from("testimonies")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
    const testimony = testimonyResult.data as TestimonyRow | null;

    if (!testimony) notFound();

    const sections = testimony.content.split(/\n##\s+/).filter(Boolean);

    return (
        <article className={styles.page}>
            <nav className={styles.breadcrumb} aria-label="Inzira">
                <Link href="/">Ahabanza</Link>
                <span aria-hidden>›</span>
                <Link href="/ubuhamya">Ubuhamya</Link>
                <span aria-hidden>›</span>
                <span aria-current="page">{testimony.title}</span>
            </nav>

            <div className={styles.hero}>
                <span className={styles.badge}>Ubuhamya</span>
                <h1 className={styles.title}>{testimony.title}</h1>
                <p className={styles.excerpt}>{testimony.excerpt}</p>

                <div className={styles.person}>
                    {testimony.person_avatar && (
                        <Image
                            src={testimony.person_avatar}
                            alt={testimony.person_name}
                            width={48}
                            height={48}
                            className={styles.avatar}
                        />
                    )}
                    <div>
                        <p className={styles.personName}>{testimony.person_name}</p>
                        {testimony.person_church && (
                            <p className={styles.personChurch}>{testimony.person_church}</p>
                        )}
                    </div>
                </div>
            </div>

            {testimony.image_url && (
                <div className={styles.coverWrap}>
                    <Image
                        src={testimony.image_url}
                        alt={testimony.title}
                        fill
                        className={styles.coverImg}
                        priority
                    />
                </div>
            )}

            <div className={styles.body}>
                {sections.map((section, i) => {
                    const lines = section.split("\n").filter(Boolean);
                    const heading = i === 0 && !testimony.content.startsWith("##")
                        ? null
                        : lines[0];
                    const body = heading ? lines.slice(1) : lines;

                    return (
                        <section key={i} className={styles.section}>
                            {heading && <h2 className={styles.sectionHeading}>{heading}</h2>}
                            {body.map((para, j) => (
                                <p key={j} className={styles.para}>{para}</p>
                            ))}
                        </section>
                    );
                })}
            </div>

            <div className={styles.footer}>
                <Link href="/ubuhamya" className={styles.backLink}>
                    ← Garuka ku buhamya
                </Link>
            </div>
        </article>
    );
}
