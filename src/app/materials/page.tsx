import MaterialCard from '@/components/MaterialCard';
import materials from '@/data/materials.json';
import Image from 'next/image';

export default function MaterialsPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[400px] bg-comay-charcoal">
        <Image
          src="/images/materials/materials-1.jpg"
          alt="Natural Materials"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Chất Liệu</h1>
            <p className="text-xl md:text-2xl">Vẻ Đẹp Từ Thiên Nhiên Việt Nam</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-comay-charcoal mb-6">
            Nguyên Liệu Tự Nhiên, Bền Vững
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            TRETRE sử dụng các nguyên liệu tự nhiên được thu hoạch bền vững từ các vùng nông thôn
            Việt Nam. Mỗi loại nguyên liệu mang đặc tính riêng, tạo nên sự đa dạng và độc đáo cho
            từng sản phẩm. Chúng tôi cam kết không sử dụng hóa chất độc hại và luôn tôn trọng chu
            trình tự nhiên của các loại cây.
          </p>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-12 bg-comay-cream">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {materials.map((material) => (
              <MaterialCard
                key={material.id}
                name={material.name}
                description={material.description}
                image={material.image}
                properties={material.properties}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-comay-charcoal mb-12 text-center">
              Tác Động Môi Trường Tích Cực
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-comay-green rounded-full flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-comay-charcoal mb-4">Tái Tạo</h3>
                <p className="text-gray-700 leading-relaxed">
                  Tất cả nguyên liệu đều có thể tái tạo tự nhiên. Lục bình, raffia và cỏ bàng đều
                  phát triển nhanh và không cần sử dụng phân bón hóa học hay thuốc trừ sâu.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-comay-green rounded-full flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-comay-charcoal mb-4">Làm Sạch Môi Trường</h3>
                <p className="text-gray-700 leading-relaxed">
                  Cây lục bình giúp lọc và làm sạch nguồn nước tự nhiên. Việc thu hoạch lục bình
                  không chỉ tạo ra nguyên liệu mà còn góp phần bảo vệ hệ sinh thái nước.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-comay-green rounded-full flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-comay-charcoal mb-4">Sinh Kế Bền Vững</h3>
                <p className="text-gray-700 leading-relaxed">
                  Việc sử dụng nguyên liệu địa phương tạo công ăn việc làm cho nông dân và nghệ
                  nhân, giúp cải thiện đời sống và giữ gìn nghề truyền thống.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-comay-green rounded-full flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-comay-charcoal mb-4">Phân Hủy Sinh Học</h3>
                <p className="text-gray-700 leading-relaxed">
                  Khi kết thúc vòng đời sử dụng, sản phẩm có thể phân hủy tự nhiên hoàn toàn, không
                  gây ô nhiễm môi trường như nhựa hay vật liệu tổng hợp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
