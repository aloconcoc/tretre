'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/auth-context';
import { useNotifications } from '@/context/notifications-context';
import type { ChatMessage } from '@/types/database';

export default function AdminConversationPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const { user } = useAuth();
  const { markConversationAsRead } = useNotifications();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [customerName, setCustomerName] = useState('Khách hàng');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    (async () => {
      const { data: conv } = await supabase.from('conversations').select('customer_id').eq('id', conversationId).single();
      if (conv?.customer_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name,email')
          .eq('id', conv.customer_id)
          .single();
        if (!cancelled && profile) {
          setCustomerName(profile.full_name || 'Khách hàng');
          setCustomerEmail(profile.email ?? '');
        }
      }

      const { data: msgs } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!cancelled) {
        setMessages((msgs as ChatMessage[]) ?? []);
        setIsLoading(false);
      }

      // Mark the customer's messages — and the notifications about them —
      // as read now that admin has opened the thread.
      await supabase
        .from('chat_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('sender_role', 'customer')
        .is('read_at', null);
      markConversationAsRead(conversationId);
    })();

    const channel = supabase
      .channel(`admin-chat-${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !user) return;
    const supabase = createClient();
    const body = inputValue.trim();
    setInputValue('');
    await supabase.from('chat_messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      sender_role: 'admin',
      body,
    });
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[70vh] min-h-[420px]">
      <div className="flex items-center gap-4 mb-4 flex-shrink-0">
        <Link href="/admin/messages" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Icon icon="solar:arrow-left-linear" className="w-6 h-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-comay-charcoal">{customerName}</h1>
          <p className="text-sm text-gray-500">{customerEmail}</p>
        </div>
      </div>

      <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
        {isLoading ? (
          <div className="text-center text-gray-400 py-8">Đang tải...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">Chưa có tin nhắn nào</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  msg.sender_role === 'admin'
                    ? 'bg-comay-green text-white rounded-br-none'
                    : 'bg-gray-50 text-gray-800 rounded-bl-none border border-gray-100'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.body}</p>
                <p className={`mt-1 text-[10px] ${msg.sender_role === 'admin' ? 'text-white/70' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 focus-within:border-comay-green transition-colors flex-shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập phản hồi..."
          className="flex-1 bg-transparent text-sm focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-comay-green text-white disabled:opacity-40 transition-opacity"
        >
          <Icon icon="mingcute:send-fill" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
