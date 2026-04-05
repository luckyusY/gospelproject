import { NextRequest, NextResponse } from "next/server";
import { fetchVerse } from "@/lib/bible";

export async function GET(req: NextRequest) {
    const ref = req.nextUrl.searchParams.get("ref");
    if (!ref || ref.trim().length < 3) {
        return NextResponse.json({ error: "Verse reference required." }, { status: 400 });
    }

    const verse = await fetchVerse(ref.trim());
    if (!verse) {
        return NextResponse.json({ error: "Verse not found. Check the reference." }, { status: 404 });
    }

    return NextResponse.json(verse);
}
