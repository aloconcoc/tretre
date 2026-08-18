import { NextResponse, type NextRequest } from 'next/server';
import { getSessionUser } from '@/lib/api-auth';
import { uploadImage } from '@/lib/cloudinary';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const { user } = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Bạn cần đăng nhập.' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Thiếu file ảnh.' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP.' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Ảnh tối đa 5MB.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const { url } = await uploadImage(buffer, 'tretre/payment-proofs');
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: 'Tải ảnh lên thất bại.' }, { status: 500 });
  }
}
