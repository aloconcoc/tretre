import Image from 'next/image';
import Link from 'next/link';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
}

export default function BlogCard({ id, title, excerpt, image, date, category }: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/blog/${id}`} className="group">
      <article className="card-hover">
        {/* Featured Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-comay-cream mb-4 image-overlay">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3 z-20">
            <span className="bg-comay-green text-white text-xs px-3 py-1 rounded-full font-semibold">
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <p className="text-sm text-gray-500">{formattedDate}</p>
          <h3 className="font-bold text-xl text-comay-charcoal group-hover:text-comay-green transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 line-clamp-3">{excerpt}</p>
        </div>
      </article>
    </Link>
  );
}
