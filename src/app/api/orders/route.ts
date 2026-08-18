import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/api-auth';

const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .min(1),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  district: z.string().min(1),
  ward: z.string().min(1),
  paymentMethod: z.enum(['cod', 'bank-transfer']),
  notes: z.string().optional().default(''),
  voucherCode: z.string().optional().nullable(),
  paymentProofUrl: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  const { supabase, user } = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Bạn cần đăng nhập.' }, { status: 401 });

  const body = await request.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }
  const o = parsed.data;

  const { data: orderId, error } = await supabase.rpc('create_order', {
    p_items: o.items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
    p_full_name: o.fullName,
    p_email: o.email,
    p_phone: o.phone,
    p_address: o.address,
    p_city: o.city,
    p_district: o.district,
    p_ward: o.ward,
    p_payment_method: o.paymentMethod,
    p_notes: o.notes,
    p_voucher_code: o.voucherCode || null,
    p_payment_proof_url: o.paymentProofUrl || null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ orderId }, { status: 201 });
}

export async function GET() {
  const { supabase, user } = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Bạn cần đăng nhập.' }, { status: 401 });

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}
