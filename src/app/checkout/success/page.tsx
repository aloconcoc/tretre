'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Order, OrderItem } from '@/types/database';

function OrderDetails({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setOrder(data.order);
          setItems(data.items ?? []);
        }
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (loading) return null;
  if (!order) return null;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm space-y-4 text-left">
      <h2 className="text-xl font-bold text-comay-charcoal mb-4">Mã đơn hàng: #{order.id.slice(0, 8).toUpperCase()}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-gray-600">
            <span>
              {item.product_name} × {item.quantity}
            </span>
            <span className="font-semibold text-comay-charcoal">{formatPrice(item.line_total)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tạm tính</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>Giảm giá {order.voucher_code ? `(${order.voucher_code})` : ''}</span>
            <span className="text-red-500">-{formatPrice(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-comay-charcoal">
          <span>Tổng cộng</span>
          <span className="text-comay-green">{formatPrice(order.total)}</span>
        </div>
      </div>
      <div className="text-sm text-gray-500 pt-2">
        Giao đến: {order.address}, {order.ward}, {order.district}, {order.city}
      </div>
    </div>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-comay-cream-light/30 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Success Icon */}
          <div className="w-24 h-24 mx-auto bg-comay-green rounded-full flex items-center justify-center animate-scale-in">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <div className="space-y-4 animate-slide-up">
            <h1 className="text-4xl font-bold text-comay-charcoal">Đặt hàng thành công!</h1>
            <p className="text-lg text-gray-600">
              Cảm ơn bạn đã đặt hàng tại TRETRE. Chúng tôi đã nhận được đơn hàng và sẽ liên hệ với bạn trong thời gian sớm nhất.
            </p>
          </div>

          {orderId && <OrderDetails orderId={orderId} />}

          {/* Order Info */}
          <div className="bg-white rounded-3xl p-8 shadow-sm space-y-4 text-left">
            <h2 className="text-xl font-bold text-comay-charcoal mb-4">Thông tin đơn hàng</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-comay-green mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-comay-charcoal">Chúng tôi sẽ gửi thông tin đơn hàng qua email</p>
                  <p className="text-sm">Vui lòng kiểm tra hộp thư của bạn</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-comay-green mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <div>
                  <p className="font-semibold text-comay-charcoal">Nhân viên sẽ liên hệ để xác nhận đơn hàng</p>
                  <p className="text-sm">Trong vòng 24 giờ làm việc</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-comay-green mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <div>
                  <p className="font-semibold text-comay-charcoal">Thời gian giao hàng dự kiến</p>
                  <p className="text-sm">2-5 ngày làm việc (tùy khu vực)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/products"
              className="inline-block bg-comay-green text-white px-8 py-4 rounded-full font-semibold hover:bg-comay-green/90 transition-all hover:shadow-lg"
            >
              Tiếp tục mua sắm
            </Link>
            <div>
              <Link href="/" className="text-comay-green hover:underline font-medium">
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
