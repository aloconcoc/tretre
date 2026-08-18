import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import TestimonialCard from '@/components/TestimonialCard';
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';
import Image from 'next/image';

import testimonials from '@/data/testimonials.json';
import blogPosts from '@/data/blog-posts.json';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: bestSellers } = await supabase
    .from('products')
    .select('*')
    .eq('bestseller', true)
    .limit(6);
  const heroSlides = [
    {
      image: '/images/hero/hero-1.jpg',
      title: 'Bông Lúa Collection',
      subtitle: 'Vẻ đẹp từ cánh đồng lúa Việt Nam',
    },
    {
      image: '/images/hero/hero-2.png',
    },
    {
      image: '/images/hero/hero-3.jpg',
      title: 'Nghệ Thuật Thủ Công',
      subtitle: 'Kết nối truyền thống và hiện đại',
    },
    {
      image: '/images/hero/hero-4.jpg',
    },
    {
      image: '/images/hero/hero-5.jpg',
      title: 'Aurora Collection',
      subtitle: 'Rạng ngời như ánh bình minh',
    },
  ];

  const latestPosts = blogPosts.slice(0, 3);

  return (
    <>
      {/* Hero Slider */}
      <HeroSlider slides={heroSlides} />

      {/* Brand Mission Section */}
      <section className="py-20 bg-comay-cream">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-comay-charcoal mb-6">
            Nghệ Thuật Đan Lát Việt Nam
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            TRETRE kết nối giữa nghệ thuật đan lát truyền thống của Việt Nam với thiết kế hiện đại,
            tạo nên những sản phẩm thủ công độc đáo từ chất liệu tự nhiên. Mỗi sản phẩm đều mang
            trong mình câu chuyện của những nghệ nhân làng nghề và tình yêu với thiên nhiên.
          </p>
          <Link
            href="/about"
            className="btn btn-primary inline-block"
          >
            Khám Phá Câu Chuyện
          </Link>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-comay-charcoal">
              Best-Sellers
            </h2>
            <Link
              href="/best-sellers"
              className="text-comay-green hover:underline font-medium"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(bestSellers ?? []).map((product) => (
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

      {/* Storytelling Section with Image */}
      <section className="py-20 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src="/images/about/about-1.jpg"
                alt="Nghệ nhân TRETRE"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-comay-charcoal mb-6">
                Điểm Chạm Kỳ Diệu
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Giữa truyền thống và hiện đại, giữa tay nghệ nhân và tâm nghệ sỹ, TRETRE tạo ra
                những "điểm chạm kỳ diệu" - nơi mà mỗi sợi cói, mỗi ngọn cỏ được dệt nên câu
                chuyện về văn hóa Việt Nam và niềm đam mê với nghề thủ công.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Chúng tôi tin rằng mỗi sản phẩm không chỉ là một vật dụng, mà là một tác phẩm nghệ
                thuật mang giá trị bền vững, kết nối con người với thiên nhiên và gìn giữ bản sắc
                văn hóa dân tộc.
              </p>
              <Link href="/about" className="btn btn-primary">
                Tìm Hiểu Thêm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-comay-cream">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-comay-charcoal text-center mb-12">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                quote={testimonial.quote}
                author={testimonial.author}
                location={testimonial.location}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Artisan Spotlight Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-comay-charcoal mb-6">
                Nghệ Nhân Làng Nghề
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Đằng sau mỗi sản phẩm TRETRE là những bàn tay tài hoa của các nghệ nhân làng nghề,
                những người đã dành cả cuộc đời để gìn giữ và phát triển nghề đan lát truyền thống.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Họ không chỉ là những người thợ, mà còn là những nghệ sỹ, những người kể chuyện,
                truyền tải tình yêu và tâm huyết vào từng sản phẩm. TRETRE tự hào được hợp tác và
                lan tỏa giá trị của nghệ thuật thủ công Việt Nam ra thế giới.
              </p>
              <Link href="/news" className="btn btn-secondary">
                Đọc Câu Chuyện
              </Link>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden order-1 lg:order-2">
              <Image
                src="/images/about/about-2.jpg"
                alt="Artisan at work"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Stories/Blog Section */}
      {/* <section className="py-20 bg-white">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-comay-charcoal">
              Tin Tức & Hợp Tác
            </h2>
            <Link
              href="/collaboration"
              className="text-comay-green hover:underline font-medium"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
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
        </div>
      </section> */}
    </>
  );
}
