"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

export type RadioPlaybackStatus = "idle" | "loading" | "playing" | "paused" | "error";

type RadioSnapshot = {
    status: RadioPlaybackStatus;
    streamUrl: string;
};

const listeners = new Set<() => void>();
let audio: HTMLAudioElement | null = null;
let snapshot: RadioSnapshot = {
    status: "idle",
    streamUrl: "",
};

function emit() {
    listeners.forEach(listener => listener());
}

function setSnapshot(next: Partial<RadioSnapshot>) {
    snapshot = { ...snapshot, ...next };
    emit();
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
    audio.addEventListener("error", () => setSnapshot({ status: "error" }));

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
        const nextUrl = streamUrl.trim();
        if (!nextUrl) return;

        const player = getAudio();
        if (!player || snapshot.streamUrl === nextUrl) return;

        const wasPlaying = !player.paused;
        player.src = nextUrl;
        setSnapshot({ streamUrl: nextUrl, status: wasPlaying ? "loading" : "idle" });

        if (wasPlaying) {
            void player.play().catch(() => setSnapshot({ status: "error" }));
        }
    }, [streamUrl]);

    const toggle = useCallback(async () => {
        const nextUrl = streamUrl.trim() || snapshot.streamUrl;
        const player = getAudio();
        if (!player || !nextUrl) return;

        if (player.src !== nextUrl) {
            player.src = nextUrl;
            setSnapshot({ streamUrl: nextUrl });
        }

        if (!player.paused) {
            player.pause();
            setSnapshot({ status: "paused" });
            return;
        }

        try {
            setSnapshot({ status: "loading" });
            await player.play();
            setSnapshot({ status: "playing" });
        } catch {
            setSnapshot({ status: "error" });
        }
    }, [streamUrl]);

    return {
        ...state,
        isPlaying: state.status === "playing" || state.status === "loading",
        toggle,
    };
}
