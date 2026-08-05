import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a real client only if credentials are configured
// During build time or when env vars are missing, use a dummy to prevent crashes
function createSupabaseClient(): SupabaseClient {
  if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http")) {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  // Dummy client for build time — will fail at runtime if not configured
  return createClient("https://placeholder.supabase.co", "placeholder-key");
}

export const supabase = createSupabaseClient();
