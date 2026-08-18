'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Icon } from '@iconify/react';

interface ProductQuickViewProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickView({ productId, isOpen, onClose }: ProductQuickViewProps) {
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (isOpen && productId) {
      fetch(`/api/products/${productId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setProduct(data?.product ?? null));
      setQuantity(1);
      setActiveImage(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, productId]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        collection: product.collection,
      },
      quantity
    );
    onClose();
  };

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10 bg-white/80 rounded-full transition-colors"
        >
          <Icon icon="solar:close-circle-linear" className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Images */}
          <div className="bg-comay-cream-light p-6 md:p-8 flex flex-col gap-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === idx ? 'border-comay-green' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="p-6 md:p-8 flex flex-col h-full bg-white">
            <div className="flex-1 space-y-6">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-comay-green mb-2 block">
                  {product.collection}
                </span>
                <Link href={`/products/${product.id}`} className="hover:text-comay-green transition-colors">
                  <h2 className="text-2xl font-bold text-comay-charcoal mb-2">{product.name}</h2>
                </Link>
                <p className="text-xl font-bold text-comay-charcoal">{formattedPrice}</p>
              </div>

              {product.description && (
                <p className="text-gray-600 italic leading-relaxed">
                  &quot;{product.description}&quot;
                </p>
              )}

              {/* Specs (Simplified) */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-600">
                {product.material && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Chất liệu:</span>
                    <span>{product.material}</span>
                  </div>
                )}
                {product.specifications?.dimensions && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Kích thước:</span>
                    <span>{product.specifications.dimensions}</span>
                  </div>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="pt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700">Số lượng:</span>
                  <div className="flex items-center border border-gray-200 rounded-full h-10">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-comay-green transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-comay-green transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-comay-green text-white py-3 rounded-full font-semibold hover:bg-comay-green/90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Icon icon="solar:bag-linear" className="w-5 h-5" />
                    Thêm vào giỏ
                  </button>
                  <Link
                    href={`/products/${product.id}`}
                    className="px-4 py-3 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 font-medium transition-colors flex items-center justify-center"
                    title="Xem chi tiết đầy đủ"
                  >
                    <Icon icon="solar:arrow-right-linear" className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
