'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import type { Order, OrderItem, OrderStatus } from '@/types/database';

const statusLabel: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipped: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

const statusColor: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const paymentLabel: Record<string, string> = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  'bank-transfer': 'Chuyển khoản ngân hàng',
};

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setOrder(data.order);
          setItems(data.items ?? []);
        }
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500">Đang tải...</div>;
  }

  if (!order) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-500 font-medium">Không tìm thấy đơn hàng này.</p>
        <Link href="/orders" className="text-comay-green hover:underline font-medium">
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-comay-cream-light/30 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/orders" className="text-comay-green hover:underline">Đơn hàng của tôi</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600 font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-comay-charcoal font-mono">
                #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-sm text-gray-500">
                Đặt lúc {new Date(order.created_at).toLocaleString('vi-VN')}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor[order.status]}`}>
              {statusLabel[order.status]}
            </span>
          </div>

          {/* Items */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-comay-cream flex-shrink-0">
                  {item.product_image && (
                    <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-comay-charcoal">{item.product_name}</p>
                  <p className="text-sm text-gray-500">
                    {formatPrice(item.unit_price)} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-comay-charcoal">{formatPrice(item.line_total)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
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
            <div className="flex justify-between text-sm text-gray-600">
              <span>Phí vận chuyển</span>
              <span>{order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : 'Miễn phí'}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-comay-charcoal pt-2 border-t border-gray-100">
              <span>Tổng cộng</span>
              <span className="text-comay-green">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="border-t border-gray-100 pt-6 space-y-3 text-sm">
            <h3 className="font-bold text-comay-charcoal">Thông tin giao hàng</h3>
            <div className="text-gray-600 space-y-1">
              <p>{order.full_name} · {order.phone}</p>
              <p>{order.address}, {order.ward}, {order.district}, {order.city}</p>
              <p>{paymentLabel[order.payment_method]}</p>
              {order.notes && <p className="italic">Ghi chú: {order.notes}</p>}
            </div>
          </div>

          {order.payment_proof_url && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-bold text-comay-charcoal text-sm mb-2">Ảnh chuyển khoản đã gửi</h3>
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
                <Image src={order.payment_proof_url} alt="Bằng chứng chuyển khoản" fill className="object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
