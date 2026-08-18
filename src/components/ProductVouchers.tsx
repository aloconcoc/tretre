'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { ActiveVoucherPreview } from '@/types/database';

function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function voucherLabel(v: ActiveVoucherPreview) {
  if (v.type === 'percentage') return `Giảm ${v.value}%`;
  if (v.type === 'fixed') return `Giảm ${formatPrice(v.value)}`;
  return 'Miễn phí ship';
}

export default function ProductVouchers({ price }: { price: number }) {
  const [vouchers, setVouchers] = useState<ActiveVoucherPreview[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/vouchers/active')
      .then((res) => res.json())
      .then((data) => setVouchers(data.vouchers ?? []));
  }, []);

  const applicable = vouchers.filter((v) => v.type !== 'shipping' && price >= v.min_order_value);

  const bestDiscount = applicable.reduce((max, v) => {
    const discount = v.type === 'percentage' ? Math.floor((price * v.value) / 100) : Math.min(v.value, price);
    return Math.max(max, discount);
  }, 0);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  if (vouchers.length === 0) return null;

  return (
    <div className="bg-comay-cream-light/60 rounded-2xl p-4 space-y-3">
      {bestDiscount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Giá sau voucher</span>
          <span className="text-lg font-bold text-comay-green">{formatPrice(Math.max(0, price - bestDiscount))}</span>
          <span className="text-sm text-gray-400 line-through">{formatPrice(price)}</span>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-comay-charcoal mb-2">Mã giảm giá của Shop</p>
        <div className="flex flex-wrap gap-2">
          {vouchers.map((v) => (
            <button
              key={v.code}
              type="button"
              onClick={() => handleCopy(v.code)}
              title={v.description ?? undefined}
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-dashed border-comay-green bg-white text-xs font-medium text-comay-green hover:bg-comay-green/5 transition-colors"
            >
              <span>{voucherLabel(v)}</span>
              <span className="font-mono font-bold border-l border-comay-green/30 pl-2">{v.code}</span>
              <Icon
                icon={copiedCode === v.code ? 'solar:check-circle-bold' : 'solar:copy-linear'}
                className="w-3.5 h-3.5"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
