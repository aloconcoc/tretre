'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
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

const FLOW_STEPS: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'completed'];

function OrderStatusStepper({
  status,
  onChange,
  disabled,
}: {
  status: OrderStatus;
  onChange: (status: OrderStatus) => void;
  disabled: boolean;
}) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
          <Icon icon="solar:close-circle-bold" className="w-5 h-5" />
          Đơn hàng đã bị hủy
        </div>
        <button
          type="button"
          onClick={() => onChange('pending')}
          disabled={disabled}
          className="text-sm text-gray-500 hover:text-comay-green underline disabled:opacity-60"
        >
          Khôi phục đơn
        </button>
      </div>
    );
  }

  const currentIndex = FLOW_STEPS.indexOf(status);

  return (
    <div>
      <div className="flex items-start">
        {FLOW_STEPS.map((step, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => onChange(step)}
                disabled={disabled || isCurrent}
                className="flex flex-col items-center gap-2 group w-20"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                    isDone
                      ? 'bg-comay-green border-comay-green text-white'
                      : isCurrent
                      ? 'bg-comay-green border-comay-green text-white ring-4 ring-comay-green/20'
                      : `bg-white border-gray-300 text-gray-400 ${disabled ? '' : 'group-hover:border-comay-green group-hover:text-comay-green cursor-pointer'}`
                  }`}
                >
                  {isDone ? (
                    <Icon icon="solar:check-bold" className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">{i + 1}</span>
                  )}
                </div>
                <span
                  className={`text-xs font-medium text-center leading-tight ${
                    isCurrent ? 'text-comay-charcoal font-bold' : isDone ? 'text-comay-charcoal' : 'text-gray-400'
                  }`}
                >
                  {statusLabel[step]}
                </span>
              </button>
              {i < FLOW_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 mt-[18px] ${i < currentIndex ? 'bg-comay-green' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => onChange('cancelled')}
          disabled={disabled}
          className="text-sm text-red-500 hover:text-red-600 hover:underline font-medium disabled:opacity-60"
        >
          Hủy đơn hàng
        </button>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleStatusChange = async (status: OrderStatus) => {
    if (!order) return;
    setError(null);
    setIsUpdating(true);

    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Cập nhật trạng thái thất bại.');
      setIsUpdating(false);
      return;
    }

    const data = await res.json();
    setOrder(data.order);
    setIsUpdating(false);
  };

  if (isLoading) {
    return <div className="text-center py-16 text-gray-500">Đang tải...</div>;
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 font-medium">Không tìm thấy đơn hàng.</p>
        <Link href="/admin/orders" className="text-comay-green hover:underline font-medium">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Icon icon="solar:arrow-left-linear" className="w-6 h-6 text-gray-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-comay-charcoal font-mono">
              #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[order.status]}`}>
              {statusLabel[order.status]}
            </span>
          </div>
          <p className="text-gray-500">
            Đặt lúc {new Date(order.created_at).toLocaleString('vi-VN')}
          </p>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}

      {/* Status */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-comay-charcoal mb-4 flex items-center gap-2">
          <Icon icon="solar:clock-circle-bold" className="w-5 h-5 text-comay-green" />
          Trạng Thái Đơn Hàng
        </h3>
        <OrderStatusStepper status={order.status} onChange={handleStatusChange} disabled={isUpdating} />
      </div>

      {/* Customer & Shipping */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-comay-charcoal mb-4 flex items-center gap-2">
          <Icon icon="solar:user-bold" className="w-5 h-5 text-comay-green" />
          Thông Tin Khách Hàng
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Họ tên</p>
            <p className="font-semibold text-comay-charcoal">{order.full_name}</p>
          </div>
          <div>
            <p className="text-gray-500">Số điện thoại</p>
            <p className="font-semibold text-comay-charcoal">{order.phone}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold text-comay-charcoal">{order.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Phương thức thanh toán</p>
            <p className="font-semibold text-comay-charcoal">{paymentLabel[order.payment_method]}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500">Địa chỉ giao hàng</p>
            <p className="font-semibold text-comay-charcoal">
              {order.address}, {order.ward}, {order.district}, {order.city}
            </p>
          </div>
          {order.notes && (
            <div className="md:col-span-2">
              <p className="text-gray-500">Ghi chú</p>
              <p className="font-semibold text-comay-charcoal">{order.notes}</p>
            </div>
          )}
        </div>

        {order.payment_proof_url && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-gray-500 text-sm mb-2">Ảnh chụp màn hình chuyển khoản</p>
            <a href={order.payment_proof_url} target="_blank" rel="noopener noreferrer">
              <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-gray-200 hover:opacity-90 transition-opacity">
                <Image src={order.payment_proof_url} alt="Bằng chứng chuyển khoản" fill className="object-cover" />
              </div>
            </a>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-comay-charcoal mb-4 flex items-center gap-2">
          <Icon icon="solar:bag-4-bold" className="w-5 h-5 text-comay-green" />
          Sản Phẩm
        </h3>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-comay-cream flex-shrink-0">
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

        <div className="border-t border-gray-100 mt-6 pt-4 space-y-2">
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
      </div>
    </div>
  );
}
