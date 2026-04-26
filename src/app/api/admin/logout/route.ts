import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
    const res = NextResponse.redirect(new URL("/admin/login", req.url));
    res.cookies.set(ADMIN_SESSION_COOKIE, "", { maxAge: 0, path: "/" });
    return res;
}
