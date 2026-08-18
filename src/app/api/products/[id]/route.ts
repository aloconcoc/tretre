import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/api-auth';

const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  nameEn: z.string().optional(),
  collection: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  price: z.number().int().min(0).optional(),
  priceUSD: z.number().min(0).optional(),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  longDescription: z.string().optional(),
  descriptionImages: z.array(z.string()).optional(),
  material: z.string().optional(),
  specifications: z
    .object({
      weight: z.string().optional(),
      dimensions: z.string().optional(),
      color: z.string().optional(),
      handleType: z.string().optional(),
    })
    .optional(),
  bestseller: z.boolean().optional(),
  premium: z.boolean().optional(),
  quantity: z.number().int().min(0).optional(),
});

const fieldMap: Record<string, string> = {
  nameEn: 'name_en',
  priceUSD: 'price_usd',
  descriptionEn: 'description_en',
  longDescription: 'long_description',
  descriptionImages: 'description_images',
};

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

  if (error || !data) return NextResponse.json({ error: 'Không tìm thấy sản phẩm.' }, { status: 404 });

  const { data: soldCount } = await supabase.rpc('get_product_sold_count', { p_product_id: id });

  return NextResponse.json({ product: { ...data, sold_count: soldCount ?? 0 } });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const parsed = productUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(parsed.data)) {
    if (value === undefined) continue;
    update[fieldMap[key] ?? key] = value;
  }
  if (parsed.data.quantity !== undefined) {
    update.in_stock = parsed.data.quantity > 0;
  }

  const { data, error } = await auth.supabase
    .from('products')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    const message = error?.code === '23503' ? 'Danh mục không tồn tại.' : error?.message ?? 'Không tìm thấy sản phẩm.';
    return NextResponse.json({ error: message }, { status: error ? 400 : 404 });
  }
  return NextResponse.json({ product: data });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { error } = await auth.supabase.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
