'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | OrderStatus>('all');

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-comay-charcoal mb-2">Quản Lý Đơn Hàng</h1>
        <p className="text-gray-500">Tổng: {filteredOrders.length} đơn hàng</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên, SĐT hoặc mã đơn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
              />
            </div>
          </div>
          <div className="md:w-64">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | OrderStatus)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
            >
              <option value="all">Tất cả trạng thái</option>
              {(Object.keys(statusLabel) as OrderStatus[]).map((status) => (
                <option key={status} value={status}>
                  {statusLabel[status]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-16 text-gray-500">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Mã Đơn</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Khách Hàng</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Ngày Đặt</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Tổng Tiền</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Trạng Thái</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm font-semibold text-comay-charcoal">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-comay-charcoal">{order.full_name}</p>
                      <p className="text-sm text-gray-500">{order.phone}</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-comay-charcoal">{formatPrice(order.total)}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[order.status]}`}>
                        {statusLabel[order.status]}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Icon icon="solar:eye-bold" className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <Icon icon="solar:bag-cross-linear" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Không có đơn hàng nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
