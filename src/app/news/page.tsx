import BlogCard from '@/components/BlogCard';
import blogPosts from '@/data/blog-posts.json';

export default function NewsPage() {
  const newsArticles = blogPosts.filter((post) => post.category === 'news');
  const allArticles = blogPosts; // Show all if no news-specific articles

  return (
    <>
      {/* Page Header */}
      <div className="bg-comay-cream py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-comay-charcoal mb-4">
            Câu Chuyện
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Tin tức, câu chuyện nghệ nhân và hành trình phát triển của TRETRE
          </p>
        </div>
      </div>

      {/* Latest News */}
      {/* <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-comay-charcoal mb-8">
            Tin Tức Mới Nhất
          </h2>

          {newsArticles.length > 0 || allArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(newsArticles.length > 0 ? newsArticles : allArticles).map((post) => (
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
      </section> */}

      {/* Newsletter Signup */}
      <section className="py-20 bg-comay-green text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-6">Đừng Bỏ Lỡ Câu Chuyện Mới</h2>
          <p className="text-xl mb-8">
            Đăng ký nhận bản tin để cập nhật những câu chuyện mới nhất từ TRETRE
          </p>
          <a href="#footer" className="btn bg-white text-comay-green hover:bg-comay-cream">
            Đăng Ký Ngay
          </a>
        </div>
      </section>
    </>
  );
}
