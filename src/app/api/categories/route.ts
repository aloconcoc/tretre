import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/api-auth';

const categorySchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug chỉ gồm chữ thường, số và dấu gạch ngang (vd: do-choi).'),
  name: z.string().min(1),
});

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('categories').select('*').order('name');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ categories: data });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from('categories')
    .insert({ slug: parsed.data.slug, name: parsed.data.name })
    .select()
    .single();

  if (error) {
    const message = error.code === '23505' ? 'Danh mục này đã tồn tại.' : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
  return NextResponse.json({ category: data }, { status: 201 });
}
