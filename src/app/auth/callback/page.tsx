"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        let done = false;
        const go = () => {
            if (done) return;
            done = true;
            let next = "/";
            try {
                next = localStorage.getItem("post_login_next") || "/";
                localStorage.removeItem("post_login_next");
            } catch { /* ignore */ }
            router.replace(next);
        };

        // detectSessionInUrl exchanges the ?code automatically on load — wait
        // for the session, then return the user to where they signed in from.
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) go();
        });
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) go();
        });

        // Fallback so we never get stuck on this page.
        const timer = setTimeout(go, 4000);
        return () => {
            sub.subscription.unsubscribe();
            clearTimeout(timer);
        };
    }, [router]);

    return <p style={{ padding: "3rem", textAlign: "center" }}>Turimo kukwinjiza...</p>;
}
