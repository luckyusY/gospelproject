import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { rootMetadata } from "@/lib/metadata";
import { DEFAULT_RADIO_STREAM_URL, getPublicSiteSettings, settingLines } from "@/lib/siteSettings";
import { getNavTree } from "@/lib/nav";

export const metadata: Metadata = rootMetadata;

// Without this, mobile browsers fall back to a 980px desktop layout
// (content looks zoomed-out / overflowing). This makes the site responsive.
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#B80000",
};

export const revalidate = 60;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSiteSettings();
  const radioStreamUrl = settings.radio_stream_url ?? DEFAULT_RADIO_STREAM_URL;
  const radioStationName = settings.radio_station_name ?? "Urugero Online Radio";
  const nav = await getNavTree();
  const tickerLines = settingLines(settings.ticker_lines);

  return (
    <html lang="rw">
      <body>
        <a href="#main-content" className="skip-to-content">
          Jya ku birimo nyamukuru
        </a>
        <SmoothScrollProvider>
          <Header
            radioStreamUrl={radioStreamUrl}
            radioStationName={radioStationName}
            nav={nav}
            tickerLines={tickerLines}
          />
          <main id="main-content">{children}</main>
          <Footer settings={settings} />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
