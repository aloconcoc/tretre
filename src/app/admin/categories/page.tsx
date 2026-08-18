'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { Category } from '@/types/database';

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCategories = () => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Tạo danh mục thất bại.');
      setIsSubmitting(false);
      return;
    }

    setName('');
    setSlug('');
    setSlugTouched(false);
    setIsSubmitting(false);
    loadCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa danh mục này? Sản phẩm đang thuộc danh mục này sẽ chuyển về "chưa phân loại".')) return;
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert('Xóa thất bại.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-comay-charcoal mb-2">Quản Lý Danh Mục</h1>
        <p className="text-gray-500">Danh mục dùng để phân loại sản phẩm trên trang khách hàng</p>
      </div>

      {/* Create form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-comay-charcoal mb-4 flex items-center gap-2">
          <Icon icon="solar:add-circle-bold" className="w-5 h-5 text-comay-green" />
          Thêm Danh Mục Mới
        </h3>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Tên danh mục (VD: Đồ trang trí Tết)"
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
          />
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="slug (vd: do-trang-tri-tet)"
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors font-mono text-sm"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 bg-comay-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-comay-green/90 transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {isSubmitting ? 'Đang thêm...' : 'Thêm'}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-16 text-gray-500">Đang tải...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-gray-500">Chưa có danh mục nào</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Tên</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Slug</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-comay-charcoal">{category.name}</td>
                  <td className="py-4 px-6 font-mono text-sm text-gray-500">{category.slug}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
