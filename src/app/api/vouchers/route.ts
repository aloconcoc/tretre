import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/api-auth';

const voucherSchema = z.object({
  code: z.string().min(1),
  type: z.enum(['percentage', 'fixed', 'shipping']),
  value: z.number().int().min(0).optional().default(0),
  minOrderValue: z.number().int().min(0).optional().default(0),
  maxUses: z.number().int().min(0),
  validFrom: z.string().optional().nullable(),
  validUntil: z.string().optional().nullable(),
  description: z.string().optional().default(''),
  active: z.boolean().optional().default(true),
});

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { data, error } = await auth.supabase
    .from('vouchers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ vouchers: data });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const parsed = voucherSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }
  const v = parsed.data;

  const { data, error } = await auth.supabase
    .from('vouchers')
    .insert({
      code: v.code.toUpperCase(),
      type: v.type,
      value: v.value,
      min_order_value: v.minOrderValue,
      max_uses: v.maxUses,
      valid_from: v.validFrom || null,
      valid_until: v.validUntil || null,
      description: v.description,
      active: v.active,
    })
    .select()
    .single();

  if (error) {
    const message = error.code === '23505' ? 'Mã voucher này đã tồn tại.' : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
  return NextResponse.json({ voucher: data }, { status: 201 });
}
