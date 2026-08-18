'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';

import ImageGallery from '@/components/ImageGallery';
import ProductInfo from '@/components/ProductInfo';
import ProductVouchers from '@/components/ProductVouchers';
import ContactCTA from '@/components/ContactCTA';
import RelatedProducts from '@/components/RelatedProducts';
import ProductDescription from '@/components/ProductDescription';
import ProductReviews from '@/components/ProductReviews';
import { useCart } from '@/context/cart-context';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProduct(data?.product ?? null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

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
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-4 z-50 animate-slide-up">
          <div className="bg-comay-green text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Đã thêm vào giỏ hàng!</span>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-6">
        <div className="text-sm text-gray-500 font-inter p-4">
          <Link href="/products" className="hover:text-comay-green transition-colors">
            Sản phẩm
          </Link>
          <span className="mx-2">/</span>
          <span className="text-comay-charcoal font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7">
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Product Info */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <ProductInfo product={product} />
              <ProductVouchers price={product.price} />
              
              <div className="pt-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  {/* Quantity Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-comay-charcoal block">Số lượng</label>
                    <div className="flex items-center border-[1.5px] border-gray-200 rounded-full h-[52px] bg-white">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-comay-green hover:bg-gray-50 rounded-l-full transition-colors"
                        disabled={quantity <= 1}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={quantity}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            // @ts-ignore
                            setQuantity('');
                            return;
                          }
                          const num = parseInt(val);
                          if (!isNaN(num)) {
                            setQuantity(Math.max(1, num));
                          }
                        }}
                        onBlur={(e) => {
                          const val = parseInt(e.target.value);
                          if (isNaN(val) || val < 1) {
                            setQuantity(1);
                          }
                        }}
                        className="w-12 text-center border-none focus:outline-none font-semibold text-comay-charcoal h-full bg-transparent"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-comay-green hover:bg-gray-50 rounded-r-full transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex-1 flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 border-[1.5px] border-comay-green text-comay-green h-[52px] px-4 rounded-full font-bold hover:bg-comay-green hover:text-white transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
                    >
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="hidden sm:inline">Thêm vào giỏ</span>
                      <span className="sm:hidden">Thêm</span>
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 bg-comay-green text-white h-[52px] px-6 rounded-full font-bold hover:bg-comay-green/90 hover:shadow-lg transition-all duration-300 whitespace-nowrap text-sm sm:text-base"
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>

              {/* <ContactCTA /> */}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Description */}
      <div className="container mx-auto px-4 mt-4">
        <ProductDescription longDescription={product.long_description} images={product.description_images} />
      </div>

      {/* Reviews */}
      <div className="container mx-auto px-4 mt-4">
        <ProductReviews productId={product.id} />
      </div>

      {/* Related Products */}
      <div className="container mx-auto px-4 mt-4">
        <RelatedProducts currentProductId={product.id} collection={product.collection} category={product.category} />
      </div>
    </div>
  );
}
