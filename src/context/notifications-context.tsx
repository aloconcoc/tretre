'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './auth-context';
import type { Notification } from '@/types/database';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  markConversationAsRead: (conversationId: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | undefined;

    (async () => {
      // Load the true baseline before subscribing, so a realtime event that
      // fires while this request is still in flight can never be clobbered
      // by the fetch resolving afterwards.
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (cancelled) return;
      setNotifications((data as Notification[]) ?? []);
      setIsLoading(false);

      // A single shared subscription for the whole app — multiple
      // <NotificationBell> instances (e.g. the customer Header and the admin
      // TopBar both render at once on /admin/* pages) must not each open
      // their own channel with the same name, or Realtime rejects the
      // duplicate. Listening for UPDATE too (not just INSERT) keeps this in
      // sync when read-state changes elsewhere — another browser tab, or
      // markAsRead/markConversationAsRead firing from a different mounted
      // instance — instead of only ever learning about brand-new rows.
      channel = supabase
        .channel(`notifications-${user.id}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          (payload) => {
            setNotifications((prev) => {
              const incoming = payload.new as Notification;
              if (prev.some((n) => n.id === incoming.id)) return prev;
              return [incoming, ...prev].slice(0, 20);
            });
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          (payload) => {
            const updated = payload.new as Notification;
            setNotifications((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
          }
        )
        .subscribe();
    })();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
    const supabase = createClient();
    // supabase-js query builders are "thenable" — the request is only
    // actually sent once something awaits/`.then()`s them. A bare
    // statement here would silently never hit the network.
    supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('Failed to mark notification as read', error);
      });
  };

  const markAllAsRead = () => {
    const unreadIds = notifications.filter((n) => !n.read_at).map((n) => n.id);
    if (unreadIds.length === 0) return;
    const now = new Date().toISOString();
    setNotifications((prev) => prev.map((n) => (n.read_at ? n : { ...n, read_at: now })));
    const supabase = createClient();
    supabase
      .from('notifications')
      .update({ read_at: now })
      .in('id', unreadIds)
      .then(({ error }) => {
        if (error) console.error('Failed to mark notifications as read', error);
      });
  };

  // Reading a conversation thread (in the seller chat) implies every "new
  // message" notification for that thread is now seen too — otherwise
  // older unread notifications the user never clicked directly in the bell
  // stay stuck unread forever, and a fresh message makes the whole cluster
  // look unread again.
  const markConversationAsRead = (conversationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.conversation_id === conversationId && n.type === 'new_message' && !n.read_at
          ? { ...n, read_at: new Date().toISOString() }
          : n
      )
    );
    const supabase = createClient();
    supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('type', 'new_message')
      .is('read_at', null)
      .then(({ error }) => {
        if (error) console.error('Failed to mark conversation notifications as read', error);
      });
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, isLoading, markAsRead, markAllAsRead, markConversationAsRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
