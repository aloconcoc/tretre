'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/database';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert('Xóa thất bại.');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.collection.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.collection === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.collection)))];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-comay-charcoal mb-2">Quản Lý Sản Phẩm</h1>
          <p className="text-gray-500">Tổng: {filteredProducts.length} sản phẩm</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-comay-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-comay-green/90 transition-colors shadow-md"
        >
          <Icon icon="solar:add-circle-bold" className="w-5 h-5" />
          Thêm Sản Phẩm
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
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="md:w-64">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-comay-green transition-colors"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.filter((c) => c !== 'all').map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-16 text-gray-500">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Sản Phẩm</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Danh Mục</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Giá</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Số Lượng</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-comay-cream flex-shrink-0">
                          {product.images[0] && (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-comay-charcoal">{product.name}</p>
                          <p className="text-sm text-gray-500">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-comay-green/10 text-comay-green rounded-full text-sm font-medium">
                        {product.collection}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-comay-charcoal">{product.price.toLocaleString('vi-VN')}₫</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:box-minimalistic-bold" className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-comay-charcoal">{product.quantity || 0}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Icon icon="solar:pen-bold" className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Icon icon="solar:box-minimalistic-linear" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
