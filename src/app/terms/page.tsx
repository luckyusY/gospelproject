import type { Metadata } from "next";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Terms | Urugero Media",
  description: "Amategeko ngenderwaho yo gukoresha urubuga rwa Urugero Media.",
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <main className={`container ${styles.shell}`}>
        <p className={styles.eyebrow}>Urugero Media</p>
        <h1 className={styles.title}>Amategeko yo Gukoresha Urubuga</h1>
        <p className={styles.intro}>
          Iyo ukoresheje uru rubuga, wemera gukoresha ibirimo mu buryo bwubaka,
          bwubahiriza abandi, kandi budahungabanya imikorere ya Urugero Media.
        </p>

        <section className={styles.section}>
          <h2>Ibirimo</h2>
          <p>
            Amakuru, inyigisho, amashusho n&apos;ibindi biri ku rubuga bigenewe kumenyesha,
            kwigisha no kubaka abakunzi ba gospel. Ntibyemerewe gukopororwa cyangwa
            gukoreshwa mu bucuruzi utabanje kubona uburenganzira.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Imyitwarire y&apos;abakoresha urubuga</h2>
          <ul>
            <li>Ntukohereze ubutumwa bubiba urwango, ibinyoma cyangwa ihohotera.</li>
            <li>Ntugerageze kwinjira mu bice by&apos;admin utabifitiye uburenganzira.</li>
            <li>Koresha contact form ku butumwa bufite intego isobanutse.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Impinduka</h2>
          <p>
            Urugero Media ishobora kuvugurura aya mategeko igihe bibaye ngombwa.
            Impinduka zitangira gukurikizwa igihe zishyizwe kuri uru rupapuro.
          </p>
        </section>

        <p className={styles.updated}>Last updated: April 23, 2026</p>
      </main>
    </div>
  );
}
