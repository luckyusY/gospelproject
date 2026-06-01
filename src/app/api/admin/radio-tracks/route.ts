import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import type { RadioTrackRow } from "@/types/database";

const MAX_AUDIO_SIZE = 25 * 1024 * 1024;

type CloudinaryTrackPayload = {
    file_url?: string;
    storage_path?: string | null;
    title?: string;
    sort_order?: number | string;
};

function safeFileName(name: string) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

async function requireAuth() {
    return Boolean(await getCurrentAdmin());
}

function signCloudinaryParams(params: Record<string, string>, apiSecret: string) {
    const stringToSign = Object.entries(params)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

    return crypto
        .createHash("sha1")
        .update(stringToSign + apiSecret)
        .digest("hex");
}

export async function GET() {
    if (!await requireAuth()) {
        return NextResponse.json({ error: "Not authorized." }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin()
        .from("radio_tracks")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[Admin radio tracks GET]", error);
        return NextResponse.json({
            tracks: [],
            warning: `Supabase radio_tracks table issue: ${error.message}`,
        });
    }

    return NextResponse.json({ tracks: data as RadioTrackRow[] });
}

export async function POST(req: NextRequest) {
    if (!await requireAuth()) {
        return NextResponse.json({ error: "Not authorized." }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
        const body = await req.json().catch(() => ({})) as CloudinaryTrackPayload;
        const fileUrl = String(body.file_url ?? "").trim();
        const title = String(body.title ?? "").trim();
        const sortOrder = Number(body.sort_order ?? 0);

        if (!fileUrl) {
            return NextResponse.json({ error: "An audio URL is required." }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin()
            .from("radio_tracks")
            .insert({
                title: title || "Radio track",
                file_url: fileUrl,
                storage_path: body.storage_path ?? null,
                sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
                is_active: true,
            })
            .select("*")
            .single();

        if (error) {
            console.error("[Admin radio track insert]", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ track: data as RadioTrackRow }, { status: 201 });
    }

    const form = await req.formData();
    const file = form.get("file");
    const title = String(form.get("title") ?? "").trim();
    const sortOrder = Number(form.get("sort_order") ?? 0);

    if (!(file instanceof File)) {
        return NextResponse.json({ error: "Choose an audio file." }, { status: 400 });
    }

    if (!file.type.startsWith("audio/")) {
        return NextResponse.json({ error: "The file must be audio." }, { status: 400 });
    }

    if (file.size > MAX_AUDIO_SIZE) {
        return NextResponse.json({ error: "Audio must be under 25 MB." }, { status: 400 });
    }

    const admin = supabaseAdmin();
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        return NextResponse.json({ error: "Cloudinary settings are incomplete." }, { status: 500 });
    }

    const timestamp = Math.round(Date.now() / 1000).toString();
    const filename = safeFileName(file.name).replace(/\.[^.]+$/, "") || "radio-track";
    const paramsToSign = {
        folder: "gospel-news/radio",
        public_id: `${Date.now()}-${filename}`,
        timestamp,
    };
    const signature = signCloudinaryParams(paramsToSign, apiSecret);

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("api_key", apiKey);
    uploadForm.append("timestamp", timestamp);
    uploadForm.append("signature", signature);
    uploadForm.append("folder", paramsToSign.folder);
    uploadForm.append("public_id", paramsToSign.public_id);

    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: uploadForm,
    });
    const uploadData = await uploadResponse.json().catch(() => ({})) as {
        secure_url?: string;
        public_id?: string;
        resource_type?: string;
        error?: { message?: string };
    };

    if (!uploadResponse.ok || !uploadData.secure_url) {
        const errorMessage = uploadData.error?.message ?? "Cloudinary upload failed.";
        console.error("[Admin radio track Cloudinary upload]", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    const { data, error } = await admin
        .from("radio_tracks")
        .insert({
            title: title || file.name.replace(/\.[^.]+$/, ""),
            file_url: uploadData.secure_url,
            storage_path: uploadData.public_id ?? null,
            sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
            is_active: true,
        })
        .select("*")
        .single();

    if (error) {
        console.error("[Admin radio track insert]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ track: data as RadioTrackRow }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
    if (!await requireAuth()) {
        return NextResponse.json({ error: "Not authorized." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({})) as {
        id?: number;
        is_active?: boolean;
        sort_order?: number;
        title?: string;
    };

    if (!body.id) {
        return NextResponse.json({ error: "An ID is required." }, { status: 400 });
    }

    const updates: Record<string, string | number | boolean> = {};
    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
    if (typeof body.sort_order === "number") updates.sort_order = body.sort_order;
    if (typeof body.title === "string" && body.title.trim()) updates.title = body.title.trim();

    const { data, error } = await supabaseAdmin()
        .from("radio_tracks")
        .update(updates)
        .eq("id", body.id)
        .select("*")
        .single();

    if (error) {
        console.error("[Admin radio track update]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ track: data as RadioTrackRow });
}

export async function DELETE(req: NextRequest) {
    if (!await requireAuth()) {
        return NextResponse.json({ error: "Not authorized." }, { status: 401 });
    }

    const id = Number(new URL(req.url).searchParams.get("id"));
    if (!id) {
        return NextResponse.json({ error: "An ID is required." }, { status: 400 });
    }

    const admin = supabaseAdmin();
    const { error } = await admin
        .from("radio_tracks")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("[Admin radio track delete]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
