'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 300);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-comay-cream-light/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-comay-charcoal">Giỏ hàng trống</h1>
              <p className="text-gray-600">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
            </div>
            <Link
              href="/products"
              className="inline-block bg-comay-green text-white px-8 py-4 rounded-full font-semibold hover:bg-comay-green/90 transition-all hover:shadow-lg"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-comay-cream-light/30 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-comay-charcoal">Giỏ hàng của bạn</h1>
          <p className="text-gray-600 mt-2">{getCartCount()} sản phẩm</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-6 shadow-sm transition-all duration-300 ${
                  removingId === item.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link href={`/products/${item.id}`} className="relative w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden group">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/products/${item.id}`} className="font-semibold text-lg text-comay-charcoal hover:text-comay-green transition-colors">
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 capitalize">{item.collection}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        aria-label="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <input 
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') return; // Don't update for empty string to avoid weird state in context
                            const num = parseInt(val);
                            if (!isNaN(num) && num >= 1) {
                              updateQuantity(item.id, num);
                            }
                          }}
                          className="w-12 text-center font-semibold text-sm border-none focus:outline-none"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-comay-green text-lg">{formatPrice(item.price * item.quantity)}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-500">{formatPrice(item.price)} x {item.quantity}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-8 shadow-sm sticky top-24 space-y-6">
              <h2 className="text-2xl font-bold text-comay-charcoal">Tổng đơn hàng</h2>
              
              <div className="space-y-4 py-6 border-y border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-semibold">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-sm text-comay-green">Tính khi thanh toán</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold">
                <span>Tổng cộng</span>
                <span className="text-comay-green">{formatPrice(getCartTotal())}</span>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-comay-green text-white py-4 rounded-full font-semibold hover:bg-comay-green/90 transition-all hover:shadow-lg"
                >
                  Thanh toán
                </button>
                <Link
                  href="/products"
                  className="block w-full text-center border-2 border-gray-200 text-comay-charcoal py-4 rounded-full font-semibold hover:bg-gray-50 transition-all"
                >
                  Tiếp tục mua hàng
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-comay-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-comay-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  <span>Giao hàng toàn quốc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
