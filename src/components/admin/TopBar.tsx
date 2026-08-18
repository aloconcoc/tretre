'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useAuth } from '@/context/auth-context';
import NotificationBell from '@/components/NotificationBell';

export default function AdminTopBar() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section with mobile toggle and title */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden w-8 h-8 bg-comay-green rounded-lg flex items-center justify-center"
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-admin-sidebar'))}
          >
            <Icon icon="solar:widget-2-bold" className="w-5 h-5 text-white" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-comay-charcoal"></h1>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <NotificationBell
            types={['new_message']}
            icon="solar:chat-round-dots-linear"
            label="Tin nhắn"
            ariaLabel="Tin nhắn"
          />
          <NotificationBell types={['new_order', 'order_status_changed']} label="Đơn hàng" ariaLabel="Thông báo đơn hàng" />

          {/* User profile */}
          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 bg-comay-green rounded-full flex items-center justify-center">
                <Icon icon="solar:user-bold" className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-comay-charcoal">
                  {profile?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Icon icon="solar:alt-arrow-down-linear" className="w-4 h-4 text-gray-400" />
            </div>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-100 py-2 z-50">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-comay-green transition-colors flex items-center gap-2"
                >
                  <Icon icon="solar:logout-2-linear" className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
