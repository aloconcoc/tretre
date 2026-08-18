import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[400px] bg-comay-charcoal">
        <Image
          src="/images/about/about-1.jpg"
          alt="Về Tre Trẻ"
          fill
          className="object-cover"
          style={{ filter: "brightness(0.8)" }}
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Về Tre Trẻ</h1>
            <p className="text-xl md:text-2xl">Nghệ Thuật Đan Lát Truyền Thống Việt Nam</p>
          </div>
        </div>
      </div>

      {/* General Introduction */}
      <section className="py-12">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-comay-charcoal mb-8 text-center">
            Giới Thiệu Chung
          </h2>
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              Thương hiệu túi xách thủ công cao cấp <strong>"Tre Trẻ"</strong> thuộc công ty TNHH Tre Trẻ Craft.
            </p>
            <p>
              Được thành lập từ tháng 6/2025, Tre Trẻ là một thương hiệu mới ở trên thị trường với các sản phẩm túi xách 
              từ sợi thiên nhiên như: <strong>lục bình, cói, mây tre</strong>. Với sự sáng tạo không ngừng nghỉ, Tre Trẻ 
              ngày càng tạo nên nhiều thiết kế mới lạ và khác biệt, song vẫn đồng điệu với xu thế của thời đại và mong 
              muốn của khách hàng.
            </p>
            <p>
              Đến với Tre Trẻ, các thiết kế túi được thiết kế tinh tế từ nhiều nguyên liệu tự nhiên, với cảm hứng 
              sáng tạo từ thiên nhiên và ngôn ngữ thiết kế hiện đại, đầy rung cảm với đời sống. Sự kết hợp này mang đến 
              tính sang trọng mới lạ cho chất liệu túi thủ công, đồng thời gia tăng độ bền bỉ và tiện lợi trong quá trình 
              sử dụng.
            </p>
            <p>
              Mỗi sản phẩm túi đều được chế tác tỉ mỉ từ bàn tay của các nghệ nhân làng nghề, tạo nên sự tinh tế trong 
              từng điểm chạm. Từng chiếc túi được đan cài với linh cảm của những nghệ nhân tâm huyết, lành nghề và biết 
              trân quý những gì mình làm ra. Chính vì vậy mỗi sản phẩm không chỉ đơn thuần là phụ kiện thời trang mà còn 
              là <strong>biểu tượng của sự bền vững, di sản văn hóa và trách nhiệm xã hội</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Banner Image */}
      <section className="py-6">
        <div>
          <div className="relative h-[300px] w-full">
            <Image
              src="/images/about/about-banner.png"
              alt="Tre Trẻ - Hồ Biếc Collection"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Origin Story - 2 Column Layout */}
      <section className="py-12 bg-comay-cream">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-comay-charcoal mb-12 text-center">
            Khởi Nguồn Sự Ra Đời Của "Tre Trẻ"
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content Column */}
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Ý tưởng về dự án "Tre Trẻ" bắt nguồn từ việc chứng kiến sự suy giảm của các làng nghề truyền thống và 
                sự gia tăng rác thải nhựa, dẫn đến quyết định hành động. Hành trình của nhóm bắt đầu từ việc tìm về 
                <strong> làng nghề Phú Vinh</strong> tại Chương Mỹ, nơi những nghệ nhân lành nghề đã duy trì kỹ thuật 
                đan lát các sợi thiên nhiên như lục bình, cói, mây và tre qua nhiều thế hệ, biến nguyên liệu tự nhiên 
                thành những tác phẩm thủ công tinh xảo.
              </p>
              <p className="font-semibold text-comay-green text-xl italic">
                "Tre Trẻ" ra đời như một cầu nối thiêng liêng. Chúng tôi không chỉ bán một chiếc túi, chúng tôi trao 
                gửi một phần di sản văn hóa Việt và niềm tin mãnh liệt vào sự hồi sinh của thiên nhiên. Để mỗi khi 
                chạm vào sản phẩm, bạn chạm vào cả một miền ký ức xanh ngát.
              </p>
              <p>
                Đi lên từ làng nghề, thấm nhuần những đặc tính của sợi tự nhiên, Tre Trẻ hướng tới sự kỹ lưỡng, chỉn chu, 
                tựa như việc những nguyên liệu được lựa chọn cẩn thận, qua bàn tay trau chuốt của những người nghệ nhân 
                yêu cái đẹp, tạo thành những mẫu túi tinh tế nhất, mang chất lượng cao nhất, bền bỉ nhất và đẹp bất biến 
                với thời gian.
              </p>
            </div>

            {/* Image Column */}
            <div className="relative h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/origin-story.png"
                alt="Túi Tre Trẻ"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Artisan Section - "Những Bàn Tay Giữ Lửa" */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-comay-charcoal mb-8 text-center">
            Những Bàn Tay "Giữ Lửa"
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            {/* Image */}
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/artisan-weaving.png"
                alt="Nghệ nhân đan túi"
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p className="text-xl font-semibold text-comay-charcoal">
                Có những vẻ đẹp không đến từ máy móc chính xác, mà đến từ những vết chai sần của thời gian.
              </p>
              <p>
                Tại Tre Trẻ, vẻ đẹp ấy khởi nguồn từ đôi bàn tay của nghệ nhân làng Phú Vinh - những người đã dành 
                cả cuộc đời để "trò chuyện" cùng các sợi tự nhiên.
              </p>
              <p>
                Hãy tưởng tượng về <strong>bác Năm, bác Bảy</strong> – những người thợ lành nghề đã gắn bó với cây 
                tre từ thuở lên mười. Hơn 50 năm qua, đôi bàn tay ấy chưa từng ngơi nghỉ. Những ngón tay thô ráp, 
                chằng chịt những vết sẹo nhỏ do nan sắc cứa vào, nhưng lại sở hữu một sự nhạy cảm kỳ diệu. Chỉ cần 
                chạm nhẹ, họ biết đâu là thanh tre đủ tuổi, đâu là độ dẻo vừa tầm để uốn cong.
              </p>
            </div>
          </div>

          {/* Quote Section */}
          <div className="bg-comay-green text-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <blockquote className="text-2xl italic text-center leading-relaxed">
              "Làm nghề này không vội được đâu con. Tre nó có tính nết, mình phải nương theo nó mà uốn, mà đan. 
              Nóng vội là gãy, là hỏng cả một đời tre."
            </blockquote>
            <p className="text-center mt-4 text-comay-cream">— Lời dạy của nghệ nhân —</p>
          </div>

          {/* Final Paragraph */}
          <div className="mt-12 max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              Mỗi chiếc túi Tre Trẻ bạn cầm trên tay không chỉ được đan bằng nan tre, nó được đan bằng <strong>sự kiên nhẫn </strong> 
              của những ngày hè oi ả và những đêm đông giá rét bên hiên nhà. Đó là sự chuyển giao kỹ thuật từ thế hệ này sang 
              thế hệ khác, là tình yêu thầm lặng của người nghệ nhân muốn gửi gắm hồn quê vào nhịp sống phố thị.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-12 bg-comay-cream">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Vision */}
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-comay-charcoal mb-4">Tầm Nhìn</h3>
              <p className="text-gray-700 leading-relaxed">
                Trở thành thương hiệu túi xách thủ công hàng đầu Việt Nam, lan tỏa giá trị của nghệ thuật đan lát 
                truyền thống ra thế giới, góp phần bảo tồn làng nghề và bảo vệ môi trường thông qua sản phẩm bền vững.
              </p>
            </div>

            {/* Mission */}
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-comay-charcoal mb-4">Sứ Mệnh</h3>
              <p className="text-gray-700 leading-relaxed">
                Tạo ra những sản phẩm túi xách thủ công đẹp mắt, sang trọng và bền vững từ nguyên liệu tự nhiên. 
                Kết nối nghệ nhân với khách hàng, cải thiện sinh kế cộng đồng và bảo vệ môi trường, đồng thời 
                truyền cảm hứng cho thế hệ trẻ yêu thích và gìn giữ văn hóa dân tộc.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-comay-charcoal mb-12 text-center">
            Giá Trị Cốt Lõi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-comay-charcoal mb-2">Cộng Đồng</h3>
              <p className="text-gray-700">
                Hỗ trợ và phát triển cộng đồng nghệ nhân, tạo công ăn việc làm bền vững và bảo tồn nghề truyền thống
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
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-comay-charcoal mb-2">Bền Vững</h3>
              <p className="text-gray-700">
                Sử dụng nguyên liệu tự nhiên như lục bình, cói, mây tre - thân thiện môi trường và có thể tái tạo
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
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-comay-charcoal mb-2">Chất Lượng</h3>
              <p className="text-gray-700">
                Cam kết chất lượng cao nhất, từ nguyên liệu tự nhiên đến từng chi tiết hoàn thiện thủ công
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-comay-green text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Khám Phá Bộ Sưu Tập Của Chúng Tôi</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Mỗi sản phẩm là một tác phẩm nghệ thuật độc đáo, kết hợp truyền thống và hiện đại
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-comay-green px-8 py-4 rounded-md font-semibold hover:bg-comay-cream transition-colors transform hover:scale-105 duration-300"
          >
            Xem Sản Phẩm
          </Link>
        </div>
      </section>
    </>
  );
}
