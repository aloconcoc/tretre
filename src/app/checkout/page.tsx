'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useCart } from '@/context/cart-context';
import { bankInfo } from '@/lib/bank-info';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discountAmount: number;
    description?: string;
  } | null>(null);

  const proofInputRef = useRef<HTMLInputElement>(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState<string | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [proofError, setProofError] = useState<string | null>(null);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    paymentMethod: 'bank-transfer',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleApplyVoucher = async () => {
    if (!voucherInput.trim()) return;
    setVoucherError(null);
    setIsApplyingVoucher(true);

    const res = await fetch('/api/vouchers/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: voucherInput.trim(), subtotal: getCartTotal() }),
    });
    const data = await res.json();

    if (!res.ok) {
      setVoucherError(data.error ?? 'Mã giảm giá không hợp lệ.');
      setAppliedVoucher(null);
      setIsApplyingVoucher(false);
      return;
    }

    setAppliedVoucher({
      code: voucherInput.trim().toUpperCase(),
      discountAmount: data.discountAmount ?? 0,
      description: data.description,
    });
    setIsApplyingVoucher(false);
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput('');
    setVoucherError(null);
  };

  const orderTotal = Math.max(0, getCartTotal() - (appliedVoucher?.discountAmount ?? 0));

  useEffect(() => {
    if (formData.paymentMethod !== 'bank-transfer' || orderTotal <= 0) return;

    let cancelled = false;
    setIsLoadingQr(true);
    setQrDataUrl(null);

    fetch('/api/vietqr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: orderTotal, content: 'TRETRE' }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.qrDataUrl) setQrDataUrl(data.qrDataUrl);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingQr(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.paymentMethod, orderTotal]);

  const handleProofSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofError(null);

    if (file.size > 5 * 1024 * 1024) {
      setProofError('Ảnh tối đa 5MB.');
      return;
    }

    setIsUploadingProof(true);
    const body = new FormData();
    body.append('file', file);
    const res = await fetch('/api/upload/payment-proof', { method: 'POST', body });
    const data = await res.json();
    setIsUploadingProof(false);

    if (!res.ok) {
      setProofError(data.error ?? 'Tải ảnh lên thất bại.');
      return;
    }
    setPaymentProofUrl(data.url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.paymentMethod === 'bank-transfer' && !paymentProofUrl) {
      setError('Vui lòng tải lên ảnh chụp màn hình đã chuyển khoản.');
      return;
    }

    setIsProcessing(true);

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        ...formData,
        voucherCode: appliedVoucher?.code || null,
        paymentProofUrl,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Đặt hàng thất bại, vui lòng thử lại.');
      setIsProcessing(false);
      return;
    }

    const { orderId } = await res.json();
    clearCart();
    setIsProcessing(false);
    router.push(`/checkout/success?orderId=${orderId}`);
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-comay-cream-light/30 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-comay-charcoal">Thanh toán</h1>
          <div className="flex items-center gap-2 mt-4 text-sm">
            <Link href="/cart" className="text-comay-green hover:underline">Giỏ hàng</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Thanh toán</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-7 space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-comay-charcoal mb-6">Thông tin khách hàng</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-comay-green focus:outline-none transition-colors"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-comay-green focus:outline-none transition-colors"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-comay-green focus:outline-none transition-colors"
                      placeholder="0123456789"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-comay-charcoal mb-6">Địa chỉ giao hàng</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-comay-green focus:outline-none transition-colors"
                      placeholder="Số nhà, tên đường"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tỉnh/Thành phố <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-comay-green focus:outline-none transition-colors"
                        placeholder="Hà Nội"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Quận/Huyện <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-comay-green focus:outline-none transition-colors"
                        placeholder="Ba Đình"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phường/Xã <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-comay-green focus:outline-none transition-colors"
                        placeholder="Cống Vị"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-comay-charcoal mb-6">Phương thức thanh toán</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-comay-green transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="w-5 h-5 text-comay-green"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-comay-charcoal">Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-comay-green transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank-transfer"
                      checked={formData.paymentMethod === 'bank-transfer'}
                      onChange={handleChange}
                      className="w-5 h-5 text-comay-green"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-comay-charcoal">Chuyển khoản ngân hàng</p>
                      <p className="text-sm text-gray-500">Chuyển khoản trước khi giao hàng</p>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === 'bank-transfer' && (
                  <div className="mt-4 p-6 bg-comay-cream-light/50 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                      <div className="flex-shrink-0 space-y-2">
                        <button
                          type="button"
                          onClick={() => setIsQrOpen(true)}
                          disabled={isLoadingQr}
                          className="relative w-40 h-40 rounded-xl overflow-hidden border border-gray-200 bg-white group block"
                        >
                          {isLoadingQr ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Icon icon="solar:spinner-linear" className="w-6 h-6 text-gray-400 animate-spin" />
                            </div>
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={qrDataUrl ?? bankInfo.qrImage}
                              alt="Mã QR chuyển khoản"
                              className="w-full h-full object-contain"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <Icon
                              icon="solar:magnifer-zoom-in-linear"
                              className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow"
                            />
                          </div>
                        </button>
                        <p className="text-xs text-gray-400 text-center">
                          {qrDataUrl ? 'Số tiền đã được nhúng sẵn trong mã QR' : 'Nhấn vào ảnh để phóng to'}
                        </p>
                      </div>
                      <div className="text-sm space-y-1.5 text-center sm:text-left">
                        <p className="text-gray-500">Ngân hàng</p>
                        <p className="font-semibold text-comay-charcoal mb-2">{bankInfo.bankName}</p>
                        <p className="text-gray-500">Số tài khoản</p>
                        <p className="font-semibold text-comay-charcoal font-mono mb-2">{bankInfo.accountNumber}</p>
                        <p className="text-gray-500">Chủ tài khoản</p>
                        <p className="font-semibold text-comay-charcoal">{bankInfo.accountHolder}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ảnh chụp màn hình đã chuyển khoản <span className="text-red-500">*</span>
                      </label>

                      {paymentProofUrl ? (
                        <div className="flex items-center gap-4">
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                            <Image src={paymentProofUrl} alt="Bằng chứng chuyển khoản" fill className="object-cover" />
                          </div>
                          <button
                            type="button"
                            onClick={() => setPaymentProofUrl(null)}
                            className="text-sm text-red-500 hover:underline font-medium"
                          >
                            Tải ảnh khác
                          </button>
                        </div>
                      ) : (
                        <>
                          <input
                            ref={proofInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={handleProofSelect}
                          />
                          <button
                            type="button"
                            onClick={() => proofInputRef.current?.click()}
                            disabled={isUploadingProof}
                            className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-comay-green transition-colors disabled:opacity-60"
                          >
                            <Icon
                              icon={isUploadingProof ? 'solar:spinner-linear' : 'solar:cloud-upload-linear'}
                              className={`w-5 h-5 ${isUploadingProof ? 'animate-spin' : ''}`}
                            />
                            {isUploadingProof ? 'Đang tải lên...' : 'Chọn ảnh (JPG, PNG, WEBP, tối đa 5MB)'}
                          </button>
                        </>
                      )}
                      {proofError && <p className="text-sm text-red-500 mt-2">{proofError}</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-comay-charcoal mb-6">Ghi chú đơn hàng</h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-comay-green focus:outline-none transition-colors resize-none"
                  placeholder="Ghi chú thêm cho đơn hàng của bạn (nếu có)..."
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-8 shadow-sm sticky top-24 space-y-6">
                <h2 className="text-2xl font-bold text-comay-charcoal">Đơn hàng của bạn</h2>

                {/* Order Items */}
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-comay-green text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-comay-charcoal">{item.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{item.collection}</p>
                      </div>
                      <p className="font-semibold text-comay-green">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Voucher Code */}
                <div className="space-y-2">
                  {appliedVoucher ? (
                    <div className="flex items-center justify-between bg-comay-green/10 rounded-2xl px-4 py-3">
                      <div>
                        <p className="font-semibold text-comay-green font-mono">{appliedVoucher.code}</p>
                        {appliedVoucher.description && (
                          <p className="text-xs text-gray-500">{appliedVoucher.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveVoucher}
                        className="text-sm text-gray-500 hover:text-red-500 font-medium"
                      >
                        Xóa
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherInput}
                        onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                        placeholder="Nhập mã giảm giá"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-comay-green focus:outline-none transition-colors font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleApplyVoucher}
                        disabled={isApplyingVoucher || !voucherInput.trim()}
                        className="px-5 py-3 bg-comay-charcoal text-white rounded-2xl font-semibold hover:bg-comay-charcoal/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {isApplyingVoucher ? '...' : 'Áp dụng'}
                      </button>
                    </div>
                  )}
                  {voucherError && <p className="text-sm text-red-500">{voucherError}</p>}
                </div>

                <div className="space-y-4 py-6 border-y border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span className="font-semibold">{formatPrice(getCartTotal())}</span>
                  </div>
                  {appliedVoucher && appliedVoucher.discountAmount > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Giảm giá ({appliedVoucher.code})</span>
                      <span className="font-semibold text-red-500">-{formatPrice(appliedVoucher.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="text-sm text-comay-green">Miễn phí</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-comay-green">{formatPrice(orderTotal)}</span>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm rounded-2xl px-4 py-3">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-comay-green text-white py-4 rounded-full font-semibold hover:bg-comay-green/90 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    'Đặt hàng'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Bằng việc đặt hàng, bạn đồng ý với{' '}
                  <Link href="/chinh-sach-bao-hanh" className="text-comay-green hover:underline">
                    Chính sách bảo hành
                  </Link>{' '}
                  của chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {isQrOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsQrOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full animate-scale-in">
            <button
              type="button"
              onClick={() => setIsQrOpen(false)}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 z-10 bg-white/80 rounded-full transition-colors"
            >
              <Icon icon="solar:close-circle-linear" className="w-6 h-6" />
            </button>
            <div className="relative w-full aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl ?? bankInfo.qrImage}
                alt="Mã QR chuyển khoản"
                className="w-full h-full object-contain"
              />
            </div>
            {qrDataUrl && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Số tiền {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderTotal)}{' '}
                đã được nhúng sẵn trong mã QR.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
