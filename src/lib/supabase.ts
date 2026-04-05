import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser / Server Component client (anon key — respects RLS)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnon);

// Admin client for API routes (service role — bypasses RLS)
export function supabaseAdmin() {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
        // Fall back to anon key in dev when service key isn't set
        return createClient<Database>(supabaseUrl, supabaseAnon);
    }
    return createClient<Database>(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}
