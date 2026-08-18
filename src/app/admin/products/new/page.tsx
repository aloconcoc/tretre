'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Category } from '@/types/database';

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const descFileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    collection: '',
    category: '',
    price: '',
    description: '',
    longDescription: '',
    material: '',
    quantity: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [descriptionImages, setDescriptionImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingDescImages, setIsUploadingDescImages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = async (
    files: File[],
    onUploaded: (url: string) => void,
    setUploading: (v: boolean) => void
  ) => {
    setError(null);
    setUploading(true);
    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          setError(`Ảnh "${file.name}" vượt quá 5MB.`);
          continue;
        }
        const body = new FormData();
        body.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Tải ảnh lên thất bại.');
          continue;
        }
        onUploaded(data.url);
      }
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []));
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    await uploadFiles(files, (url) => setImages((prev) => [...prev, url]), setIsUploading);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDescFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    await uploadFiles(files, (url) => setDescriptionImages((prev) => [...prev, url]), setIsUploadingDescImages);
    if (descFileInputRef.current) descFileInputRef.current.value = '';
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  const removeDescImage = (url: string) => {
    setDescriptionImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (images.length === 0) {
      setError('Vui lòng tải lên ít nhất 1 hình ảnh.');
      return;
    }

    setIsSubmitting(true);
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        collection: formData.collection,
        category: formData.category,
        price: Number(formData.price),
        description: formData.description,
        longDescription: formData.longDescription,
        material: formData.material,
        quantity: Number(formData.quantity),
        images,
        descriptionImages,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Tạo sản phẩm thất bại.');
      setIsSubmitting(false);
      return;
    }

    router.push('/admin/products');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon icon="solar:arrow-left-linear" className="w-6 h-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-comay-charcoal">Thêm Sản Phẩm Mới</h1>
          <p className="text-gray-500">Điền thông tin sản phẩm</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-comay-charcoal mb-6 flex items-center gap-2">
            <Icon icon="solar:info-circle-bold" className="w-5 h-5 text-comay-green" />
            Thông Tin Cơ Bản
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên Sản Phẩm *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
                placeholder="VD: Túi Xách Lục Bình Premium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bộ Sưu Tập *
                </label>
                <input
                  type="text"
                  required
                  value={formData.collection}
                  onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
                  placeholder="VD: Bông Lúa Collection"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Danh Mục *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-xs text-gray-400 mt-2">
                    Chưa có danh mục nào —{' '}
                    <Link href="/admin/categories" className="text-comay-green hover:underline">
                      tạo danh mục
                    </Link>{' '}
                    trước.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Giá (VNĐ) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                onWheel={(e) => e.currentTarget.blur()}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
                placeholder="1000000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mô Tả Ngắn
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors resize-none"
                placeholder="1-2 câu tóm tắt, hiện ngay dưới tên sản phẩm..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mô Tả Chi Tiết
              </label>
              <textarea
                rows={8}
                value={formData.longDescription}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors resize-none"
                placeholder="Mô tả đầy đủ, xuống dòng để tách đoạn — hiển thị ở mục &quot;Mô tả chi tiết&quot; trên trang sản phẩm, cùng với ảnh mô tả bên dưới."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Chất Liệu
              </label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
                placeholder="VD: Lục bình, tre, cói"
              />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-comay-charcoal mb-6 flex items-center gap-2">
            <Icon icon="solar:box-minimalistic-bold" className="w-5 h-5 text-comay-green" />
            Kho Hàng
          </h3>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Số Lượng *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              onWheel={(e) => e.currentTarget.blur()}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
              placeholder="VD: 50"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-comay-charcoal mb-6 flex items-center gap-2">
            <Icon icon="solar:gallery-bold" className="w-5 h-5 text-comay-green" />
            Hình Ảnh Sản Phẩm *
          </h3>

          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mb-4">
              {images.map((url) => (
                <div key={url} className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                  <Image src={url} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon icon="solar:close-circle-bold" className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-comay-green transition-colors cursor-pointer"
          >
            {isUploading ? (
              <Icon icon="solar:spinner-linear" className="w-12 h-12 text-comay-green mx-auto mb-4 animate-spin" />
            ) : (
              <Icon icon="solar:cloud-upload-linear" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            )}
            <p className="text-gray-600 font-medium mb-2">
              {isUploading ? 'Đang tải lên...' : 'Kéo thả hoặc nhấn để tải ảnh lên'}
            </p>
            <p className="text-sm text-gray-400">PNG, JPG, WEBP (tối đa 5MB)</p>
          </div>
        </div>

        {/* Description Images */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-comay-charcoal mb-2 flex items-center gap-2">
            <Icon icon="solar:gallery-wide-bold" className="w-5 h-5 text-comay-green" />
            Ảnh Mô Tả Chi Tiết
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Hiển thị dạng cuộn dọc trong mục &quot;Mô tả chi tiết&quot; trên trang sản phẩm (giống Shopee) — ảnh cận cảnh chất liệu, hướng dẫn sử dụng, bảng kích thước...
          </p>

          {descriptionImages.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mb-4">
              {descriptionImages.map((url) => (
                <div key={url} className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                  <Image src={url} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeDescImage(url)}
                    className="absolute top-1 right-1 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon icon="solar:close-circle-bold" className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={descFileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            className="hidden"
            onChange={handleDescFileSelect}
          />
          <div
            onClick={() => descFileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-comay-green transition-colors cursor-pointer"
          >
            {isUploadingDescImages ? (
              <Icon icon="solar:spinner-linear" className="w-10 h-10 text-comay-green mx-auto mb-3 animate-spin" />
            ) : (
              <Icon icon="solar:cloud-upload-linear" className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            )}
            <p className="text-gray-600 font-medium text-sm">
              {isUploadingDescImages ? 'Đang tải lên...' : 'Nhấn để tải ảnh mô tả (không bắt buộc)'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="flex items-center gap-2 bg-comay-green text-white px-8 py-3 rounded-xl font-semibold hover:bg-comay-green/90 transition-colors shadow-md disabled:opacity-60"
          >
            <Icon icon="solar:check-circle-bold" className="w-5 h-5" />
            {isSubmitting ? 'Đang tạo...' : 'Tạo Sản Phẩm'}
          </button>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
