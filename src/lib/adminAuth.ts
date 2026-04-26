import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "admin_auth";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24;

const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "urugero_admin_2026";

type AdminAccount = {
    username: string;
    password: string;
};

export type CurrentAdmin = {
    username: string;
};

function addAccount(accounts: Map<string, AdminAccount>, username: string, password: string) {
    const cleanUsername = username.trim();
    if (!cleanUsername || !password) return;
    accounts.set(cleanUsername.toLowerCase(), {
        username: cleanUsername,
        password,
    });
}

function parseAdminUsers(value: string | undefined) {
    if (!value) return [];

    return value
        .split(/[\n,;]/)
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
            const separatorIndex = entry.includes(":")
                ? entry.indexOf(":")
                : entry.indexOf("=");

            if (separatorIndex <= 0) return null;

            return {
                username: entry.slice(0, separatorIndex).trim(),
                password: entry.slice(separatorIndex + 1),
            };
        })
        .filter((account): account is AdminAccount => Boolean(account?.username && account.password));
}

export function getAdminAccounts() {
    const accounts = new Map<string, AdminAccount>();
    const hasMultiAccountConfig = Boolean(process.env.ADMIN_USERS);
    const hasSingleAccountConfig = Boolean(process.env.ADMIN_USERNAME || process.env.ADMIN_PASSWORD);

    if (!hasMultiAccountConfig || hasSingleAccountConfig) {
        addAccount(
            accounts,
            process.env.ADMIN_USERNAME ?? DEFAULT_ADMIN_USERNAME,
            process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD,
        );
    }

    for (const account of parseAdminUsers(process.env.ADMIN_USERS)) {
        addAccount(accounts, account.username, account.password);
    }

    return [...accounts.values()];
}

function safeEqual(left: string, right: string) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    return leftBuffer.length === rightBuffer.length
        && timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyAdminCredentials(username: string, password: string) {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || !password) return null;

    const account = getAdminAccounts().find(
        (candidate) => candidate.username.toLowerCase() === cleanUsername,
    );

    if (!account || !safeEqual(account.password, password)) return null;
    return { username: account.username } satisfies CurrentAdmin;
}

function getSessionSecret() {
    return process.env.ADMIN_SESSION_SECRET
        ?? process.env.NEXTAUTH_SECRET
        ?? process.env.ADMIN_PASSWORD
        ?? DEFAULT_ADMIN_PASSWORD;
}

function signPayload(payload: string) {
    return createHmac("sha256", getSessionSecret())
        .update(payload)
        .digest("base64url");
}

export function createAdminSession(username: string) {
    const payload = Buffer.from(JSON.stringify({
        username,
        iat: Date.now(),
    })).toString("base64url");

    return `v1.${payload}.${signPayload(payload)}`;
}

export function verifyAdminSession(value: string | undefined) {
    if (!value) return null;

    const [version, payload, signature] = value.split(".");
    if (version !== "v1" || !payload || !signature) return null;
    if (!safeEqual(signPayload(payload), signature)) return null;

    try {
        const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
            username?: unknown;
            iat?: unknown;
        };

        if (typeof session.username !== "string" || typeof session.iat !== "number") return null;
        if (Date.now() - session.iat > ADMIN_SESSION_MAX_AGE * 1000) return null;

        const username = session.username;
        const accountExists = getAdminAccounts().some(
            (account) => account.username.toLowerCase() === username.toLowerCase(),
        );

        return accountExists
            ? ({ username } satisfies CurrentAdmin)
            : null;
    } catch {
        return null;
    }
}

export async function getCurrentAdmin() {
    const cookieStore = await cookies();
    return verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}
