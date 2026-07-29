"use client";

import Script from "next/script";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __googleAnalyticsInitialized?: boolean;
    __lastGoogleAnalyticsPagePath?: string;
    __lastFirstPartyAnalyticsPagePath?: string;
  }
}

type AnalyticsProps = {
  measurementId?: string;
};

const FIRST_PARTY_STORAGE_KEY = "urugero_visitor_id";
const FIRST_PARTY_SESSION_KEY = "urugero_session_id";

function getBrowserId(key: string) {
  const existing = window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
  if (existing) {
    return existing;
  }

  const value = crypto.randomUUID();
  if (key === FIRST_PARTY_SESSION_KEY) {
    window.sessionStorage.setItem(key, value);
  } else {
    window.localStorage.setItem(key, value);
  }
  return value;
}

function trackFirstPartyPageView(pagePath: string) {
  if (window.__lastFirstPartyAnalyticsPagePath === pagePath) {
    return;
  }
  window.__lastFirstPartyAnalyticsPagePath = pagePath;

  const payload = JSON.stringify({
    path: pagePath,
    title: document.title,
    referrer: document.referrer,
    visitorId: getBrowserId(FIRST_PARTY_STORAGE_KEY),
    sessionId: getBrowserId(FIRST_PARTY_SESSION_KEY),
  });

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(
      "/api/analytics/track",
      new Blob([payload], { type: "application/json" }),
    );
    if (sent) return;
  }

  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}

function RouteChangeTracker({ measurementId }: Required<AnalyticsProps>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = window.gtag ?? function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

    if (!window.__googleAnalyticsInitialized) {
      window.gtag("js", new Date());
      window.__googleAnalyticsInitialized = true;
    }

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    trackFirstPartyPageView(pagePath);

    if (window.__lastGoogleAnalyticsPagePath === pagePath) {
      return;
    }

    window.__lastGoogleAnalyticsPagePath = pagePath;

    window.gtag("config", measurementId, {
      page_path: pagePath,
    });
  }, [measurementId, pathname, searchParams]);

  return null;
}

export default function Analytics({ measurementId }: AnalyticsProps) {
  return (
    <>
      {measurementId && (
        <>
          <script
            id="google-analytics-init"
            dangerouslySetInnerHTML={{
              __html: `
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);}
          window.gtag('js', new Date());
          window.gtag('config', '${measurementId}');
          window.__googleAnalyticsInitialized = true;
          window.__lastGoogleAnalyticsPagePath = window.location.pathname + window.location.search;
        `,
            }}
          />
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
        </>
      )}
      <Suspense fallback={null}>
        {measurementId ? (
          <RouteChangeTracker measurementId={measurementId} />
        ) : (
          <FirstPartyRouteChangeTracker />
        )}
      </Suspense>
    </>
  );
}

function FirstPartyRouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    trackFirstPartyPageView(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
}
