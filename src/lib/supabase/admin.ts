import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Service-role client — bypasses Row Level Security entirely.
// Do NOT import this from API routes or any code that handles user requests.
// It exists only for trusted, offline/local scripts (see scripts/seed-products.ts).
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
