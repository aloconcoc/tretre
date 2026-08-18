'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import type { Voucher } from '@/types/database';

const typeLabel = {
  percentage: 'Phần trăm',
  fixed: 'Giảm cố định',
  shipping: 'Miễn ship',
};

const typeIcon = {
  percentage: 'solar:percent-bold',
  fixed: 'solar:wallet-money-bold',
  shipping: 'solar:delivery-bold',
};

const typeBg = {
  percentage: 'bg-orange-100 text-orange-700',
  fixed: 'bg-blue-100 text-blue-700',
  shipping: 'bg-green-100 text-green-700',
};

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetch('/api/vouchers')
      .then((res) => res.json())
      .then((data) => setVouchers(data.vouchers ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa voucher này?')) return;
    const res = await fetch(`/api/vouchers/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setVouchers((prev) => prev.filter((v) => v.id !== id));
    } else {
      alert('Xóa thất bại.');
    }
  };

  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesSearch =
      voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (voucher.description ?? '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && voucher.active) ||
      (filterStatus === 'inactive' && !voucher.active);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-comay-charcoal mb-2">Quản Lý Voucher</h1>
          <p className="text-gray-500">Tổng: {filteredVouchers.length} voucher</p>
        </div>
        <Link
          href="/admin/vouchers/new"
          className="flex items-center gap-2 bg-comay-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-comay-green/90 transition-colors shadow-md"
        >
          <Icon icon="solar:add-circle-bold" className="w-5 h-5" />
          Tạo Voucher
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm mã voucher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:w-64">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-500">Đang tải...</div>
      ) : (
        <>
          {/* Vouchers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all relative overflow-hidden group"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      voucher.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {voucher.active ? 'Hoạt động' : 'Tạm dừng'}
                  </div>
                </div>

                {/* Voucher Code */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-lg ${typeBg[voucher.type]}`}>
                      <Icon icon={typeIcon[voucher.type]} className="w-5 h-5" />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeBg[voucher.type]}`}>
                      {typeLabel[voucher.type]}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-comay-charcoal font-mono tracking-wider">
                    {voucher.code}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{voucher.description}</p>
                </div>

                {/* Discount Value */}
                <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Giá trị giảm</p>
                  <p className="text-2xl font-bold text-comay-green">
                    {voucher.type === 'percentage'
                      ? `${voucher.value}%`
                      : voucher.type === 'fixed'
                      ? `${voucher.value.toLocaleString('vi-VN')}₫`
                      : 'Miễn phí ship'}
                  </p>
                  {voucher.min_order_value > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Đơn tối thiểu: {voucher.min_order_value.toLocaleString('vi-VN')}₫
                    </p>
                  )}
                </div>

                {/* Usage Stats */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Đã sử dụng</span>
                    <span className="font-semibold text-comay-charcoal">
                      {voucher.used_count}/{voucher.max_uses || '∞'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-comay-green h-full rounded-full transition-all"
                      style={{
                        width: voucher.max_uses
                          ? `${Math.min(100, (voucher.used_count / voucher.max_uses) * 100)}%`
                          : '0%',
                      }}
                    />
                  </div>
                </div>

                {/* Validity Period */}
                {(voucher.valid_from || voucher.valid_until) && (
                  <div className="text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:calendar-linear" className="w-4 h-4" />
                      <span>
                        {voucher.valid_from ? new Date(voucher.valid_from).toLocaleDateString('vi-VN') : '—'}
                        {' - '}
                        {voucher.valid_until ? new Date(voucher.valid_until).toLocaleDateString('vi-VN') : '—'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Link
                    href={`/admin/vouchers/${voucher.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-semibold text-sm"
                  >
                    <Icon icon="solar:pen-bold" className="w-4 h-4" />
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(voucher.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredVouchers.length === 0 && (
            <div className="bg-white rounded-2xl p-16 border border-gray-100 text-center">
              <Icon icon="solar:ticket-linear" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Không tìm thấy voucher nào</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
