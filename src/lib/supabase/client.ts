import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Placeholder fallback so the app can build/render before Supabase env vars
  // are configured; real requests will simply fail until real keys are set.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  );
}
