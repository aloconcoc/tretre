import Image from 'next/image';

interface ProductDescriptionProps {
  longDescription?: string | null;
  images?: string[];
}

export default function ProductDescription({ longDescription, images }: ProductDescriptionProps) {
  const hasText = !!longDescription?.trim();
  const hasImages = !!images && images.length > 0;

  if (!hasText && !hasImages) return null;

  return (
    <div className="border-t border-gray-100 pt-16">
      <h2 className="text-2xl font-bold text-comay-charcoal uppercase mb-8 text-center">
        Mô Tả Chi Tiết
      </h2>

      <div className="max-w-2xl mx-auto">
        {hasText && (
          <div className="prose prose-stone max-w-none text-gray-700 leading-relaxed whitespace-pre-line mb-8">
            {longDescription}
          </div>
        )}

        {hasImages && (
          <div className="space-y-4">
            {images!.map((url, i) => (
              <div key={url + i} className="relative w-full rounded-2xl overflow-hidden bg-comay-cream">
                <Image
                  src={url}
                  alt=""
                  width={800}
                  height={800}
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
