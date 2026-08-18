'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';


export default function Footer() {
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState<'vn' | 'en'>('vn');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribed:', email);
    setEmail('');
  };

  return (
    <footer className="bg-white text-comay-charcoal border-t border-gray-100 py-8 mt-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Column 1: Newsletter */}
          <div className="lg:col-span-3 space-y-2">
            <h3 className="font-bold text-sm tracking-wider uppercase">Đăng Ký Thành Viên</h3>
            <p className="text-gray-500 text-xs">Để nhận những ưu đãi đặc biệt từ TRE TRẺ</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập Email"
                className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-comay-charcoal transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 text-sm font-bold uppercase tracking-wider hover:opacity-80 transition-opacity"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Column 2: Help */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-bold text-sm tracking-wider uppercase">Trợ Giúp</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-black transition-colors flex items-center gap-2">
                  <span className="text-xs">&gt;</span> Chính sách thanh toán
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors flex items-center gap-2">
                  <span className="text-xs">&gt;</span> Chính sách giá bán lẻ
                </a>
              </li>
              <li>
                <a href="/chinh-sach-giao-hang" className="hover:text-black transition-colors flex items-center gap-2">
                  <span className="text-xs">&gt;</span> Chính sách giao hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors flex items-center gap-2">
                  <span className="text-xs">&gt;</span> Chính sách đổi trả
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Home */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-bold text-sm tracking-wider uppercase">Trang Chủ</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/about" className="hover:text-black transition-colors flex items-center gap-2">
                  <span className="text-xs">&gt;</span> Về COMAY
                </a>
              </li>
              <li>
                <a href="/su-ben-vung" className="hover:text-black transition-colors flex items-center gap-2">
                  <span className="text-xs">&gt;</span> Thời trang bền vững
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors flex items-center gap-2">
                  <span className="text-xs">&gt;</span> Hợp tác
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-black transition-colors flex items-center gap-2">
                  <span className="text-xs">&gt;</span> Tất cả sản phẩm
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Showrooms */}
          <div className="lg:col-span-5 text-center space-y-3">
            <h3 className="font-bold text-sm tracking-wider uppercase">HỆ THỐNG CỬA HÀNG TRƯNG BÀY</h3>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900">Hà Nội</h4>
                <p>Khu Giáo dục và Đào tạo - Khu Công nghệ cao Hòa Lạc - Km29 Đại lộ Thăng Long, Xã Hòa Lạc, TP. Hà Nội</p>
                <p>FPT University, Hoa Lac Hi-tech Park, km 29</p>
              </div>

              {/* <div className="space-y-2">
                <h4 className="font-bold text-gray-900">Quảng Ninh</h4>
                <p>Essence Grand Ha Long Bay Cruise | TP. Hạ Long</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-900">Đà Nẵng</h4>
                <p>167 Đường Trần Phú, Phường Hải Châu 1, Quận Hải Châu, TP. Đà Nẵng</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-900">Nha Trang</h4>
                <p>137 Đường Huỳnh Thúc Kháng, Phường Tân Lập, TP. Nha Trang</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-900">Khánh Hòa</h4>
                <p>Six Senses Ninh Van Bay | Vịnh Ninh Vân, Thị xã Ninh Hòa, Tỉnh Khánh Hòa</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-900">TP. Hồ Chí Minh</h4>
                <p>Urban Garden | 71 Xuân Thủy, Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh</p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 gap-4">
          <div className="flex gap-2 text-gray-500">
            <a href="#" className="hover:text-black transition-colors">
              <span className="sr-only">Facebook</span>
              <Icon icon="ri:facebook-fill" className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-black transition-colors">
              <span className="sr-only">Instagram</span>
              <Icon icon="ri:instagram-line" className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-black transition-colors">
              <span className="sr-only">Email</span>
              <Icon icon="ri:mail-line" className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-black transition-colors">
              <span className="sr-only">Phone</span>
              <Icon icon="solar:phone-bold" className="h-5 w-5" />
            </a>
          </div>

          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-black transition-colors">Cookies</a>
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
