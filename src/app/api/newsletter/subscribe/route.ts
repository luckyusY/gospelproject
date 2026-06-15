import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendMail } from "@/lib/mailer";

export const runtime = "nodejs"; // SMTP needs the Node runtime, not the edge

const ADMIN_NOTIFY = process.env.NEWSLETTER_NOTIFY_EMAIL ?? "info@urugerogospelnews.com";

export async function POST(req: NextRequest) {
    const { email, name } = await req.json() as { email?: string; name?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Imeyili nziza isabwa." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name?.trim() || null;
    const admin = supabaseAdmin();

    // Upsert: if already subscribed, do nothing harmful.
    // subscribers table is not in our typed Database, use any cast.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (admin as any)
        .from("subscribers")
        .upsert({ email: cleanEmail, name: cleanName }, { onConflict: "email", ignoreDuplicates: true });

    if (error) {
        console.error("[Newsletter subscribe]", error);
        return NextResponse.json({ error: "Iyandikisho ryanze." }, { status: 500 });
    }

    // Welcome email to the subscriber + a heads-up to the team. Email failures
    // must not fail the subscription itself.
    try {
        await sendMail({
            to: cleanEmail,
            subject: "Murakaza neza kuri Urugero Media",
            text: `Murakoze${cleanName ? ` ${cleanName}` : ""} kwiyandikisha kuri Urugero Media!\n\n`
                + `Muzajya mwakira amakuru mashya, inyigisho, ubuhamya n'ibitaramo.\n\n`
                + `Imana ibahe umugisha.\n— Urugero Media`,
            html: `<p>Murakoze${cleanName ? ` <strong>${escapeHtml(cleanName)}</strong>` : ""} kwiyandikisha kuri <strong>Urugero Media</strong>!</p>`
                + `<p>Muzajya mwakira amakuru mashya, inyigisho, ubuhamya n'ibitaramo.</p>`
                + `<p>Imana ibahe umugisha.<br/>— Urugero Media</p>`,
        });
    } catch (mailError) {
        console.error("[Newsletter welcome email]", mailError);
    }

    try {
        await sendMail({
            to: ADMIN_NOTIFY,
            subject: "Umuntu mushya yiyandikishije ku makuru",
            text: `Imeyili: ${cleanEmail}${cleanName ? `\nIzina: ${cleanName}` : ""}`,
            replyTo: cleanEmail,
        });
    } catch (mailError) {
        console.error("[Newsletter admin notify]", mailError);
    }

    return NextResponse.json({ ok: true });
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
