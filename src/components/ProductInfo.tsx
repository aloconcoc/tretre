'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface ProductSpecifications {
  weight?: string;
  dimensions?: string;
  color?: string;
  handleType?: string;
}

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    collection: string;
    price: number;
    specifications?: ProductSpecifications;
    material?: string;
    description?: string; // Short description
    sold_count?: number;
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [rating, setRating] = useState<{ average: number; count: number } | null>(null);

  useEffect(() => {
    fetch(`/api/products/${product.id}/reviews`)
      .then((res) => res.json())
      .then((data) => setRating({ average: data.average ?? 0, count: data.count ?? 0 }));
  }, [product.id]);

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price);

  return (
    <div className="flex flex-col gap-6 font-inter">
      {/* Header */}
      <div>
        <span className="text-sm font-semibold uppercase tracking-wider text-comay-green mb-2 block">
          {product.collection}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-comay-charcoal mb-3">
          {product.name}
        </h1>

        {/* Rating + sold count */}
        {rating && (rating.count > 0 || (product.sold_count ?? 0) > 0) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-3">
            {rating.count > 0 && (
              <span className="flex items-center gap-1">
                <Icon icon="solar:star-bold" className="w-4 h-4 text-yellow-400" />
                <span className="font-semibold text-comay-charcoal">{rating.average.toFixed(1)}</span>
                <span>({rating.count} đánh giá)</span>
              </span>
            )}
            {rating.count > 0 && (product.sold_count ?? 0) > 0 && <span className="text-gray-300">|</span>}
            {(product.sold_count ?? 0) > 0 && <span>Đã bán {product.sold_count}</span>}
          </div>
        )}

        <p className="text-2xl font-bold text-comay-charcoal">
          {formattedPrice}
        </p>
      </div>

      {/* Short Description */}
      {product.description && (
        <div className="text-gray-600 leading-relaxed italic">
          &quot;{product.description}&quot;
        </div>
      )}

      {/* Specifications */}
      <div className="border-t border-b border-gray-200 py-6 my-2">
        <ul className="space-y-3 text-sm text-gray-700">
          {product.material && (
            <li className="flex items-start">
              <span className="font-semibold w-24">Chất liệu:</span>
              <span>{product.material}</span>
            </li>
          )}
          {product.specifications?.weight && (
            <li className="flex items-start">
              <span className="font-semibold w-24">Khối lượng:</span>
              <span>{product.specifications.weight}</span>
            </li>
          )}
          {product.specifications?.dimensions && (
            <li className="flex items-start">
              <span className="font-semibold w-24">Kích thước:</span>
              <span>{product.specifications.dimensions}</span>
            </li>
          )}
          {product.specifications?.color && (
            <li className="flex items-start">
              <span className="font-semibold w-24">Màu sắc:</span>
              <span>{product.specifications.color}</span>
            </li>
          )}
          {product.specifications?.handleType && (
            <li className="flex items-start">
              <span className="font-semibold w-24">Tay cầm:</span>
              <span>{product.specifications.handleType}</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
