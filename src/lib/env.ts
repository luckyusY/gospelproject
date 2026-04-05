import { z } from "zod";

// ─── Schema ───────────────────────────────────────────────
const envSchema = z.object({
    // Site
    NEXT_PUBLIC_SITE_URL:  z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_SITE_NAME: z.string().default("Urugero Media"),

    // Supabase
    NEXT_PUBLIC_SUPABASE_URL:      z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10),
    SUPABASE_SERVICE_ROLE_KEY:     z.string().optional(),
    ADMIN_PASSWORD:                z.string().min(8).default("urugero_admin_2026"),

    // Email (optional until Phase 4)
    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM:     z.string().email().default("noreply@urugero.rw"),

    // Analytics (optional until Phase 7)
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),

    // Auth (optional until Phase 6)
    NEXTAUTH_SECRET:       z.string().min(32).optional(),
    NEXTAUTH_URL:          z.string().url().default("http://localhost:3000"),
    GOOGLE_CLIENT_ID:      z.string().optional(),
    GOOGLE_CLIENT_SECRET:  z.string().optional(),

    // Bible API (optional until Phase 4)
    BIBLE_API_KEY: z.string().optional(),
});

// ─── Parse & export ───────────────────────────────────────
// This throws at startup if any required env var is wrong.
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables. Check .env.local against .env.example.");
}

export const env = parsed.data;

// ─── Type export ──────────────────────────────────────────
export type Env = z.infer<typeof envSchema>;
