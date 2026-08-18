'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import NotificationBell from '@/components/NotificationBell';
import { Icon } from '@iconify/react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'vn' | 'en'>('vn');
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsAccountMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  interface NavigationItem {
    label: string;
    labelEn: string;
    href: string;
    hasDropdown: boolean;
    submenu?: { label: string; labelEn: string; href: string }[];
  }

  const navigationItems: NavigationItem[] = [
    {
      label: 'VỀ TRETRE',
      labelEn: 'ABOUT',
      href: '/about',
      hasDropdown: false,
    },
    { label: 'SẢN PHẨM', labelEn: 'PRODUCTS', href: '/products', hasDropdown: false },
    { label: 'CHẤT LIỆU', labelEn: 'MATERIALS', href: '/materials', hasDropdown: false },
    { label: 'THỜI TRANG BỀN VỮNG', labelEn: 'SUSTAINABLE FASHION', href: '/su-ben-vung', hasDropdown: false },
    { label: 'CHÍNH SÁCH BẢO HÀNH', labelEn: 'SHIPPING POLICY', href: '/chinh-sach-bao-hanh', hasDropdown: false },
    { label: 'CÂU CHUYỆN', labelEn: 'STORY', href: '/news', hasDropdown: false },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'vn' ? 'en' : 'vn');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto">
        {/* First Row: Logo centered with Icons on the right */}
        <div className="flex items-center justify-center h-14 relative border-b border-gray-100">
          {/* Logo - Centered */}
          <Link href="/" className="flex items-center">
            <img
              src="/images/logo.jpeg"
              alt="TRETRE"
              width={140}
              height={140}
              style={{ objectFit: 'contain' }}
            />
          </Link>

          {/* Right Icons */}
          <div className="absolute right-4 flex items-center space-x-2">
            {/* Language Flags */}
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center"
              aria-label="Toggle language"
            >
              <span className="text-lg hover:scale-110 transition-transform cursor-pointer">
                {language === 'vn' ? '🇻🇳' : '🇬🇧'}
              </span>
            </button>


            {/* Notification Bells */}
            {user && (
              <div className="hidden md:flex items-center">
                <NotificationBell
                  types={['new_message']}
                  icon="solar:chat-round-dots-linear"
                  label="Tin nhắn"
                  ariaLabel="Tin nhắn"
                />
                <NotificationBell types={['order_status_changed']} label="Đơn hàng" ariaLabel="Thông báo đơn hàng" />
              </div>
            )}

            {/* User Icon / Account Menu */}
            {user ? (
              <div className="relative hidden md:block" ref={accountMenuRef}>
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-1.5 p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                  aria-label="Tài khoản"
                >
                  <Icon icon="solar:user-bold" className="w-5 h-5 text-comay-green" />
                </button>
                {isAccountMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-comay-charcoal truncate">
                        {profile?.full_name || 'Tài khoản'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    {profile?.role === 'admin' ? (
                      <Link
                        href="/admin"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-comay-green transition-colors flex items-center gap-2"
                      >
                        <Icon icon="solar:widget-2-linear" className="w-4 h-4" />
                        Trang quản trị
                      </Link>
                    ) : (
                      <Link
                        href="/orders"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-comay-green transition-colors flex items-center gap-2"
                      >
                        <Icon icon="solar:bag-4-linear" className="w-4 h-4" />
                        Đơn hàng của tôi
                      </Link>
                    )}
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
            ) : (
              <Link
                href="/login"
                className="hidden md:flex p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                aria-label="Đăng nhập"
              >
                <Icon icon="solar:user-linear" className="w-5 h-5" />
              </Link>
            )}

            {/* Search Icon */}
            <button className="hidden md:flex p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
              <Icon icon="solar:magnifer-linear" className="w-5 h-5" />
            </button>

            {/* Cart Icon */}
            <Link href="/cart" className="hidden md:flex p-1.5 hover:bg-gray-100 rounded-full transition-colors relative text-gray-600">
              <Icon icon="solar:bag-linear" className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-comay-green text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-scale-in">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-1.5 text-gray-600"
            >
              <Icon icon={isMenuOpen ? "solar:close-circle-linear" : "solar:hamburger-menu-linear"} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Second Row: Navigation Links - Centered */}
        <nav className="hidden lg:flex items-center justify-center h-10 space-x-6 gap-6">
          {navigationItems.map((item) => (
            <div key={item.href} className="relative group">
              <Link
                href={item.href}
                className="text-xs text-gray-700 hover:text-comay-green transition-colors duration-200 font-normal tracking-wide flex items-center gap-1 py-2"
              >
                {language === 'vn' ? item.label : item.labelEn}
                {item.hasDropdown && (
                  <Icon icon="solar:alt-arrow-down-linear" className="w-3 h-3 transition-transform group-hover:rotate-180" />
                )}
              </Link>

              {/* Dropdown Menu */}
              {item.submenu && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-white shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100">
                  <div className="py-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-comay-green transition-colors whitespace-nowrap"
                      >
                        {language === 'vn' ? subItem.label : subItem.labelEn}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden border-t border-gray-100 py-3">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2.5 px-4 text-sm text-gray-700 hover:text-comay-green hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {language === 'vn' ? item.label : item.labelEn}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
