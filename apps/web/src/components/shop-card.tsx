import { useState } from "react";
import { Star } from "lucide-react";

interface ShopCardProps {
  name: string;
  images: string[]; // Array of product images
  pfp: string;
  rating: number;
  reviewCount?: number;
}

const ShopCard = ({ name, images, pfp, rating, reviewCount }: ShopCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="relative w-full max-w-[320px] mx-auto group cursor-pointer">
      {/* Card Container */}
      <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-gray-100 transition-transform duration-300 hover:scale-[1.02]">
        {/* Product Image */}
        <img
          src={images[currentImageIndex]}
          alt={`${name} product ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Carousel Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDotClick(index);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-white"
                    : "bg-white/50"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Store Info Bar Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            {/* Avatar and Store Name */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 shrink-0">
                <img
                  src={pfp}
                  alt={`${name} logo`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="font-semibold text-base text-black truncate">
                {name}
              </span>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Star className="w-4 h-4 fill-black text-black" />
              <span className="font-medium text-base text-black">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
