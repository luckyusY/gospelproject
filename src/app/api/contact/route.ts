import { NextRequest, NextResponse } from "next/server";

type ContactPayload = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

export async function POST(req: NextRequest) {
    const body = await req.json() as ContactPayload;
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
        return NextResponse.json({ error: "Ibisabwa ntibuzuzwe." }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey) {
        // Dev mode: log and return success so the form works without Resend configured
        console.log("[Contact Form]", { name, email, subject, message });
        return NextResponse.json({ ok: true });
    }

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: `Urugero Media <${process.env.EMAIL_FROM ?? "noreply@urugero.rw"}>`,
            to:   ["info@urugero.rw"],
            reply_to: email,
            subject: `[Urugero Contact] ${subject} — ${name}`,
            text: `Izina: ${name}\nImeyili: ${email}\nInsanganyamatsiko: ${subject}\n\n${message}`,
            html: `
                <h2>Ubutumwa buva kuri Urugero Media Contact Form</h2>
                <p><strong>Izina:</strong> ${name}</p>
                <p><strong>Imeyili:</strong> ${email}</p>
                <p><strong>Insanganyamatsiko:</strong> ${subject}</p>
                <hr/>
                <p>${message.replace(/\n/g, "<br/>")}</p>
            `,
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        console.error("[Resend error]", err);
        return NextResponse.json({ error: "Gukohereza byanze." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
