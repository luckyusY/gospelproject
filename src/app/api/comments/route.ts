import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { ArticleCommentRow } from "@/types/database";

type CommentPayload = {
    articleId?: number;
    authorName?: string;
    authorEmail?: string;
    message?: string;
};

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 1200;

function cleanText(value = "", maxLength: number) {
    return value.trim().replace(/[ \t]+/g, " ").slice(0, maxLength);
}

function cleanMessage(value = "") {
    return value.trim().replace(/\n{3,}/g, "\n\n").slice(0, MAX_MESSAGE_LENGTH);
}

function isValidEmail(value: string) {
    if (!value) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function GET(req: NextRequest) {
    const articleId = Number(req.nextUrl.searchParams.get("articleId"));
    if (!Number.isInteger(articleId) || articleId <= 0) {
        return NextResponse.json({ comments: [] });
    }

    const { data, error } = await supabaseAdmin()
        .from("article_comments")
        .select("id, article_id, author_name, message, is_approved, created_at, updated_at")
        .eq("article_id", articleId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(100);

    if (error) {
        console.error("[Article comments GET]", error);
        return NextResponse.json({ comments: [] });
    }

    return NextResponse.json({ comments: data as ArticleCommentRow[] });
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({})) as CommentPayload;
    const articleId = Number(body.articleId);
    const authorName = cleanText(body.authorName, MAX_NAME_LENGTH);
    const authorEmail = cleanText(body.authorEmail, MAX_EMAIL_LENGTH).toLowerCase();
    const message = cleanMessage(body.message);

    if (!Number.isInteger(articleId) || articleId <= 0) {
        return NextResponse.json({ error: "Inkuru ntiyabonetse." }, { status: 400 });
    }

    if (!authorName || !message) {
        return NextResponse.json({ error: "Izina n'igitekerezo birasabwa." }, { status: 400 });
    }

    if (message.length < 3) {
        return NextResponse.json({ error: "Igitekerezo ni kigufi cyane." }, { status: 400 });
    }

    if (!isValidEmail(authorEmail)) {
        return NextResponse.json({ error: "Email ntabwo yanditse neza." }, { status: 400 });
    }

    const admin = supabaseAdmin();
    const { data: article } = await admin
        .from("articles")
        .select("id")
        .eq("id", articleId)
        .eq("is_published", true)
        .maybeSingle();

    if (!article) {
        return NextResponse.json({ error: "Inkuru ntiyabonetse." }, { status: 404 });
    }

    const { data, error } = await admin
        .from("article_comments")
        .insert({
            article_id: articleId,
            author_name: authorName,
            author_email: authorEmail || null,
            message,
            is_approved: false,
        } as never)
        .select("id, article_id, author_name, message, is_approved, created_at, updated_at")
        .single();

    if (error) {
        console.error("[Article comments POST]", error);
        return NextResponse.json({ error: "Igitekerezo nticyabashije kubikwa." }, { status: 500 });
    }

    return NextResponse.json({ comment: data as ArticleCommentRow }, { status: 201 });
}
