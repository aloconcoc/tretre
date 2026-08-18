'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import type { Order, OrderStatus } from '@/types/database';

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => (res.ok ? res.json() : { orders: [] }))
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="min-h-screen bg-comay-cream-light/30 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-comay-charcoal mb-8">Đơn hàng của tôi</h1>

        {isLoading ? (
          <div className="text-center py-16 text-gray-500">Đang tải...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm space-y-4">
            <Icon icon="solar:bag-cross-linear" className="w-16 h-16 text-gray-300 mx-auto" />
            <p className="text-gray-500 font-medium">Bạn chưa có đơn hàng nào.</p>
            <Link
              href="/products"
              className="inline-block bg-comay-green text-white px-8 py-3 rounded-full font-semibold hover:bg-comay-green/90 transition-all"
            >
              Bắt đầu mua sắm
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-mono font-bold text-comay-charcoal">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[order.status]}`}>
                    {statusLabel[order.status]}
                  </span>
                  <p className="font-bold text-comay-green text-lg">{formatPrice(order.total)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
