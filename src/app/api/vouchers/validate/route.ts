import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/api-auth';

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().int().min(0),
});

export async function POST(request: NextRequest) {
  const { supabase, user } = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Bạn cần đăng nhập.' }, { status: 401 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const { data, error } = await supabase.rpc('preview_voucher', {
    p_code: parsed.data.code,
    p_subtotal: parsed.data.subtotal,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const result = data?.[0];
  return NextResponse.json({
    discountType: result?.discount_type,
    discountAmount: result?.discount_amount,
    description: result?.description,
  });
}
