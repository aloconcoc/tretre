import ProductCard from '@/components/ProductCard';
import { createClient } from '@/lib/supabase/server';

export default async function BestSellersPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('products').select('*').eq('bestseller', true);
  const bestSellers = data ?? [];

  return (
    <>
      {/* Page Header */}
      <div className="bg-comay-cream py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-comay-charcoal mb-4">
            Best-Sellers
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Những sản phẩm được yêu thích nhất từ COMAY
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto">
          <div className="mb-6 text-gray-600">
            Hiển thị {bestSellers.length} sản phẩm bán chạy nhất
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
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
      </section>
    </>
  );
}
