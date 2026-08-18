'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import type { Product, Category } from '@/types/database';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'name'>('default');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []));
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []));
  }, []);

  const filteredProducts = products.filter((product) => {
    // Filter by category
    const categoryMatch = filterCategory === 'all' || product.category === filterCategory;
    
    // Filter by search term
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <>
      {/* Page Header */}
      <div className="bg-comay-cream py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-comay-charcoal mb-4">
            Thiết Kế
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Khám phá bộ sưu tập sản phẩm thủ công độc đáo từ chất liệu tự nhiên
          </p>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="sticky top-20 z-40 w-full transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
            
            {/* Left Control Group: Categories & Search */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
              {/* Category Pills */}
              <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filterCategory === 'all'
                      ? 'bg-comay-green text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-comay-charcoal'
                  }`}
                >
                  Tất cả
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setFilterCategory(category.slug)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      filterCategory === category.slug
                        ? 'bg-comay-green text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-comay-charcoal'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Vertical Divider (Desktop only) */}
              <div className="hidden md:block w-px h-8 bg-gray-200"></div>

              {/* Search Bar */}
              <div className="relative w-full md:w-64 group">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-comay-green/50 focus:border-comay-green transition-all"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2 group-focus-within:text-comay-green transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Right Control Group: Sort & Count */}
            <div className="flex items-center gap-6 w-full xl:w-auto justify-between xl:justify-end">
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 whitespace-nowrap hidden sm:inline">Sắp xếp theo:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-transparent pl-0 pr-8 py-2 text-sm font-semibold text-comay-charcoal border-none focus:ring-0 focus:outline-none cursor-pointer hover:text-comay-green transition-colors text-right"
                  >
                    <option value="default">Mặc định</option>
                    <option value="price-low">Giá: Thấp đến Cao</option>
                    <option value="price-high">Giá: Cao đến Thấp</option>
                    <option value="name">Tên: A-Z</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Product Count Badge */}
              <div className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                {sortedProducts.length} sản phẩm
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  collection={product.collection}
                  price={product.price}
                  images={product.images}
                  quantity={product.quantity}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">Không tìm thấy sản phẩm nào phù hợp.</p>
              <button 
                onClick={() => {setSearchTerm(''); setFilterCategory('all');}}
                className="mt-4 text-comay-green hover:underline font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
