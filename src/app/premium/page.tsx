import ProductCard from '@/components/ProductCard';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

export default async function PremiumPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('products').select('*').eq('premium', true);
  const premiumProducts = data ?? [];

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[500px] bg-comay-charcoal">
        <Image
          src="/images/hero/hero-4.jpg"
          alt="Premium Collection"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Premium</h1>
            <p className="text-xl md:text-2xl mb-6">Dòng Sản Phẩm Cao Cấp Thủ Công</p>
            <p className="text-lg max-w-2xl mx-auto">
              Những tác phẩm nghệ thuật thủ công tinh xảo nhất, được chế tác bởi những nghệ nhân
              hàng đầu với tâm huyết và kỹ năng truyền thống
            </p>
          </div>
        </div>
      </div>

      {/* About Premium */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-comay-charcoal mb-6">
            Đẳng Cấp Thủ Công Việt Nam
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Dòng sản phẩm Premium của TRETRE đại diện cho đỉnh cao của nghệ thuật đan lát truyền
            thống. Mỗi sản phẩm được chế tác hoàn toàn thủ công bởi những nghệ nhân giàu kinh
            nghiệm, qua nhiều công đoạn tỉ mỉ và kiểm tra chất lượng nghiêm ngặt.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Chúng tôi chọn lọc nguyên liệu tốt nhất, kết hợp với kỹ thuật đan tinh vi và hoàn thiện
            tỉ mỉ từng chi tiết. Premium Line không chỉ là sản phẩm, mà là những tác phẩm nghệ
            thuật có giá trị sưu tầm.
          </p>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-12 bg-comay-cream">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-comay-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-comay-charcoal mb-2">100% Thủ Công</h3>
              <p className="text-gray-700">
                Hoàn toàn làm thủ công, không sử dụng máy móc công nghiệp
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-comay-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-comay-charcoal mb-2">Chất Lượng Cao Cấp</h3>
              <p className="text-gray-700">
                Nguyên liệu được tuyển chọn kỹ lưỡng, kiểm tra chất lượng nghiêm ngặt
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-comay-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-comay-charcoal mb-2">Thiết Kế Độc Quyền</h3>
              <p className="text-gray-700">
                Các thiết kế độc đáo, phiên bản giới hạn hoặc theo yêu cầu
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-comay-charcoal mb-8">
            Bộ Sưu Tập Premium
          </h2>
          <div className="mb-6 text-gray-600">
            Hiển thị {premiumProducts.length} sản phẩm
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {premiumProducts.map((product) => (
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
