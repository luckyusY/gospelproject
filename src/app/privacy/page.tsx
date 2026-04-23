import type { Metadata } from "next";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Urugero Media",
  description: "Uko Urugero Media ifata, ikoresha kandi ikarinda amakuru y'abasura urubuga.",
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <main className={`container ${styles.shell}`}>
        <p className={styles.eyebrow}>Urugero Media</p>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.intro}>
          Iyi politiki isobanura uko Urugero Media ikusanya kandi ikoresha amakuru
          utanga iyo wanditse kuri newsletter, ukoresheje contact form, cyangwa usuye urubuga.
        </p>

        <section className={styles.section}>
          <h2>Amakuru dushobora kwakira</h2>
          <ul>
            <li>Izina, email, ubutumwa n&apos;ibindi wohereza ukoresheje contact form.</li>
            <li>Email ukoresha wiyandikisha ku makuru cyangwa inyigisho za buri cyumweru.</li>
            <li>Amakuru rusange y&apos;imikorere y&apos;urubuga, nk&apos;ipaji yasuwe n&apos;igihe yasuwe.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Uko tuyakoresha</h2>
          <p>
            Dukoresha ayo makuru kugira ngo dusubize ubutumwa, twohereze amakuru wiyandikishijeho,
            tunoze serivisi zacu, kandi turinde umutekano w&apos;urubuga.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Uburenganzira bwawe</h2>
          <p>
            Ushobora kudusaba gukosora, gusiba, cyangwa guhagarika gukoresha email yawe mu butumwa
            bwa newsletter. Twandikire ukoresheje ipaji ya contact.
          </p>
        </section>

        <p className={styles.updated}>Last updated: April 23, 2026</p>
      </main>
    </div>
  );
}
