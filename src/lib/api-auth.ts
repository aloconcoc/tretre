import { createClient } from '@/lib/supabase/server';

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function requireAdmin() {
  const { supabase, user } = await getSessionUser();
  if (!user) {
    return { ok: false as const, status: 401, error: 'Bạn cần đăng nhập.' };
  }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
    return { ok: false as const, status: 403, error: 'Bạn không có quyền admin.' };
  }
  return { ok: true as const, supabase, user };
}
