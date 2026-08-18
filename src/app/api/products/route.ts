import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/api-auth';

const productSchema = z.object({
  name: z.string().min(1),
  nameEn: z.string().optional().default(''),
  collection: z.string().min(1),
  category: z.string().min(1),
  price: z.number().int().min(0),
  priceUSD: z.number().min(0).optional().default(0),
  images: z.array(z.string()).default([]),
  description: z.string().optional().default(''),
  descriptionEn: z.string().optional().default(''),
  longDescription: z.string().optional().default(''),
  descriptionImages: z.array(z.string()).optional().default([]),
  material: z.string().optional().default(''),
  specifications: z
    .object({
      weight: z.string().optional(),
      dimensions: z.string().optional(),
      color: z.string().optional(),
      handleType: z.string().optional(),
    })
    .optional()
    .default({}),
  bestseller: z.boolean().optional().default(false),
  premium: z.boolean().optional().default(false),
  quantity: z.number().int().min(0),
});

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const params = request.nextUrl.searchParams;

  let query = supabase.from('products').select('*').order('created_at', { ascending: false });

  const category = params.get('category');
  if (category) query = query.eq('category', category);

  const collection = params.get('collection');
  if (collection) query = query.eq('collection', collection);

  if (params.get('bestseller') === 'true') query = query.eq('bestseller', true);
  if (params.get('premium') === 'true') query = query.eq('premium', true);

  const excludeId = params.get('excludeId');
  if (excludeId) query = query.neq('id', excludeId);

  const search = params.get('search');
  if (search) query = query.ilike('name', `%${search}%`);

  const limit = params.get('limit');
  if (limit) query = query.limit(Number(limit));

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ products: data });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const p = parsed.data;
  const { data, error } = await auth.supabase
    .from('products')
    .insert({
      name: p.name,
      name_en: p.nameEn,
      collection: p.collection,
      category: p.category,
      price: p.price,
      price_usd: p.priceUSD,
      images: p.images,
      description: p.description,
      description_en: p.descriptionEn,
      long_description: p.longDescription,
      description_images: p.descriptionImages,
      material: p.material,
      specifications: p.specifications,
      bestseller: p.bestseller,
      premium: p.premium,
      in_stock: p.quantity > 0,
      quantity: p.quantity,
    })
    .select()
    .single();

  if (error) {
    const message = error.code === '23503' ? 'Danh mục không tồn tại.' : error.message;
    return NextResponse.json({ error: message }, { status: error.code === '23503' ? 400 : 500 });
  }
  return NextResponse.json({ product: data }, { status: 201 });
}
