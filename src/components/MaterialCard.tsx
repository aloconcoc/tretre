import Image from 'next/image';

interface MaterialCardProps {
  name: string;
  description: string;
  image: string;
  properties: string[];
}

export default function MaterialCard({ name, description, image, properties }: MaterialCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={image} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-comay-green mb-4">{name}</h3>
        <p className="text-comay-charcoal mb-6 leading-relaxed">{description}</p>

        {/* Properties */}
        <div>
          <h4 className="font-semibold text-comay-charcoal mb-3">
            Đặc điểm:
          </h4>
          <ul className="space-y-2">
            {properties.map((property, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-comay-green mt-0.5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{property}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
