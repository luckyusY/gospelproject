"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

export type RadioPlaybackStatus = "idle" | "loading" | "playing" | "paused" | "error";
export type RadioPlaybackSource = "live" | "fallback";

type RadioTrack = {
    id: number;
    title: string;
    file_url: string;
};

type RadioSnapshot = {
    status: RadioPlaybackStatus;
    streamUrl: string;
    source: RadioPlaybackSource;
    fallbackTitle: string;
    fallbackAvailable: boolean;
};

const listeners = new Set<() => void>();
let audio: HTMLAudioElement | null = null;
let fallbackTracks: RadioTrack[] = [];
let fallbackIndex = 0;
let fallbackLoaded = false;
let wantsPlayback = false;
let snapshot: RadioSnapshot = {
    status: "idle",
    streamUrl: "",
    source: "live",
    fallbackTitle: "",
    fallbackAvailable: false,
};

function emit() {
    listeners.forEach(listener => listener());
}

function setSnapshot(next: Partial<RadioSnapshot>) {
    snapshot = { ...snapshot, ...next };
    emit();
}

async function loadFallbackTracks() {
    if (fallbackLoaded) return fallbackTracks;
    fallbackLoaded = true;

    try {
        const response = await fetch("/api/radio/tracks", { cache: "no-store" });
        const data = await response.json() as { tracks?: RadioTrack[] };
        fallbackTracks = (data.tracks ?? []).filter(track => Boolean(track.file_url));
        setSnapshot({ fallbackAvailable: fallbackTracks.length > 0 });
    } catch {
        fallbackTracks = [];
        setSnapshot({ fallbackAvailable: false });
    }

    return fallbackTracks;
}

async function playFallbackTrack(index = fallbackIndex) {
    const player = getAudio();
    const tracks = await loadFallbackTracks();
    if (!player || tracks.length === 0) {
        setSnapshot({ status: "error", fallbackAvailable: false });
        return false;
    }

    fallbackIndex = ((index % tracks.length) + tracks.length) % tracks.length;
    const track = tracks[fallbackIndex];
    if (!track) {
        setSnapshot({ status: "error" });
        return false;
    }

    player.src = track.file_url;
    player.loop = tracks.length === 1;
    setSnapshot({
        status: "loading",
        streamUrl: track.file_url,
        source: "fallback",
        fallbackTitle: track.title,
        fallbackAvailable: true,
    });

    try {
        await player.play();
        setSnapshot({ status: "playing" });
        return true;
    } catch {
        setSnapshot({ status: "error" });
        return false;
    }
}

function getAudio() {
    if (typeof window === "undefined") return null;
    if (audio) return audio;

    audio = new Audio();
    audio.preload = "none";
    audio.addEventListener("playing", () => setSnapshot({ status: "playing" }));
    audio.addEventListener("pause", () => setSnapshot({ status: "paused" }));
    audio.addEventListener("waiting", () => setSnapshot({ status: "loading" }));
    audio.addEventListener("stalled", () => setSnapshot({ status: "loading" }));
    audio.addEventListener("ended", () => {
        if (snapshot.source === "fallback" && wantsPlayback && fallbackTracks.length > 1) {
            void playFallbackTrack(fallbackIndex + 1);
        }
    });
    audio.addEventListener("error", () => {
        if (snapshot.source === "live" && wantsPlayback) {
            void playFallbackTrack();
            return;
        }
        setSnapshot({ status: "error" });
    });

    return audio;
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot() {
    return snapshot;
}

export function useSharedRadio(streamUrl: string) {
    const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    useEffect(() => {
        void loadFallbackTracks();
    }, []);

    useEffect(() => {
        const nextUrl = streamUrl.trim();
        if (!nextUrl) return;

        const player = getAudio();
        if (!player || snapshot.streamUrl === nextUrl) return;
        if (snapshot.source === "fallback" && !player.paused) return;

        const wasPlaying = !player.paused && snapshot.source === "live";
        player.src = nextUrl;
        player.loop = false;
        setSnapshot({
            streamUrl: nextUrl,
            status: wasPlaying ? "loading" : "idle",
            source: "live",
            fallbackTitle: "",
        });

        if (wasPlaying) {
            void player.play().catch(() => {
                if (wantsPlayback) void playFallbackTrack();
                else setSnapshot({ status: "error" });
            });
        }
    }, [streamUrl]);

    const toggle = useCallback(async () => {
        const nextUrl = streamUrl.trim() || snapshot.streamUrl;
        const player = getAudio();
        if (!player || !nextUrl) return;

        if (!player.paused) {
            wantsPlayback = false;
            player.pause();
            setSnapshot({ status: "paused" });
            return;
        }

        if (player.src !== nextUrl) {
            player.src = nextUrl;
            player.loop = false;
            setSnapshot({ streamUrl: nextUrl, source: "live", fallbackTitle: "" });
        }

        try {
            wantsPlayback = true;
            setSnapshot({ status: "loading" });
            await player.play();
            setSnapshot({ status: "playing" });
        } catch {
            await playFallbackTrack();
        }
    }, [streamUrl]);

    return {
        ...state,
        isPlaying: state.status === "playing" || state.status === "loading",
        isFallback: state.source === "fallback",
        toggle,
    };
}
