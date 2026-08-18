import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { generateChatReply, type ChatTurn } from '@/lib/gemini';

const messageSchema = z.object({
  sender: z.enum(['user', 'ai']),
  text: z.string(),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(30),
});

const STOPWORDS = new Set([
  'tôi', 'bạn', 'shop', 'là', 'có', 'không', 'cho', 'với', 'và', 'thế', 'này', 'đó', 'giá',
  'muốn', 'cần', 'xin', 'chào', 'hỏi', 'giúp', 'nào', 'gì', 'của', 'một', 'mình', 'ạ', 'nhé',
]);

async function findRelevantProducts(message: string) {
  // Keep diacritics — the product catalog is stored with proper Vietnamese
  // accents, and Postgres ILIKE is case-insensitive but not accent-folding,
  // so a stripped "tui" would never match a stored "Túi".
  const words = message
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));

  if (words.length === 0) return [];

  const supabase = await createClient();
  const orFilter = words
    .slice(0, 6)
    .flatMap((w) => [`name.ilike.%${w}%`, `description.ilike.%${w}%`, `material.ilike.%${w}%`, `collection.ilike.%${w}%`])
    .join(',');

  const { data } = await supabase
    .from('products')
    .select('id,name,price,category,collection,material,description,in_stock')
    .or(orFilter)
    .limit(5);

  return data ?? [];
}

const SYSTEM_INSTRUCTION = `Bạn là trợ lý TƯ VẤN SẢN PHẨM của TRETRE — thương hiệu đồ thủ công Việt Nam (túi xách, phụ kiện, đồ trang trí) làm từ chất liệu tự nhiên như lục bình, cói, tre, raffia. Phạm vi công việc của bạn CHỈ là giúp khách tìm và gợi ý sản phẩm phù hợp.

Quy tắc bắt buộc:
- Luôn trả lời bằng tiếng Việt, ngắn gọn, thân thiện, tự nhiên như nhân viên tư vấn thật.
- Nếu phần "Sản phẩm phù hợp" bên dưới có sản phẩm, hãy giới thiệu 1-3 sản phẩm phù hợp nhất, MỖI sản phẩm nhắc tới PHẢI dùng đúng định dạng liên kết Markdown: [Tên sản phẩm](/products/id) — dùng đúng id được cung cấp, không tự bịa id, không tự bịa giá.
- Nếu không có sản phẩm nào phù hợp trong danh sách, đừng bịa ra sản phẩm không có thật — chỉ cần trả lời tự nhiên, gợi ý khách xem thêm tại [Tất cả sản phẩm](/products) hoặc hỏi thêm để hiểu rõ nhu cầu.
- TUYỆT ĐỐI KHÔNG được tự bịa ra bất kỳ thông tin nào về: chính sách đổi trả, bảo hành, thời gian giao hàng, phí vận chuyển, khuyến mãi/giảm giá, hay trạng thái đơn hàng cụ thể của khách — vì bạn KHÔNG có dữ liệu thật về những điều này.
- Nếu khách hỏi về chính sách/bảo hành/giao hàng: trả lời đúng 1 câu dẫn khách tới [Chính sách bảo hành](/chinh-sach-bao-hanh), không đoán mò con số hay điều kiện cụ thể.
- Nếu khách hỏi về đơn hàng đã đặt, tình trạng giao hàng, hoàn tiền: dẫn khách tới mục "Đơn hàng của tôi" trên website hoặc liên hệ trực tiếp CSKH, vì bạn không tra được đơn hàng cụ thể.`;

export async function POST(request: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Chatbot chưa được cấu hình.' }, { status: 503 });
  }

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const { messages } = parsed.data;
  const lastUserMessage = [...messages].reverse().find((m) => m.sender === 'user')?.text ?? '';

  const products = await findRelevantProducts(lastUserMessage);
  const productContext =
    products.length > 0
      ? 'Sản phẩm phù hợp:\n' +
        products
          .map(
            (p) =>
              `- id: ${p.id}, tên: ${p.name}, giá: ${p.price.toLocaleString('vi-VN')}₫, chất liệu: ${p.material ?? 'N/A'}, danh mục: ${p.category ?? 'N/A'}, còn hàng: ${p.in_stock ? 'còn' : 'hết'}`
          )
          .join('\n')
      : 'Sản phẩm phù hợp: (không tìm thấy sản phẩm nào khớp với yêu cầu này trong kho dữ liệu)';

  const turns: ChatTurn[] = messages.map((m) => ({
    role: m.sender === 'user' ? ('user' as const) : ('model' as const),
    text: m.text,
  }));

  try {
    const reply = await generateChatReply(`${SYSTEM_INSTRUCTION}\n\n${productContext}`, turns);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Trợ lý đang bận, vui lòng thử lại sau.' }, { status: 502 });
  }
}
