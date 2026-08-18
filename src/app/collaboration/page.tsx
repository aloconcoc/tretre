import BlogCard from '@/components/BlogCard';
import blogPosts from '@/data/blog-posts.json';

export default function CollaborationPage() {
  const collaborations = blogPosts.filter((post) => post.category === 'collaboration');

  return (
    <>
      {/* Page Header */}
      <div className="bg-comay-green py-20">
        <div className="container mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Hợp Tác</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            TRETRE đã vinh dự được hợp tác với các nhà thiết kế và sự kiện thời trang quốc tế, mang
            nghệ thuật đan lát Việt Nam đến với thế giới
          </p>
        </div>
      </div>

      {/* Collaboration Grid */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-comay-charcoal mb-4">
              Các Dự Án Hợp Tác
            </h2>
            <p className="text-lg text-gray-700">
              Khám phá những dự án hợp tác đặc biệt của TRETRE với các nhà thiết kế và sự kiện thời
              trang uy tín trên thế giới
            </p>
          </div>

          {collaborations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collaborations.map((post) => (
                <BlogCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  image={post.image}
                  date={post.date}
                  category={post.category}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              Nội dung đang được cập nhật
            </div>
          )}
        </div>
      </section>

      {/* Collaboration Highlights */}
      <section className="py-20 bg-comay-cream">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-comay-charcoal mb-12 text-center">
            Điểm Nhấn Hợp Tác
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-comay-green rounded-full flex items-center justify-center mb-4">
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
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-comay-charcoal mb-2">
                Fashion Week Quốc Tế
              </h3>
              <p className="text-gray-700">
                Tham gia Milan Fashion Week, Sydney Fashion Week và nhiều sự kiện thời trang uy tín
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-comay-green rounded-full flex items-center justify-center mb-4">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-comay-charcoal mb-2">
                Nhà Thiết Kế Tài Năng
              </h3>
              <p className="text-gray-700">
                Hợp tác cùng các nhà thiết kế hàng đầu Việt Nam và quốc tế trong các bộ sưu tập độc quyền
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-comay-green rounded-full flex items-center justify-center mb-4">
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
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-comay-charcoal mb-2">
                Văn Hóa Việt Đến Thế Giới
              </h3>
              <p className="text-gray-700">
                Lan tỏa giá trị văn hóa và nghệ thuật thủ công Việt Nam ra cộng đồng quốc tế
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Collaboration */}
      <section className="py-20">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-comay-charcoal mb-6">
            Muốn Hợp Tác Cùng TRETRE?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Chúng tôi luôn mở cửa với các cơ hội hợp tác mới. Hãy liên hệ với chúng tôi để thảo luận
            về dự án của bạn.
          </p>
          <a
            href="mailto:collaboration@comay.com"
            className="btn btn-primary inline-block"
          >
            Liên Hệ Ngay
          </a>
        </div>
      </section>
    </>
  );
}
