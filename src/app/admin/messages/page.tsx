'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { createClient } from '@/lib/supabase/client';

interface ConversationRow {
  id: string;
  customerName: string;
  customerEmail: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export default function AdminMessagesPage() {
  const [rows, setRows] = useState<ConversationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    (async () => {
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id,customer_id,updated_at')
        .order('updated_at', { ascending: false });

      if (!conversations || conversations.length === 0) {
        setIsLoading(false);
        return;
      }

      const customerIds = conversations.map((c) => c.customer_id);
      const { data: profiles } = await supabase.from('profiles').select('id,full_name,email').in('id', customerIds);
      const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

      const results = await Promise.all(
        conversations.map(async (c) => {
          const [{ data: lastMsg }, { count }] = await Promise.all([
            supabase
              .from('chat_messages')
              .select('body,created_at')
              .eq('conversation_id', c.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle(),
            supabase
              .from('chat_messages')
              .select('id', { count: 'exact', head: true })
              .eq('conversation_id', c.id)
              .eq('sender_role', 'customer')
              .is('read_at', null),
          ]);

          const profile = profileMap.get(c.customer_id);
          return {
            id: c.id,
            customerName: profile?.full_name || 'Khách hàng',
            customerEmail: profile?.email ?? '',
            lastMessage: lastMsg?.body ?? '',
            lastMessageAt: lastMsg?.created_at ?? c.updated_at,
            unreadCount: count ?? 0,
          };
        })
      );

      results.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
      setRows(results);
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-comay-charcoal mb-2">Tin Nhắn Khách Hàng</h1>
        <p className="text-gray-500">Tổng: {rows.length} cuộc hội thoại</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-16 text-gray-500">Đang tải...</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16">
            <Icon icon="solar:chat-round-line-linear" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Chưa có cuộc hội thoại nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {rows.map((row) => (
              <Link
                key={row.id}
                href={`/admin/messages/${row.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-comay-green/10 flex items-center justify-center flex-shrink-0">
                  <Icon icon="solar:user-bold" className="w-5 h-5 text-comay-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-comay-charcoal">{row.customerName}</p>
                    <span className="text-xs text-gray-400">{row.customerEmail}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{row.lastMessage}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-xs text-gray-400">
                    {new Date(row.lastMessageAt).toLocaleDateString('vi-VN')}
                  </span>
                  {row.unreadCount > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 bg-comay-green text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {row.unreadCount}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
