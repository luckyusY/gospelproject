import { NextResponse } from "next/server";
import { sendMail, smtpConfigured } from "@/lib/mailer";

export const runtime = "nodejs";

// TEMPORARY diagnostic endpoint — remove after debugging email delivery.
export async function GET() {
    const info = {
        smtpConfigured: smtpConfigured(),
        smtpHostSet: Boolean(process.env.SMTP_HOST),
        smtpPort: process.env.SMTP_PORT ?? null,
        smtpUserSet: Boolean(process.env.SMTP_USER),
        smtpFrom: process.env.SMTP_FROM ?? null,
        emailFrom: process.env.EMAIL_FROM ?? null,
        resendKeySet: Boolean(process.env.RESEND_API_KEY),
    };

    try {
        const channel = await sendMail({
            to: "nkundimanarugirayahaya@gmail.com",
            subject: "Urugero mail debug test",
            text: "If you received this, email delivery works.",
        });
        return NextResponse.json({ ok: true, channel, info });
    } catch (e) {
        const err = e as Error & { code?: string; command?: string };
        return NextResponse.json(
            { ok: false, info, error: err?.message ?? String(e), code: err?.code ?? null, command: err?.command ?? null },
            { status: 500 },
        );
    }
}
