import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { RadioCommentRow } from "@/types/database";

type RadioCommentPayload = {
    listenerName?: string;
    message?: string;
};

const MAX_NAME_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 280;

function cleanText(value = "", maxLength: number) {
    return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export async function GET() {
    const admin = supabaseAdmin();

    const { data, error } = await admin
        .from("radio_comments")
        .select("id, listener_name, message, created_at")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(25);

    if (error) {
        console.error("[Radio comments GET]", error);
        return NextResponse.json({ comments: [] });
    }

    return NextResponse.json({ comments: data as RadioCommentRow[] });
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({})) as RadioCommentPayload;
    const listenerName = cleanText(body.listenerName, MAX_NAME_LENGTH);
    const message = cleanText(body.message, MAX_MESSAGE_LENGTH);

    if (!listenerName || !message) {
        return NextResponse.json({ error: "Izina n'igitekerezo birasabwa." }, { status: 400 });
    }

    if (message.length < 3) {
        return NextResponse.json({ error: "Igitekerezo ni kigufi cyane." }, { status: 400 });
    }

    const admin = supabaseAdmin();
    const { data, error } = await admin
        .from("radio_comments")
        .insert({
            listener_name: listenerName,
            message,
            is_approved: true,
        })
        .select("id, listener_name, message, created_at")
        .single();

    if (error) {
        console.error("[Radio comments POST]", error);
        return NextResponse.json({ error: "Igitekerezo nticyabashije kubikwa." }, { status: 500 });
    }

    return NextResponse.json({ comment: data as RadioCommentRow }, { status: 201 });
}
