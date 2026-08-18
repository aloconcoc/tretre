// "flash-lite" trades some reasoning depth for much lower latency — the
// full "flash" model spends hundreds of hidden "thinking" tokens even on
// simple product lookups (~30s per reply), which is too slow for a chat
// widget. Flash-Lite answers this kind of grounded, short-context question
// in ~2-3s instead.
const GEMINI_MODEL = 'gemini-3.1-flash-lite';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export interface ChatTurn {
  role: 'user' | 'model';
  text: string;
}

export async function generateChatReply(systemInstruction: string, turns: ChatTurn[]): Promise<string> {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY!,
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents: turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${body}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ?? '';
  if (!text) throw new Error('Gemini API trả về phản hồi rỗng.');
  return text;
}
