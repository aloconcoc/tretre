import { NextResponse, type NextRequest } from 'next/server';
import { getSessionUser } from '@/lib/api-auth';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  const { reviewId } = await params;
  const { supabase, user } = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Bạn cần đăng nhập.' }, { status: 401 });

  // RLS (reviews_delete_own / reviews_delete_admin) enforces who may
  // actually delete which row — this just performs the request as the
  // caller's own session.
  const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
