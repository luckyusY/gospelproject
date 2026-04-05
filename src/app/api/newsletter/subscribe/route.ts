import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    const { email, name } = await req.json() as { email?: string; name?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Imeyili nziza isabwa." }, { status: 400 });
    }

    const admin = supabaseAdmin();

    // Upsert: if already exists, do nothing harmful
    // subscribers table is not in our typed Database, use any cast
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (admin as any)
        .from("subscribers")
        .upsert({ email, name: name ?? null }, { onConflict: "email", ignoreDuplicates: true });

    if (error) {
        console.error("[Newsletter subscribe]", error);
        return NextResponse.json({ error: "Iyandikisho ryanze." }, { status: 500 });
    }

    // Send welcome email if Resend is configured
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
        await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${resendKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: `Urugero Media <${process.env.EMAIL_FROM ?? "noreply@urugero.rw"}>`,
                to: [email],
                subject: "Wakiriye — Urugero Media Newsletter",
                text: `Murakoze ${name ?? ""} kwiyandikisha kuri Urugero Media Newsletter!\n\nTuzakubwira amakuru mashya buri cyumweru.\n\n— Urugero Media Team`,
            }),
        }).catch(console.error);
    }

    return NextResponse.json({ ok: true });
}
