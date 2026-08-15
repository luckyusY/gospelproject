import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import type { AdminUserRow } from "@/types/database";

export const ADMIN_SESSION_COOKIE = "admin_auth";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24;

const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "urugero_admin_2026";
const DEFAULT_JOURNALIST_ONE_USERNAME = "journalist1";
const DEFAULT_JOURNALIST_ONE_PASSWORD = "urugero_journalist_1_2026";
const DEFAULT_JOURNALIST_TWO_USERNAME = "journalist2";
const DEFAULT_JOURNALIST_TWO_PASSWORD = "urugero_journalist_2_2026";

export type AdminRole = "admin" | "journalist";

type AdminAccount = {
    username: string;
    password: string;
    role: AdminRole;
    displayName: string;
};

export type AdminAccountSummary = Omit<AdminAccount, "password"> & {
    id: string | null;
    source: "database" | "environment";
    isActive: boolean;
    createdAt: string | null;
};

export type CurrentAdmin = {
    username: string;
    role: AdminRole;
    displayName: string;
};

function normalizeRole(value: string | undefined): AdminRole {
    return value?.trim().toLowerCase() === "journalist" ? "journalist" : "admin";
}

function addAccount(
    accounts: Map<string, AdminAccount>,
    username: string,
    password: string,
    role: AdminRole = "admin",
    displayName = username,
) {
    const cleanUsername = username.trim();
    if (!cleanUsername || !password) return;
    accounts.set(cleanUsername.toLowerCase(), {
        username: cleanUsername,
        password,
        role,
        displayName: displayName.trim() || cleanUsername,
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

            const username = entry.slice(0, separatorIndex).trim();
            const rest = entry.slice(separatorIndex + 1);
            const [password = "", role = "admin", displayName = username] = rest.split("|").length > 1
                ? rest.split("|")
                : rest.split(":");

            return { username, password, role: normalizeRole(role), displayName };
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
            "admin",
            process.env.ADMIN_DISPLAY_NAME ?? process.env.ADMIN_USERNAME ?? DEFAULT_ADMIN_USERNAME,
        );
    }

    for (const account of parseAdminUsers(process.env.ADMIN_USERS)) {
        addAccount(accounts, account.username, account.password, account.role, account.displayName);
    }

    addAccount(
        accounts,
        process.env.JOURNALIST_ONE_USERNAME ?? DEFAULT_JOURNALIST_ONE_USERNAME,
        process.env.JOURNALIST_ONE_PASSWORD ?? DEFAULT_JOURNALIST_ONE_PASSWORD,
        "journalist",
        process.env.JOURNALIST_ONE_NAME ?? "Journalist One",
    );
    addAccount(
        accounts,
        process.env.JOURNALIST_TWO_USERNAME ?? DEFAULT_JOURNALIST_TWO_USERNAME,
        process.env.JOURNALIST_TWO_PASSWORD ?? DEFAULT_JOURNALIST_TWO_PASSWORD,
        "journalist",
        process.env.JOURNALIST_TWO_NAME ?? "Journalist Two",
    );

    return [...accounts.values()];
}

function fromDatabaseAccount(account: AdminUserRow): AdminAccount {
    return {
        username: account.username,
        password: account.password_hash,
        role: normalizeRole(account.role),
        displayName: account.display_name,
    };
}

async function getDatabaseAccount(username: string) {
    const { data, error } = await supabaseAdmin()
        .from("admin_users")
        .select("*")
        .eq("username", username.trim().toLowerCase())
        .eq("is_active", true)
        .maybeSingle();

    if (error || !data) return null;
    return data as AdminUserRow;
}

function safeEqual(left: string, right: string) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    return leftBuffer.length === rightBuffer.length
        && timingSafeEqual(leftBuffer, rightBuffer);
}

export function hashAdminPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");
    return `scrypt:${salt}:${hash}`;
}

function verifyHashedPassword(password: string, storedHash: string) {
    const [algorithm, salt, expected] = storedHash.split(":");
    if (algorithm !== "scrypt" || !salt || !expected) return false;
    const actual = scryptSync(password, salt, 64).toString("hex");
    return safeEqual(actual, expected);
}

export async function verifyAdminCredentials(username: string, password: string) {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || !password) return null;

    const databaseAccount = await getDatabaseAccount(cleanUsername);
    if (databaseAccount && verifyHashedPassword(password, databaseAccount.password_hash)) {
        const account = fromDatabaseAccount(databaseAccount);
        return {
            username: account.username,
            role: account.role,
            displayName: account.displayName,
        } satisfies CurrentAdmin;
    }

    const account = getAdminAccounts().find(
        (candidate) => candidate.username.toLowerCase() === cleanUsername,
    );

    if (!account || !safeEqual(account.password, password)) return null;
    return {
        username: account.username,
        role: account.role,
        displayName: account.displayName,
    } satisfies CurrentAdmin;
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

export function createAdminSession(admin: CurrentAdmin | string) {
    const account = typeof admin === "string"
        ? getAdminAccounts().find(candidate => candidate.username.toLowerCase() === admin.toLowerCase())
        : admin;
    const username = typeof admin === "string" ? admin : admin.username;
    const payload = Buffer.from(JSON.stringify({
        username,
        role: account?.role ?? "admin",
        displayName: account?.displayName ?? username,
        iat: Date.now(),
    })).toString("base64url");

    return `v1.${payload}.${signPayload(payload)}`;
}

export async function verifyAdminSession(value: string | undefined) {
    if (!value) return null;

    const [version, payload, signature] = value.split(".");
    if (version !== "v1" || !payload || !signature) return null;
    if (!safeEqual(signPayload(payload), signature)) return null;

    try {
        const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
            username?: unknown;
            role?: unknown;
            displayName?: unknown;
            iat?: unknown;
        };

        if (typeof session.username !== "string" || typeof session.iat !== "number") return null;
        if (Date.now() - session.iat > ADMIN_SESSION_MAX_AGE * 1000) return null;

        const username = session.username;
        const databaseAccount = await getDatabaseAccount(username);
        const account = databaseAccount
            ? fromDatabaseAccount(databaseAccount)
            : getAdminAccounts().find(
                candidate => candidate.username.toLowerCase() === username.toLowerCase(),
            );

        return account
            ? ({
                username,
                role: account.role,
                displayName: account.displayName,
            } satisfies CurrentAdmin)
            : null;
    } catch {
        return null;
    }
}

export async function getCurrentAdmin() {
    const cookieStore = await cookies();
    return await verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function listAdminAccounts(): Promise<AdminAccountSummary[]> {
    const environmentAccounts = getAdminAccounts().map(account => ({
        id: null,
        username: account.username,
        role: account.role,
        displayName: account.displayName,
        source: "environment" as const,
        isActive: true,
        createdAt: null,
    }));
    const { data } = await supabaseAdmin()
        .from("admin_users")
        .select("id, username, display_name, role, is_active, created_at")
        .order("created_at", { ascending: false });
    const databaseAccounts = (data ?? []).map(account => ({
        id: String(account.id),
        username: String(account.username),
        role: normalizeRole(String(account.role)),
        displayName: String(account.display_name),
        source: "database" as const,
        isActive: Boolean(account.is_active),
        createdAt: String(account.created_at),
    }));

    return [...databaseAccounts, ...environmentAccounts];
}

export function isFullAdmin(admin: CurrentAdmin | null) {
    return admin?.role === "admin";
}

export function getJournalistAuthorNames(admin: CurrentAdmin) {
    return Array.from(new Set([admin.displayName, admin.username].filter(Boolean)));
}

export function canManageArticleAuthor(admin: CurrentAdmin, author: string | null | undefined) {
    if (isFullAdmin(admin)) return true;
    const normalizedAuthor = (author ?? "").trim().toLowerCase();
    return getJournalistAuthorNames(admin).some(name => name.trim().toLowerCase() === normalizedAuthor);
}
