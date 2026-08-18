import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Thời trang bền vững | TRETRE',
  description: 'Khám phá hành trình thời trang bền vững của TRETRE',
};

export default function SustainableFashionPage() {
  return (
    <div className="min-h-screen bg-comay-cream-light/30">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] md:h-[60vh] w-full overflow-hidden">
        <Image
          src="/images/su-ben-vung/hero-bag.jpg"
          alt="Thời trang bền vững"
          fill
          className="object-cover transition-transform duration-[2000ms] hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60 flex flex-col items-center justify-center text-center px-4">
          <nav className="text-white/60 text-sm font-medium tracking-[0.3em] uppercase mb-6 animate-fade-in">
            Hành trình TRETRE
          </nav>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight animate-slide-up">
            Thời Trang Bền Vững
          </h1>
          <div className="w-24 h-1 bg-comay-green mt-8 animate-scale-in"></div>
        </div>
      </div>

      {/* Introduction */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
          <svg className="w-64 h-64 text-comay-green" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
          </svg>
        </div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="space-y-8 text-center animate-slide-up">
            <span className="text-comay-green font-bold tracking-widest uppercase text-sm">Tầm nhìn chiến lược</span>
            <p className="text-2xl md:text-3xl text-comay-charcoal leading-relaxed font-light italic">
              "Thời trang, với Tre Trẻ, không chỉ là câu chuyện của cái đẹp bề ngoài. Đó là câu chuyện về trách nhiệm."
            </p>
            <div className="w-16 h-px bg-gray-200 mx-auto"></div>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Trong khi thế giới đang đối mặt với hệ quả của "Fast Fashion", Tre Trẻ chọn hướng đi 
              <span className="text-comay-green font-semibold"> "Chậm lại để Xanh hơn"</span>. Chúng tôi tập trung vào những giá trị vĩnh cửu, 
              giảm thiểu rác thải và tôn vinh bàn tay tài hoa của nghệ nhân Việt.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="py-12 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-comay-charcoal tracking-tight">
              4 Trụ Cột Cốt Lõi
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">Nền tảng tạo nên sự bền vững trong từng sản phẩm của Tre Trẻ.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Nguyên liệu tự nhiên',
                en: 'Natural Fiber Materials',
                img: '/images/su-ben-vung/crafting-process.jpg',
                icon: '🌱'
              },
              {
                title: 'Quy trình thủ công',
                en: 'Handcrafted Process',
                img: '/images/su-ben-vung/crafting-process.jpg',
                icon: '🛠️'
              },
              {
                title: 'Thời trang chậm',
                en: 'Slow Fashion Spirit',
                img: '/images/su-ben-vung/hero-bag.jpg',
                icon: '⏳'
              },
              {
                title: 'Thời trang Đạo đức',
                en: 'Ethical Fashion',
                img: '/images/su-ben-vung/bag-collection.jpg',
                icon: '🤝'
              }
            ].map((pillar, i) => (
              <div key={i} className="group flex flex-col items-center animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="relative w-full aspect-[4/5] mb-6 rounded-3xl overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:shadow-comay-green/10">
                  <Image
                    src={pillar.img}
                    alt={pillar.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-xl">
                    {pillar.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-comay-charcoal mb-2 group-hover:text-comay-green transition-colors">{pillar.title}</h3>
                <p className="text-comay-green/60 text-xs font-bold tracking-widest uppercase">{pillar.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-12 bg-comay-cream-light/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-8 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold text-comay-charcoal leading-tight">
                Không chỉ là sự khác biệt về thiết kế
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                <p>
                  Tre Trẻ muốn thay đổi nhận thức của người tiêu dùng về túi xách thủ công. Chúng tôi không chỉ tạo ra những chiếc túi đi biển, 
                  mà là những món đồ thời trang tinh tế phù hợp cho cả môi trường công sở lẫn các sự kiện sang trọng.
                </p>
                <p>
                  Sự kết hợp giữa nghệ thuật đan lát truyền thống và tư duy thiết kế đương đại giúp tăng độ bền, tính tiện dụng và sự đẳng cấp. 
                  Mỗi sản phẩm đều chứa đựng cảm xúc, tình yêu và những giải pháp tích cực cho môi trường.
                </p>
              </div>
              <div className="flex gap-4 p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-comay-green/10 rounded-2xl flex items-center justify-center text-comay-green">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-comay-charcoal">Tính ứng dụng cao</h4>
                  <p className="text-sm text-gray-500">Túi xách cho mọi dịp, bền đẹp theo thời gian.</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative aspect-square w-full max-w-md animate-fade-in">
              <div className="absolute inset-0 border-2 border-comay-green rounded-full translate-x-4 translate-y-4"></div>
              <div className="relative h-full w-full rounded-full overflow-hidden shadow-2xl">
                <Image
                  src="/images/su-ben-vung/bag-collection.jpg"
                  alt="Sự kết hợp nguyên liệu"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-comay-green text-white p-8 rounded-full shadow-xl">
                <p className="text-2xl font-bold leading-tight">100%<br/><span className="text-xs font-normal uppercase tracking-wider">Tự nhiên</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 bg-comay-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-comay-green rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-comay-green-light rounded-full blur-[120px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            {/* Mission */}
            <div className="space-y-8 animate-slide-up">
              <div className="inline-flex items-center gap-4 text-comay-green-light">
                <span className="w-12 h-px bg-current"></span>
                <span className="font-bold tracking-widest uppercase text-sm">Sứ mệnh</span>
              </div>
              <h3 className="text-4xl font-bold text-white tracking-tight">Thổi hồn đương đại vào di sản Việt</h3>
              <p className="text-xl text-gray-400 leading-relaxed font-light">
                Biến những thớ sợi tự nhiên thành tuyên ngôn phong cách riêng biệt, giữ gìn văn hóa và bảo vệ tương lai Xanh.
              </p>
              <div className="p-10 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 italic text-comay-cream/80 text-lg leading-relaxed shadow-2xl">
                &ldquo;Mỗi chiếc túi bạn chọn không chỉ là phụ kiện, mà là một hành động tử tế cho hành tinh này.&rdquo;
              </div>
            </div>

            {/* Vision */}
            <div className="space-y-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="inline-flex items-center gap-4 text-comay-green-light">
                <span className="w-12 h-px bg-current"></span>
                <span className="font-bold tracking-widest uppercase text-sm">Tầm nhìn</span>
              </div>
              <h3 className="text-4xl font-bold text-white tracking-tight">Biểu tượng thời trang thủ công Việt</h3>
              <div className="space-y-6 text-gray-400 leading-relaxed">
                <p>
                  Trở thành thương hiệu hàng đầu về thời trang bền vững, nơi mỗi sản phẩm là một hạt giống cho hành tinh xanh.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-white">Làng nghề</p>
                    <p className="text-xs uppercase tracking-wider text-comay-green-light">Hợp tác rộng khắp</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-white">Quốc tế</p>
                    <p className="text-xs uppercase tracking-wider text-comay-green-light">Vươn tầm thế giới</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 bg-comay-cream relative">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-12 animate-slide-up">
          <div className="space-y-4">
            <span className="text-comay-green font-bold tracking-widest uppercase text-sm">Giá trị cốt lõi</span>
            <h2 className="text-3xl md:text-5xl font-bold text-comay-charcoal tracking-tight">Sự tỉ mỉ là linh hồn</h2>
          </div>
          
          <div className="relative py-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-9xl text-comay-green opacity-[0.03] font-serif font-bold">&ldquo;</div>
            <p className="text-2xl md:text-4xl text-comay-charcoal font-light leading-snug italic relative z-10">
              Sự hoàn hảo nằm trong từng chi tiết <span className="text-comay-green font-medium">không hoàn hảo</span> của đôi bàn tay nghệ nhân.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left pt-12 border-t border-comay-green/10">
            <div className="space-y-4">
              <h4 className="font-bold text-xl text-comay-charcoal">Độc bản & Tâm huyết</h4>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi tin vào bàn tay hơn máy móc. Mỗi chiếc túi chứa đựng thời gian và sự kiên nhẫn mà sản xuất công nghiệp không thể thay thế.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-xl text-comay-charcoal">Cam kết hoàn thiện</h4>
              <p className="text-gray-600 leading-relaxed">
                Không xước, không lỗi mối đan, đảm bảo sự tinh tế xứng tầm thời trang hiện đại mà vẫn giữ nguyên bản sắc truyền thống.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

