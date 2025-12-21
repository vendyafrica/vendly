"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface ImageRowProps {
  images: string[];
  direction: "left" | "right";
  speed: number;
  delay: number;
}

const ImageRow = ({ images, direction, speed, delay }: ImageRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rowRef.current) return;

    const row = rowRef.current;
    const totalWidth = row.scrollWidth / 2; // Since we duplicate images
    
    // Set initial position
    gsap.set(row, { x: direction === "left" ? 0 : -totalWidth });
    
    // Create infinite scroll animation
    const animation = gsap.to(row, {
      x: direction === "left" ? -totalWidth : 0,
      duration: speed,
      ease: "none",
      repeat: -1,
      delay,
    });

    return () => {
      animation.kill();
    };
  }, [direction, speed, delay]);

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div ref={rowRef} className="inline-flex gap-4">
        {duplicatedImages.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-xl overflow-hidden shadow-md"
          >
            <img
              src={url}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const ImageCarousel = () => {
  // Sample image URLs - replace with your actual product images
  const row1Images = [
    "https://picsum.photos/200/200?random=1",
    "https://picsum.photos/200/200?random=2",
    "https://picsum.photos/200/200?random=3",
    "https://picsum.photos/200/200?random=4",
    "https://picsum.photos/200/200?random=5",
    "https://picsum.photos/200/200?random=6",
  ];

  const row2Images = [
    "https://picsum.photos/200/200?random=7",
    "https://picsum.photos/200/200?random=8",
    "https://picsum.photos/200/200?random=9",
    "https://picsum.photos/200/200?random=10",
    "https://picsum.photos/200/200?random=11",
    "https://picsum.photos/200/200?random=12",
  ];

  const row3Images = [
    "https://picsum.photos/200/200?random=13",
    "https://picsum.photos/200/200?random=14",
    "https://picsum.photos/200/200?random=15",
    "https://picsum.photos/200/200?random=16",
    "https://picsum.photos/200/200?random=17",
    "https://picsum.photos/200/200?random=18",
  ];

  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 p-8">
      <ImageRow images={row1Images} direction="left" speed={20} delay={0} />
      <ImageRow images={row2Images} direction="right" speed={25} delay={0.5} />
      <ImageRow images={row3Images} direction="left" speed={22} delay={1} />
    </div>
  );
};

export default ImageCarousel;
