import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import type { VideoRow } from "@/types/database";
import VideoManager from "./_components/VideoManager";

export const metadata: Metadata = { title: "Videos" };

export default async function AdminVideosPage() {
    const { data } = await supabaseAdmin()
        .from("videos")
        .select("*")
        .order("section", { ascending: true })
        .order("sort_order", { ascending: true });

    const videos = (data ?? []) as VideoRow[];
    return <VideoManager videos={videos} />;
}
