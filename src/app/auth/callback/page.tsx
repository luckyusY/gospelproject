"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function CallbackInner() {
    const router = useRouter();
    const params = useSearchParams();

    useEffect(() => {
        const next = params.get("next") || "/";
        let done = false;
        const go = () => {
            if (done) return;
            done = true;
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
    }, [params, router]);

    return <p style={{ padding: "3rem", textAlign: "center" }}>Turimo kukwinjiza...</p>;
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<p style={{ padding: "3rem", textAlign: "center" }}>Turimo kukwinjiza...</p>}>
            <CallbackInner />
        </Suspense>
    );
}
