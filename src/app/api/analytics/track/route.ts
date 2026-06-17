import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

type TrackPayload = {
    path?: string;
    title?: string;
    referrer?: string;
    visitorId?: string;
    sessionId?: string;
};

type AnalyticsVisit = {
    path: string;
    title: string | null;
    referrer: string | null;
    visitor_id: string | null;
    session_id: string | null;
    country: string | null;
    user_agent: string | null;
    ip_hash: string | null;
    created_at: string;
};

const IGNORED_PATH_PREFIXES = ["/admin", "/api", "/_next", "/favicon.ico", "/icon.png", "/apple-icon.png"];
const FALLBACK_SETTING_KEY = "analytics_recent_views";

function cleanText(value: unknown, maxLength: number) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : null;
}

function getClientIp(req: NextRequest) {
    const forwardedFor = req.headers.get("x-forwarded-for");
    return req.headers.get("cf-connecting-ip")
        ?? forwardedFor?.split(",")[0]?.trim()
        ?? req.headers.get("x-real-ip")
        ?? "";
}

function hashIp(ip: string) {
    if (!ip) return null;
    const salt = process.env.ANALYTICS_IP_SALT
        ?? process.env.NEXTAUTH_SECRET
        ?? process.env.ADMIN_PASSWORD
        ?? "urugero-media";

    return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({})) as TrackPayload;
    const path = cleanText(body.path, 500);

    if (!path || !path.startsWith("/") || IGNORED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))) {
        return NextResponse.json({ ok: true, skipped: true });
    }

    const admin = supabaseAdmin();
    const visit = {
        path,
        title: cleanText(body.title, 250),
        referrer: cleanText(body.referrer, 500),
        visitor_id: cleanText(body.visitorId, 100),
        session_id: cleanText(body.sessionId, 100),
        country: cleanText(req.headers.get("cf-ipcountry"), 8),
        user_agent: cleanText(req.headers.get("user-agent"), 500),
        ip_hash: hashIp(getClientIp(req)),
        created_at: new Date().toISOString(),
    } satisfies AnalyticsVisit;

    const { error } = await admin
        .from("analytics_page_views")
        .insert(visit);

    if (error) {
        const stored = await storeFallbackVisit(visit);
        if (!stored) {
            console.error("[Analytics track]", error);
        }
        return NextResponse.json({ ok: true, fallback: stored }, { status: 202 });
    }

    return NextResponse.json({ ok: true });
}

async function storeFallbackVisit(visit: AnalyticsVisit) {
    const admin = supabaseAdmin();
    const { data } = await admin
        .from("site_settings")
        .select("value")
        .eq("key", FALLBACK_SETTING_KEY)
        .maybeSingle();

    const existing = parseFallbackVisits(typeof data?.value === "string" ? data.value : "[]");
    const next = [visit, ...existing]
        .filter((item, index, list) => {
            const key = `${item.path}:${item.session_id}:${item.created_at.slice(0, 16)}`;
            return list.findIndex(candidate => `${candidate.path}:${candidate.session_id}:${candidate.created_at.slice(0, 16)}` === key) === index;
        })
        .slice(0, 100);

    const { error } = await admin
        .from("site_settings")
        .upsert({
            key: FALLBACK_SETTING_KEY,
            value: JSON.stringify(next),
            label: "Recent analytics page views",
            description: "Fallback first-party analytics storage used before analytics_page_views is created.",
        }, { onConflict: "key" });

    return !error;
}

function parseFallbackVisits(value: string) {
    try {
        const parsed = JSON.parse(value) as unknown;
        return Array.isArray(parsed)
            ? parsed.filter((item): item is AnalyticsVisit => (
                typeof item === "object"
                && item !== null
                && "path" in item
                && typeof item.path === "string"
                && "created_at" in item
                && typeof item.created_at === "string"
            ))
            : [];
    } catch {
        return [];
    }
}
