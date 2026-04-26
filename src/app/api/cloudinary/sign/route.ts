/**
 * POST /api/cloudinary/sign
 * Generates a signed upload signature for Cloudinary.
 * The API secret NEVER leaves the server.
 *
 * Body: { paramsToSign: Record<string, string> }
 * Response: { signature: string }
 */
import { NextResponse } from "next/server";
import crypto           from "crypto";

export async function POST(request: Request) {
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiSecret) {
        return NextResponse.json(
            { error: "CLOUDINARY_API_SECRET ntiyashyizweho." },
            { status: 500 },
        );
    }

    let paramsToSign: Record<string, string> = {};
    try {
        const body = await request.json() as { paramsToSign?: Record<string, string> };
        paramsToSign = body.paramsToSign ?? {};
    } catch {
        return NextResponse.json({ error: "Body mbi." }, { status: 400 });
    }

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

    return NextResponse.json({ signature });
}
