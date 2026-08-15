import { NextRequest, NextResponse } from "next/server";
import {
    getAdminAccounts,
    getCurrentAdmin,
    hashAdminPassword,
    isFullAdmin,
} from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { AdminRole } from "@/lib/adminAuth";

const USERNAME_PATTERN = /^[a-z0-9._-]{3,40}$/;

function forbidden() {
    return NextResponse.json({ error: "Only an administrator can create user accounts." }, { status: 403 });
}

export async function POST(req: NextRequest) {
    const currentAdmin = await getCurrentAdmin();
    if (!isFullAdmin(currentAdmin)) return forbidden();

    const raw = await req.json() as {
        username?: unknown;
        displayName?: unknown;
        password?: unknown;
        role?: unknown;
    };
    const username = typeof raw.username === "string" ? raw.username.trim().toLowerCase() : "";
    const displayName = typeof raw.displayName === "string" ? raw.displayName.trim() : "";
    const password = typeof raw.password === "string" ? raw.password : "";
    const role: AdminRole = raw.role === "admin" ? "admin" : "journalist";

    if (!USERNAME_PATTERN.test(username)) {
        return NextResponse.json(
            { error: "Username must be 3-40 characters using letters, numbers, dots, dashes, or underscores." },
            { status: 400 },
        );
    }
    if (displayName.length < 2 || displayName.length > 80) {
        return NextResponse.json({ error: "Enter a display name between 2 and 80 characters." }, { status: 400 });
    }
    if (password.length < 10) {
        return NextResponse.json({ error: "Password must contain at least 10 characters." }, { status: 400 });
    }
    if (getAdminAccounts().some(account => account.username.toLowerCase() === username)) {
        return NextResponse.json({ error: "That username is already used by a configured account." }, { status: 409 });
    }

    const { data, error } = await supabaseAdmin()
        .from("admin_users")
        .insert({
            username,
            display_name: displayName,
            password_hash: hashAdminPassword(password),
            role,
            is_active: true,
            created_by: currentAdmin!.username,
        } as never)
        .select("id, username, display_name, role, is_active, created_at")
        .single();

    if (error) {
        if (error.code === "23505") {
            return NextResponse.json({ error: "That username already exists." }, { status: 409 });
        }
        if (error.code === "42P01" || error.message.includes("admin_users")) {
            return NextResponse.json(
                { error: "User accounts table is not set up yet. Run supabase/admin_users.sql first." },
                { status: 503 },
            );
        }
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
}
