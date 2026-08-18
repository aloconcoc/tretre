'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import ProductQuickView from './ProductQuickView';

interface ProductCardProps {
  id: string;
  name: string;
  collection: string;
  price: number;
  images: string[];
  quantity: number;
}

export default function ProductCard({
  id,
  name,
  collection,
  price,
  images,
  quantity,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    setIsAdding(true);
    addToCart({
      id,
      name,
      price,
      images,
      collection,
    });
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <Link href={`/products/${id}`} className="group block relative">
        <div className="card-hover">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-comay-cream mb-4 image-overlay group">
            <Image
              src={images[0]}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Hover Actions Overlay */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-20 px-4">
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
                  isAdding 
                    ? 'bg-comay-green text-white' 
                    : 'bg-white text-comay-charcoal'
                }`}
                title="Thêm vào giỏ"
              >
                {isAdding ? (
                  <Icon icon="solar:check-circle-linear" className="w-5 h-5" />
                ) : (
                  <Icon icon="solar:cart-plus-linear" className="w-5 h-5" />
                )}
              </button>

              {/* Preview Button */}
              <button
                onClick={handleQuickView}
                className="w-10 h-10 rounded-full bg-white text-comay-charcoal flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                title="Xem nhanh"
              >
                <Icon icon="solar:eye-linear" className="w-5 h-5" />
              </button>
            </div>

            {/* Quantity Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-white/90 backdrop-blur-sm text-comay-charcoal text-xs px-3 py-1 rounded-full font-semibold shadow-sm border border-gray-100 flex items-center gap-1">
                <Icon icon="solar:box-minimalistic-bold" className="w-3 h-3 text-comay-green" />
                SL: {quantity}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-1">
            <p className="text-sm text-comay-green font-medium">{collection}</p>
            <h3 className="font-semibold text-comay-charcoal group-hover:text-comay-green transition-colors">
              {name}
            </h3>
            <p className="text-lg font-bold text-comay-charcoal">{formattedPrice}</p>
          </div>
        </div>
      </Link>

      <ProductQuickView 
        productId={id}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
