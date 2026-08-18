import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính sách bảo hành | TRETRE',
  description: 'Chính sách bảo hành của TRETRE',
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-comay-cream-light/50">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: "url('/images/shipping-policy-hero.png')" }}
        />
        <div className="absolute inset-0 z-10 bg-comay-cream/90 backdrop-blur-[2px]" />

        <div className="container mx-auto px-4 relative z-20 text-center animate-fade-in">
          {/* <nav className="text-sm font-medium text-comay-green/80 mb-6 tracking-widest uppercase">
            Trang chủ / Chính sách
          </nav> */}
          <h1 className="text-4xl md:text-6xl font-bold text-comay-charcoal mb-6 tracking-tight">
            Chính Sách Bảo Hành
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất với các chính sách minh bạch và dịch vụ tận tâm.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12 animate-slide-up mt-2">
            


            {/* 2. Thanh toán */}
            <section id="payment" className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-comay-green/10 rounded-2xl flex items-center justify-center text-comay-green">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-comay-charcoal">Phương thức thanh toán</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Thanh toán chuyển khoản trước',
                  'Thanh toán khi nhận hàng (COD)',
                ].map((method, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <svg className="w-5 h-5 text-comay-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 font-medium text-sm">{method}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Giá bán lẻ */}
            <section id="pricing" className="bg-comay-charcoal text-white rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
               </div>
               <h2 className="text-2xl font-bold mb-6 relative z-10">Chính sách giá bán lẻ</h2>
               <div className="space-y-4 relative z-10">
                  <p className="text-gray-300 leading-relaxed">
                    Giá niêm yết trên website được áp dụng cho các đơn hàng nội địa tại thị trường Việt Nam.
                  </p>
                  <div className="pt-6 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-4">Dành cho đối tác quốc tế & bán sỉ:</p>
                    <a href="mailto:contact@comaycraft.com" className="inline-flex items-center gap-3 text-comay-green-light font-bold hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      contact@comaycraft.com
                    </a>
                  </div>
               </div>
            </section>

            {/* 4. Quy trình đổi trả */}
            <section id="returns" className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-comay-charcoal mb-4">Quy trình đổi trả hàng</h2>
                <div className="w-16 h-1.5 bg-comay-green mx-auto rounded-full"></div>
              </div>
              
              <div className="relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 -z-10"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      step: '01',
                      title: 'Liên hệ Tre Trẻ',
                      desc: 'Thông báo nhu cầu đổi hàng trong vòng 3 ngày kể từ khi nhận.',
                      icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                      )
                    },
                    {
                      step: '02',
                      title: 'Xác nhận tình trạng',
                      desc: 'Gửi video/hình ảnh unbox hoặc lỗi sản xuất để được hỗ trợ.',
                      icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )
                    },
                    {
                      step: '03',
                      title: 'Ship đổi tận nơi',
                      desc: 'Tre Trẻ book ship 2 chiều để gửi hàng mới & thu hồi hàng cũ.',
                      icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )
                    }
                  ].map((s, i) => (
                    <div key={i} className="bg-white rounded-3xl p-6 text-center border border-gray-100 shadow-sm transition-transform hover:-translate-y-2">
                      <div className="w-16 h-16 bg-comay-green text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-comay-green/20 relative">
                        <span className="absolute -top-3 -right-3 w-8 h-8 bg-comay-cream-yellow text-comay-green text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">{s.step}</span>
                        {s.icon}
                      </div>
                      <h3 className="font-bold text-comay-charcoal mb-2">{s.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. Bảo trì sản phẩm */}
            <section id="maintenance" className="bg-comay-cream-yellow/30 border-2 border-comay-green/5 rounded-3xl p-8 md:p-10">
               <h2 className="text-2xl font-bold text-comay-green mb-6 flex items-center gap-3">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15.667c-.77 1.333.192 3 1.732 3z" />
                 </svg>
                 Thông tin bảo quản sản phẩm
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
                  <div className="space-y-4">
                    <p className="font-medium text-comay-charcoal">🌿 Chất liệu tự nhiên</p>
                    <p className="text-sm leading-relaxed">
                      Sản phẩm được làm thủ công từ Lục bình, cỏ bàng, tre, cói... Tuy đã xử lý kỹ, nhưng do khí hậu nóng ẩm, túi cần được bảo quản nơi khô thoáng.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="font-medium text-comay-charcoal">✨ Mẹo vệ sinh</p>
                    <p className="text-sm leading-relaxed">
                      Nếu gặp ẩm mốc, dùng bàn chải mềm cùng nước nhẹ nhàng vệ sinh, sau đó sấy khô hoặc phơi nắng nhẹ. Tránh hóa chất tẩy rửa mạnh.
                    </p>
                  </div>
               </div>
            </section>

          </div>

          {/* Sidebar Navigation (Sticky) */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-32 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-comay-charcoal mb-6 text-sm uppercase tracking-wider">Danh mục chính sách</h3>
                <nav className="flex flex-col gap-2">
                  {[
                    { id: 'payment', label: 'Phương thức thanh toán' },
                    { id: 'pricing', label: 'Chính sách giá bán lẻ' },
                    { id: 'returns', label: 'Quy trình đổi trả' },
                    { id: 'maintenance', label: 'Bảo quản sản phẩm' }
                  ].map((link) => (
                    <a 
                      key={link.id} 
                      href={`#${link.id}`}
                      className="group flex justify-between items-center p-3 rounded-xl hover:bg-comay-green/5 transition-colors"
                    >
                      <span className="text-gray-600 group-hover:text-comay-green transition-colors font-medium">{link.label}</span>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-comay-green transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  ))}
                </nav>
              </div>

              {/* Contact Card */}
              <div className="bg-comay-green rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-150"></div>
                <h4 className="font-bold text-xl mb-4">Cần hỗ trợ thêm?</h4>
                <p className="text-comay-cream/70 text-sm mb-6 leading-relaxed">Đội ngũ TRETRE luôn sẵn sàng giải đáp thắc mắc của bạn qua Hotline hoặc Email.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="font-bold">098 123 4567</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

