'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function EditVoucherPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrderValue: '',
    maxUses: '',
    validFrom: '',
    validUntil: '',
    description: '',
    active: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/vouchers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const v = data.voucher;
        if (!v) return;
        setFormData({
          code: v.code ?? '',
          type: v.type ?? 'percentage',
          value: String(v.value ?? ''),
          minOrderValue: String(v.min_order_value ?? ''),
          maxUses: String(v.max_uses ?? ''),
          validFrom: v.valid_from ? v.valid_from.slice(0, 10) : '',
          validUntil: v.valid_until ? v.valid_until.slice(0, 10) : '',
          description: v.description ?? '',
          active: v.active ?? true,
        });
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const generateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData({ ...formData, code: result });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await fetch(`/api/vouchers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: formData.code,
        type: formData.type,
        value: formData.type === 'shipping' ? 0 : Number(formData.value),
        minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : 0,
        maxUses: Number(formData.maxUses),
        validFrom: formData.validFrom || null,
        validUntil: formData.validUntil || null,
        description: formData.description,
        active: formData.active,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Cập nhật thất bại.');
      setIsSubmitting(false);
      return;
    }

    router.push('/admin/vouchers');
  };

  if (isLoading) {
    return <div className="text-center py-16 text-gray-500">Đang tải...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/vouchers"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon icon="solar:arrow-left-linear" className="w-6 h-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-comay-charcoal">Chỉnh Sửa Voucher</h1>
          <p className="text-gray-500">Cập nhật mã giảm giá</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Voucher Code */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-comay-charcoal mb-6 flex items-center gap-2">
            <Icon icon="solar:ticket-bold" className="w-5 h-5 text-comay-green" />
            Mã Voucher
          </h3>

          <div className="flex gap-3">
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors font-mono font-bold text-lg tracking-wider"
              placeholder="SUMMER2024"
            />
            <button
              type="button"
              onClick={generateCode}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              <Icon icon="solar:refresh-bold" className="w-5 h-5" />
              Tạo tự động
            </button>
          </div>
        </div>

        {/* Discount Details */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-comay-charcoal mb-6 flex items-center gap-2">
            <Icon icon="solar:percent-bold" className="w-5 h-5 text-comay-green" />
            Chi Tiết Giảm Giá
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loại Giảm Giá *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
              >
                <option value="percentage">Phần trăm (%)</option>
                <option value="fixed">Giảm cố định (VNĐ)</option>
                <option value="shipping">Miễn phí ship</option>
              </select>
            </div>

            {formData.type !== 'shipping' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giá Trị Giảm *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
                    placeholder={formData.type === 'percentage' ? '10' : '150000'}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                    {formData.type === 'percentage' ? '%' : '₫'}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giá Trị Đơn Tối Thiểu
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
                    placeholder="500000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₫</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số Lượt Sử Dụng Tối Đa *
                </label>
                <input
                  type="number"
                  required
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
                  placeholder="100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Validity Period */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-comay-charcoal mb-6 flex items-center gap-2">
            <Icon icon="solar:calendar-bold" className="w-5 h-5 text-comay-green" />
            Thời Gian Hiệu Lực
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Từ Ngày
              </label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Đến Ngày
              </label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Description & Status */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-comay-charcoal mb-6 flex items-center gap-2">
            <Icon icon="solar:info-circle-bold" className="w-5 h-5 text-comay-green" />
            Thông Tin Khác
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mô Tả
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors resize-none"
                placeholder="Voucher dành cho khách hàng mới..."
              />
            </div>

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-5 h-5 text-comay-green focus:ring-comay-green rounded"
              />
              <div>
                <p className="font-semibold text-comay-charcoal">Kích hoạt</p>
                <p className="text-sm text-gray-500">Voucher có thể sử dụng khi được bật</p>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-comay-green text-white px-8 py-3 rounded-xl font-semibold hover:bg-comay-green/90 transition-colors shadow-md disabled:opacity-60"
          >
            <Icon icon="solar:check-circle-bold" className="w-5 h-5" />
            {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>
          <Link
            href="/admin/vouchers"
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
