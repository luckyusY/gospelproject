import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/metadata";
import styles from "../legal.module.css";

export const metadata: Metadata = buildMeta({
  title: "Analytics",
  description: "How Urugero Media measures website visits and improves gospel content for readers.",
  path: "/analytics",
});

export default function AnalyticsPage() {
  return (
    <div className={styles.page}>
      <main className={`container ${styles.shell}`}>
        <p className={styles.eyebrow}>Urugero Media</p>
        <h1 className={styles.title}>Analytics</h1>
        <p className={styles.intro}>
          This page explains how Urugero Media measures website visits so the team can
          understand which gospel news, testimonies, teachings, events, and radio pages
          are helping readers most.
        </p>

        <section className={styles.section}>
          <h2>What is measured</h2>
          <ul>
            <li>Pages visited, such as Amakuru, Ubuhamya, Inyigisho, and events.</li>
            <li>General traffic sources, including search engines and social media links.</li>
            <li>Approximate location, device type, browser, and visit time.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Why it matters</h2>
          <p>
            Analytics helps the editorial team improve search visibility, publish more
            useful stories, and understand which topics readers are looking for.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Privacy</h2>
          <p>
            Urugero Media uses analytics for aggregate website insights. For details
            about data collection and your choices, read the{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </section>
      </main>
    </div>
  );
}
