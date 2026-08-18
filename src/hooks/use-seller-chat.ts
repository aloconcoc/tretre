'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/auth-context';
import { useNotifications } from '@/context/notifications-context';
import type { ChatMessage } from '@/types/database';

export function useSellerChat() {
  const { user } = useAuth();
  const { markConversationAsRead } = useNotifications();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setConversationId(null);
      setMessages([]);
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    let cancelled = false;

    (async () => {
      // Find-or-create this customer's single conversation with the shop.
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('customer_id', user.id)
        .maybeSingle();

      let convId = existing?.id;
      if (!convId) {
        const { data: created } = await supabase
          .from('conversations')
          .insert({ customer_id: user.id })
          .select('id')
          .single();
        convId = created?.id;
      }

      if (!convId || cancelled) return;
      setConversationId(convId);

      const { data: msgs } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (!cancelled) {
        setMessages((msgs as ChatMessage[]) ?? []);
        setIsLoading(false);
        markConversationAsRead(convId);
      }

      const channel = supabase
        .channel(`chat-${convId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${convId}` },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as ChatMessage]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const sendMessage = useCallback(
    async (body: string) => {
      if (!user || !conversationId || !body.trim()) return;
      const supabase = createClient();
      await supabase.from('chat_messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        sender_role: 'customer',
        body: body.trim(),
      });
    },
    [user, conversationId]
  );

  return { messages, isLoading, sendMessage, isReady: !!conversationId };
}
