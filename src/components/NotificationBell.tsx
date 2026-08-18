'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useNotifications } from '@/context/notifications-context';
import { useAuth } from '@/context/auth-context';
import type { Notification, NotificationType } from '@/types/database';

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'Vừa xong';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

function notificationHref(n: Notification, isAdmin: boolean): string | null {
  if (n.type === 'new_message' && n.conversation_id) {
    return isAdmin ? `/admin/messages/${n.conversation_id}` : null;
  }
  if (!n.order_id) return null;
  return n.type === 'new_order' ? `/admin/orders/${n.order_id}` : `/orders/${n.order_id}`;
}

interface NotificationBellProps {
  /** Only show/count notifications of these types. Omit to show everything. */
  types?: NotificationType[];
  icon?: string;
  label?: string;
  ariaLabel?: string;
}

export default function NotificationBell({
  types,
  icon = 'solar:bell-linear',
  label = 'Thông báo',
  ariaLabel = 'Thông báo',
}: NotificationBellProps) {
  const router = useRouter();
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const { notifications: allNotifications, markAsRead, markAllAsRead: markAllAsReadGlobal } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const notifications = types ? allNotifications.filter((n) => types.includes(n.type)) : allNotifications;
  // Chat notifications count by distinct conversation (one person, however
  // many unread messages, is "1 unread"); other notification types still
  // count individually.
  const unreadCount = new Set(
    notifications.filter((n) => !n.read_at).map((n) => (n.type === 'new_message' ? `conv:${n.conversation_id}` : n.id))
  ).size;
  const markAllAsRead = types
    ? () => notifications.filter((n) => !n.read_at).forEach((n) => markAsRead(n.id))
    : markAllAsReadGlobal;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickNotification = (n: Notification) => {
    if (!n.read_at) markAsRead(n.id);
    const href = notificationHref(n, isAdmin);
    if (href) {
      router.push(href);
      setIsOpen(false);
      return;
    }
    if (n.type === 'new_message' && !isAdmin) {
      window.dispatchEvent(new CustomEvent('open-seller-chat'));
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-600"
        aria-label={ariaLabel}
      >
        <Icon icon={icon} className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-comay-green text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-[28rem] overflow-y-auto bg-white shadow-lg rounded-xl border border-gray-100 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-comay-charcoal text-sm">{label}</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-comay-green hover:underline font-medium"
              >
                Đánh dấu đã đọc tất cả
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">Chưa có thông báo nào</div>
          ) : (
            <div>
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClickNotification(n)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 ${
                    !n.read_at ? 'bg-comay-green/5' : ''
                  }`}
                >
                  <div className="mt-1 flex-shrink-0">
                    <span
                      className={`block w-2 h-2 rounded-full ${!n.read_at ? 'bg-comay-green' : 'bg-transparent'}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-comay-charcoal">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
