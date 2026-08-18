import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/api-auth';

const statusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'completed', 'cancelled']),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Trạng thái không hợp lệ.' }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from('orders')
    .update({ status: parsed.data.status })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return NextResponse.json({ error: error?.message ?? 'Không tìm thấy đơn hàng.' }, { status: 404 });
  return NextResponse.json({ order: data });
}
