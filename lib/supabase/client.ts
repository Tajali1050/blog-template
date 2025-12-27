"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Missing Supabase environment variables:");
        console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓" : "✗ missing");
        console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✓" : "✗ missing");
        throw new Error(
            "Missing Supabase configuration. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file and you've rebuilt the app."
        );
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
