'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types/database';

interface RelatedProductsProps {
  currentProductId: string;
  collection: string;
  category?: string;
}

export default function RelatedProducts({ currentProductId, collection, category }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async (params: Record<string, string>) => {
      const res = await fetch(`/api/products?${new URLSearchParams(params)}`);
      const data = await res.json();
      return (data.products ?? []) as Product[];
    };

    (async () => {
      // Same collection first; if that free-text field is unique to this
      // product (e.g. a brand-new admin-created one), fall back to same
      // category, then to any other products — so the section never just
      // silently disappears.
      let results = await fetchProducts({ collection, excludeId: currentProductId, limit: '4' });

      if (results.length === 0 && category) {
        results = await fetchProducts({ category, excludeId: currentProductId, limit: '4' });
      }
      if (results.length === 0) {
        results = await fetchProducts({ excludeId: currentProductId, limit: '4' });
      }

      if (!cancelled) setRelatedProducts(results);
    })();

    return () => {
      cancelled = true;
    };
  }, [collection, category, currentProductId]);

  if (relatedProducts.length === 0) return null;

  return (
    <div className="py-16 border-t border-gray-100">
      <h2 className="text-2xl font-bold text-comay-charcoal uppercase mb-8 text-center">
        Sản phẩm tương tự
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
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
    </div>
  );
}
