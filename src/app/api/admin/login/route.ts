import { NextRequest, NextResponse } from "next/server";
import {
    ADMIN_SESSION_COOKIE,
    ADMIN_SESSION_MAX_AGE,
    createAdminSession,
    verifyAdminCredentials,
} from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
    const form = await req.formData();
    const username = (form.get("username") as string | null)?.trim() || "admin";
    const password = form.get("password") as string | null;
    const admin = password ? verifyAdminCredentials(username, password) : null;

    if (!admin) {
        return NextResponse.redirect(new URL("/admin/login?error=1", req.url));
    }

    const res = NextResponse.redirect(new URL("/admin", req.url));
    res.cookies.set(ADMIN_SESSION_COOKIE, createAdminSession(admin.username), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ADMIN_SESSION_MAX_AGE,
        path: "/",
    });
    return res;
}
