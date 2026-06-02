import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { getPublicSiteSettings } from "@/lib/siteSettings";
import ContactForm from "./ContactForm";
import styles from "./contact.module.css";

export const metadata: Metadata = buildMeta({
    title: "Twandikire",
    description: "Twandikire kugira ngo dushobore gukorana cyangwa kukubwira ibindi bya Urugero Media.",
    path: "/contact",
});

const contactInfo = [
    { icon: "📍", label: "Aderesi", value: "Kigali, Rwanda" },
    { icon: "📧", label: "Imeyili", value: "info@urugerogospelnews.com" },
    { icon: "📱", label: "Telefoni", value: "+250 788 000 000" },
    { icon: "🕐", label: "Amasaha", value: "Kuwa mbere — Kuwa gatanu: 8h–17h" },
];

const defaultSocialLinks = [
    { key: "social_youtube", label: "YouTube", href: "https://www.youtube.com/@Urugerotv-r4o" },
    { key: "social_facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61589904326903" },
    { key: "social_instagram", label: "Instagram", href: "https://www.instagram.com/rwandagospelnews/" },
    { key: "social_twitter", label: "Twitter / X", href: "https://x.com/UrugeroR98356" },
];

export default async function ContactPage() {
    const settings = await getPublicSiteSettings();
    const socialLinks = defaultSocialLinks.map(link => ({
        ...link,
        href: settings[link.key] || link.href,
    }));

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.hero}>
                <div className="container">
                    <h1 className={styles.heading}>Twandikire</h1>
                    <p className={styles.subtitle}>
                        Dufashe gukorana, gutumanahira no gushyigikira akazi k&apos;Imana.
                    </p>
                </div>
            </div>

            <div className="container">
                <div className={styles.grid}>
                    {/* Left: form */}
                    <div className={styles.formSide}>
                        <h2 className={styles.sectionTitle}>Tusome ubutumwa bwawe</h2>
                        <ContactForm />
                    </div>

                    {/* Right: info */}
                    <div className={styles.infoSide}>
                        <h2 className={styles.sectionTitle}>Amakuru yo gutunga</h2>
                        <div className={styles.infoCards}>
                            {contactInfo.map(item => (
                                <div key={item.label} className={styles.infoCard}>
                                    <span className={styles.infoIcon}>{item.icon}</span>
                                    <div>
                                        <p className={styles.infoLabel}>{item.label}</p>
                                        <p className={styles.infoValue}>{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.socialBox}>
                            <h3 className={styles.socialTitle}>Dukurikire ku mbuga</h3>
                            <div className={styles.socialLinks}>
                                {socialLinks.map(link => (
                                    <a
                                        key={link.key}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.socialLink}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
