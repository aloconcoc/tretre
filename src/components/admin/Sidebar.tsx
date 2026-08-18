'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useNotifications } from '@/context/notifications-context';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'solar:chart-2-linear' },
  { label: 'Sản phẩm', href: '/admin/products', icon: 'solar:box-linear' },
  { label: 'Danh mục', href: '/admin/categories', icon: 'solar:folder-linear' },
  { label: 'Voucher', href: '/admin/vouchers', icon: 'solar:ticket-linear' },
  { label: 'Đơn hàng', href: '/admin/orders', icon: 'solar:bag-4-linear' },
  { label: 'Tin nhắn', href: '/admin/messages', icon: 'solar:chat-round-line-linear' },
  { label: 'Cài đặt', href: '/admin/settings', icon: 'solar:settings-linear' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { notifications } = useNotifications();
  // Count by distinct conversation, not by message — one person with 3
  // unread messages should show "1", not "3".
  const unreadMessages = new Set(
    notifications.filter((n) => !n.read_at && n.type === 'new_message').map((n) => n.conversation_id)
  ).size;

  // Listen for mobile toggle event from TopBar
  if (typeof window !== 'undefined') {
    window.addEventListener('toggle-admin-sidebar', () => {
      setIsMobileOpen(!isMobileOpen);
    });
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          lg:sticky lg:top-0 lg:h-screen
          fixed lg:relative
          left-0 top-0 z-50 lg:z-0
          h-screen 
          bg-white border-r border-gray-200 
          transition-all duration-300
          flex flex-col
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0 min-h-[88px]">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 overflow-hidden"
          >
            <div className="w-8 h-8 bg-comay-green rounded-lg flex items-center justify-center shrink-0">
              <Icon icon="solar:widget-2-bold" className="w-5 h-5 text-white" />
            </div>

            <span
              className={`font-bold text-lg text-comay-charcoal transition-all duration-200
        ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}
      `}
            >
              ADMIN
            </span>
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            <Icon
              icon={isCollapsed ? "lucide:arrow-big-right" : "lucide:arrow-big-left"}
              className="w-5 h-5"
            />
          </button>
        </div>


        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const badgeCount = item.href === '/admin/messages' ? unreadMessages : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                    ? 'bg-comay-green text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="relative flex-shrink-0">
                  <Icon icon={item.icon} className="w-5 h-5" />
                  {isCollapsed && badgeCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {badgeCount > 9 ? '9+' : badgeCount}
                    </span>
                  )}
                </span>
                {!isCollapsed && (
                  <span className="flex-1 flex items-center justify-between min-w-0">
                    <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
                    {badgeCount > 0 && (
                      <span
                        className={`ml-2 min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full flex items-center justify-center ${
                          isActive ? 'bg-white text-comay-green' : 'bg-red-500 text-white'
                        }`}
                      >
                        {badgeCount > 9 ? '9+' : badgeCount}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <Link
            href="/"
            className={`flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''
              }`}
            title={isCollapsed ? 'Về trang chủ' : undefined}
          >
            <Icon icon="solar:arrow-left-linear" className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap">Về trang chủ</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
