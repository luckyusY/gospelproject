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

type ScheduledFallbackTrack = {
    index: number;
    offset: number;
    track: RadioTrack;
};

const FALLBACK_CLOCK_EPOCH = Date.UTC(2026, 0, 1, 0, 0, 0);
const DEFAULT_TRACK_DURATION = 180;
const listeners = new Set<() => void>();
let audio: HTMLAudioElement | null = null;
let fallbackTracks: RadioTrack[] = [];
const fallbackDurations = new Map<number, number>();
let fallbackSchedulePromise: Promise<void> | null = null;
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

async function loadAudioDuration(url: string) {
    return new Promise<number | null>((resolve) => {
        const metadataAudio = new Audio();
        const cleanup = () => {
            metadataAudio.removeAttribute("src");
            metadataAudio.load();
        };
        const finish = (duration: number | null) => {
            window.clearTimeout(timeout);
            cleanup();
            resolve(duration);
        };
        const timeout = window.setTimeout(() => finish(null), 8000);

        metadataAudio.preload = "metadata";
        metadataAudio.addEventListener("loadedmetadata", () => {
            const duration = metadataAudio.duration;
            finish(Number.isFinite(duration) && duration > 0 ? duration : null);
        }, { once: true });
        metadataAudio.addEventListener("error", () => finish(null), { once: true });
        metadataAudio.src = url;
    });
}

async function ensureFallbackSchedule() {
    const tracks = await loadFallbackTracks();
    if (fallbackSchedulePromise) {
        await fallbackSchedulePromise;
        return tracks;
    }

    fallbackSchedulePromise = Promise.all(tracks.map(async (track) => {
        if (fallbackDurations.has(track.id)) return;
        const duration = await loadAudioDuration(track.file_url);
        if (duration) fallbackDurations.set(track.id, duration);
    })).then(() => undefined);

    await fallbackSchedulePromise;
    return tracks;
}

function getFallbackDuration(track: RadioTrack) {
    return fallbackDurations.get(track.id) ?? DEFAULT_TRACK_DURATION;
}

function getScheduledFallbackTrack(tracks: RadioTrack[]): ScheduledFallbackTrack | null {
    if (tracks.length === 0) return null;

    const durations = tracks.map(getFallbackDuration);
    const totalDuration = durations.reduce((total, duration) => total + duration, 0);
    if (!Number.isFinite(totalDuration) || totalDuration <= 0) {
        const track = tracks[fallbackIndex] ?? tracks[0];
        if (!track) return null;
        return { index: fallbackIndex, offset: 0, track };
    }

    let elapsed = ((Date.now() - FALLBACK_CLOCK_EPOCH) / 1000) % totalDuration;
    if (elapsed < 0) elapsed += totalDuration;

    for (let index = 0; index < tracks.length; index += 1) {
        const duration = durations[index] ?? DEFAULT_TRACK_DURATION;
        const track = tracks[index];
        if (track && elapsed < duration) {
            return {
                index,
                offset: fallbackDurations.has(track.id) ? Math.max(0, Math.min(elapsed, duration - 0.25)) : 0,
                track,
            };
        }
        elapsed -= duration;
    }

    const track = tracks[0];
    return track ? { index: 0, offset: 0, track } : null;
}

async function seekWhenReady(player: HTMLAudioElement, offset: number) {
    if (offset <= 0) {
        player.currentTime = 0;
        return;
    }

    if (player.readyState >= HTMLMediaElement.HAVE_METADATA) {
        player.currentTime = offset;
        return;
    }

    await new Promise<void>((resolve) => {
        const finish = () => {
            window.clearTimeout(timeout);
            resolve();
        };
        const timeout = window.setTimeout(finish, 3000);
        player.addEventListener("loadedmetadata", finish, { once: true });
    });
    player.currentTime = offset;
}

async function playFallbackTrack(index?: number) {
    const player = getAudio();
    const tracks = await ensureFallbackSchedule();
    if (!player || tracks.length === 0) {
        setSnapshot({ status: "error", fallbackAvailable: false });
        return false;
    }

    let scheduled: ScheduledFallbackTrack | null = null;
    if (typeof index === "number") {
        const normalizedIndex = ((index % tracks.length) + tracks.length) % tracks.length;
        const indexedTrack = tracks[normalizedIndex];
        if (indexedTrack) {
            scheduled = { index: normalizedIndex, offset: 0, track: indexedTrack };
        }
    } else {
        scheduled = getScheduledFallbackTrack(tracks);
    }

    if (!scheduled?.track) {
        setSnapshot({ status: "error" });
        return false;
    }

    fallbackIndex = scheduled.index;
    const track = scheduled.track;
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
        await seekWhenReady(player, scheduled.offset);
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
            void playFallbackTrack();
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
        if (snapshot.source === "fallback" && snapshot.streamUrl) return;

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
        if (!player) return;

        if (!player.paused) {
            wantsPlayback = false;
            player.pause();
            setSnapshot({ status: "paused" });
            return;
        }

        if (snapshot.source === "fallback") {
            wantsPlayback = true;
            setSnapshot({ status: "loading" });
            await playFallbackTrack();
            return;
        }

        if (snapshot.streamUrl && player.src) {
            try {
                wantsPlayback = true;
                setSnapshot({ status: "loading" });
                await player.play();
                setSnapshot({ status: "playing" });
                return;
            } catch {
                if (snapshot.source === "live") {
                    await playFallbackTrack();
                } else {
                    setSnapshot({ status: "error" });
                }
                return;
            }
        }

        if (!nextUrl) return;

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
