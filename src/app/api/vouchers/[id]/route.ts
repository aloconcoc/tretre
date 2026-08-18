import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/api-auth';

const voucherUpdateSchema = z.object({
  code: z.string().min(1).optional(),
  type: z.enum(['percentage', 'fixed', 'shipping']).optional(),
  value: z.number().int().min(0).optional(),
  minOrderValue: z.number().int().min(0).optional(),
  maxUses: z.number().int().min(0).optional(),
  validFrom: z.string().optional().nullable(),
  validUntil: z.string().optional().nullable(),
  description: z.string().optional(),
  active: z.boolean().optional(),
});

const fieldMap: Record<string, string> = {
  minOrderValue: 'min_order_value',
  maxUses: 'max_uses',
  validFrom: 'valid_from',
  validUntil: 'valid_until',
};

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { data, error } = await auth.supabase.from('vouchers').select('*').eq('id', id).single();
  if (error || !data) return NextResponse.json({ error: 'Không tìm thấy voucher.' }, { status: 404 });
  return NextResponse.json({ voucher: data });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const parsed = voucherUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(parsed.data)) {
    if (value === undefined) continue;
    update[fieldMap[key] ?? key] = key === 'code' && typeof value === 'string' ? value.toUpperCase() : value;
  }

  const { data, error } = await auth.supabase
    .from('vouchers')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    const message = error?.code === '23505' ? 'Mã voucher này đã tồn tại.' : error?.message ?? 'Không tìm thấy voucher.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
  return NextResponse.json({ voucher: data });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { error } = await auth.supabase.from('vouchers').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
