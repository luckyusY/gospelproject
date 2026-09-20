/**
 * POST /api/cloudinary/sign
 * Generates a signed upload signature for Cloudinary.
 * The API secret NEVER leaves the server.
 *
 * Body: { paramsToSign: Record<string, string> }   // e.g. { folder, public_id }
 * Response: { signature: string, timestamp: string }
 *
 * The timestamp is generated here, from the server clock, and returned to the
 * caller. It is never taken from the browser: Cloudinary rejects an upload with
 * "Stale request - reported time is ... which is more than 1 hour ago" whenever
 * the signed timestamp drifts more than an hour from its own clock, and a
 * visitor's PC clock can be off by hours or days. The caller must send back the
 * timestamp returned here, unchanged, alongside the signature.
 */
import { NextResponse } from "next/server";
import crypto           from "crypto";

export async function POST(request: Request) {
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiSecret) {
        return NextResponse.json(
            { error: "CLOUDINARY_API_SECRET is not set." },
            { status: 500 },
        );
    }

    let clientParams: Record<string, string> = {};
    try {
        const body = await request.json() as { paramsToSign?: Record<string, string> };
        clientParams = body.paramsToSign ?? {};
    } catch {
        return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    // Drop any client-supplied timestamp and use the server's own.
    const paramsToSign: Record<string, string> = { ...clientParams };
    delete paramsToSign.timestamp;
    const timestamp = Math.round(Date.now() / 1000).toString();
    paramsToSign.timestamp = timestamp;

    // Build the string to sign: sort keys alphabetically, join as key=value&key=value
    const stringToSign = Object.entries(paramsToSign)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join("&");

    // Cloudinary uses SHA-1
    const signature = crypto
        .createHash("sha1")
        .update(stringToSign + apiSecret)
        .digest("hex");

    return NextResponse.json({ signature, timestamp });
}
