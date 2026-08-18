import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/api-auth';
import { bankInfo } from '@/lib/bank-info';

const schema = z.object({
  amount: z.number().int().min(1000), // VietQR requires a positive amount
  content: z.string().optional().default(''),
});

export async function POST(request: NextRequest) {
  const { user } = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Bạn cần đăng nhập.' }, { status: 401 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  try {
    const res = await fetch('https://api.vietqr.io/v2/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountNo: bankInfo.accountNumberRaw,
        accountName: bankInfo.accountHolder,
        acqId: bankInfo.bin,
        amount: parsed.data.amount,
        addInfo: parsed.data.content.slice(0, 25), // VietQR content length limit
        format: 'text',
        template: 'compact2',
      }),
    });

    const data = await res.json();
    if (!res.ok || data.code !== '00' || !data.data?.qrDataURL) {
      return NextResponse.json({ error: 'Không tạo được mã QR.' }, { status: 502 });
    }

    return NextResponse.json({ qrDataUrl: data.data.qrDataURL });
  } catch {
    return NextResponse.json({ error: 'Không kết nối được dịch vụ VietQR.' }, { status: 502 });
  }
}
