import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { rootMetadata } from "@/lib/metadata";
import { DEFAULT_RADIO_STREAM_URL, getPublicSiteSettings } from "@/lib/siteSettings";

export const metadata: Metadata = rootMetadata;
export const revalidate = 60;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSiteSettings();
  const radioStreamUrl = settings.radio_stream_url ?? DEFAULT_RADIO_STREAM_URL;
  const radioStationName = settings.radio_station_name ?? "Urugero Online Radio";

  return (
    <html lang="rw">
      <body>
        <a href="#main-content" className="skip-to-content">
          Jya ku birimo nyamukuru
        </a>
        <SmoothScrollProvider>
          <Header radioStreamUrl={radioStreamUrl} radioStationName={radioStationName} />
          <main id="main-content">{children}</main>
          <Footer settings={settings} />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
