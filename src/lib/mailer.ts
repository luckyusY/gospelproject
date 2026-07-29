import nodemailer from "nodemailer";

export type MailMessage = {
    to: string | string[];
    subject: string;
    text: string;
    html?: string;
    replyTo?: string;
};

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 465);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM ?? process.env.EMAIL_FROM ?? SMTP_USER;
const FROM_NAME = process.env.SMTP_FROM_NAME ?? "Urugero Media";

export function smtpConfigured() {
    return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

let cachedTransport: nodemailer.Transporter | null = null;

function transport() {
    if (cachedTransport) return cachedTransport;
    cachedTransport = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465, // implicit TLS on 465, STARTTLS otherwise
        auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    return cachedTransport;
}

/**
 * Send an email through the cPanel SMTP server when configured, otherwise fall
 * back to the Resend HTTP API. Returns the channel used, or null if no email
 * provider is configured (so callers can degrade gracefully).
 */
export async function sendMail(msg: MailMessage): Promise<"smtp" | "resend" | null> {
    if (smtpConfigured()) {
        await transport().sendMail({
            from: `${FROM_NAME} <${SMTP_FROM}>`,
            to: msg.to,
            subject: msg.subject,
            text: msg.text,
            html: msg.html,
            replyTo: msg.replyTo ?? SMTP_FROM,
        });
        return "smtp";
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${resendKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: `${FROM_NAME} <${SMTP_FROM ?? "noreply@urugerogospelnews.com"}>`,
                to: Array.isArray(msg.to) ? msg.to : [msg.to],
                subject: msg.subject,
                text: msg.text,
                html: msg.html,
                reply_to: msg.replyTo,
            }),
        });
        if (!res.ok) throw new Error(`Resend failed: ${res.status}`);
        return "resend";
    }

    return null;
}

export function verifySmtp() {
    if (!smtpConfigured()) return Promise.reject(new Error("SMTP not configured"));
    return transport().verify();
}
