import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const form = await req.formData();
    const password = form.get("password") as string | null;
    const adminPassword = process.env.ADMIN_PASSWORD ?? "urugero_admin_2026";

    if (!password || password !== adminPassword) {
        return NextResponse.redirect(new URL("/admin/login?error=1", req.url));
    }

    const res = NextResponse.redirect(new URL("/admin", req.url));
    res.cookies.set("admin_auth", "1", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
    });
    return res;
}
