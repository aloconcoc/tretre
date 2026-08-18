import { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-comay-cream group">
        <Image
          src={images[activeImageIndex]}
          alt={productName}
          fill
          className="object-cover animate-fade-in"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-comay-charcoal opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 z-10"
              aria-label="Previous image"
            >
              <Icon icon="solar:alt-arrow-left-linear" className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-comay-charcoal opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 z-10"
              aria-label="Next image"
            >
              <Icon icon="solar:alt-arrow-right-linear" className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveImageIndex(index)}
            className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
              activeImageIndex === index
                ? 'border-comay-green opacity-100'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
