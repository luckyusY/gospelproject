import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildMeta } from "@/lib/metadata";
import { supabase } from "@/lib/supabase";
import type { TestimonyRow } from "@/types/database";
import styles from "./ubuhamya.module.css";

export const metadata: Metadata = buildMeta({
    title: "Ubuhamya",
    description: "Ubuhamya bw'abakristu basangira uko Imana yabakoranye mu buzima bwabo.",
    path: "/ubuhamya",
});

// Revalidate so newly published testimonies show without a full rebuild.
export const revalidate = 60;

function initial(name: string) {
    return name.trim().charAt(0).toUpperCase() || "U";
}

export default async function UbuhamyaPage() {
    const { data } = await supabase
        .from("testimonies")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
    const testimonies = (data ?? []) as TestimonyRow[];

    const featured = testimonies.find(t => t.is_featured) ?? testimonies[0] ?? null;
    const rest = testimonies.filter(t => t.id !== featured?.id);

    return (
        <div className={styles.page}>

            {/* ── Hero ─────────────────────────────────── */}
            <header className={styles.hero}>
                <div className="container">
                    <span className={styles.heroIcon} aria-hidden>🙏</span>
                    <p className={styles.heroSubtitle}>Urugero Media — Ubuhamya</p>
                    <h1 className={styles.heroTitle}>Ubuhamya</h1>
                    <p className={styles.heroDescription}>
                        Ubuhamya bw&apos;abakristu basangira uko Imana yabakoranye mu buzima bwabo.
                    </p>
                </div>
            </header>

            <div className="container">
                {testimonies.length === 0 ? (
                    <p className={styles.empty}>
                        Nta buhamya buraboneka ubu. Subira vuba urebe ubuhamya bushya!
                    </p>
                ) : (
                    <>
                        {/* Featured testimony */}
                        {featured && (
                            <Link href={`/ubuhamya/${featured.slug}`} className={styles.featured}>
                                <div className={styles.featuredImgWrap}>
                                    {featured.image_url ? (
                                        <Image
                                            src={featured.image_url}
                                            alt={featured.title}
                                            fill
                                            className={styles.featuredImg}
                                            sizes="(max-width: 768px) 100vw, 600px"
                                            priority
                                        />
                                    ) : (
                                        <div className={styles.cardImgPlaceholder}>🙏</div>
                                    )}
                                </div>
                                <div className={styles.featuredBody}>
                                    <span className={styles.featuredBadge}>Ubuhamya bukomeye</span>
                                    <h2 className={styles.featuredTitle}>{featured.title}</h2>
                                    <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                                    <div className={styles.person}>
                                        {featured.person_avatar ? (
                                            <Image
                                                src={featured.person_avatar}
                                                alt={featured.person_name}
                                                width={36}
                                                height={36}
                                                className={styles.avatar}
                                            />
                                        ) : (
                                            <span className={styles.avatarFallback}>{initial(featured.person_name)}</span>
                                        )}
                                        <div>
                                            <p className={styles.personName}>{featured.person_name}</p>
                                            {featured.person_church && (
                                                <p className={styles.personChurch}>{featured.person_church}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Grid of the rest */}
                        {rest.length > 0 && (
                            <>
                                <h2 className={styles.gridHeading}>Ubundi buhamya</h2>
                                <div className={styles.grid}>
                                    {rest.map(t => (
                                        <Link key={t.id} href={`/ubuhamya/${t.slug}`} className={styles.card}>
                                            <div className={styles.cardImgWrap}>
                                                {t.image_url ? (
                                                    <Image
                                                        src={t.image_url}
                                                        alt={t.title}
                                                        fill
                                                        className={styles.cardImg}
                                                        sizes="(max-width: 768px) 100vw, 320px"
                                                    />
                                                ) : (
                                                    <div className={styles.cardImgPlaceholder}>🙏</div>
                                                )}
                                            </div>
                                            <div className={styles.cardBody}>
                                                <h3 className={styles.cardTitle}>{t.title}</h3>
                                                <p className={styles.cardExcerpt}>{t.excerpt}</p>
                                                <div className={styles.person}>
                                                    {t.person_avatar ? (
                                                        <Image
                                                            src={t.person_avatar}
                                                            alt={t.person_name}
                                                            width={36}
                                                            height={36}
                                                            className={styles.avatar}
                                                        />
                                                    ) : (
                                                        <span className={styles.avatarFallback}>{initial(t.person_name)}</span>
                                                    )}
                                                    <div>
                                                        <p className={styles.personName}>{t.person_name}</p>
                                                        {t.person_church && (
                                                            <p className={styles.personChurch}>{t.person_church}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
