"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(MotionPathPlugin);
}

interface FloatingImage {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  element: HTMLElement | null;
}

const FloatingImages = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<FloatingImage[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const images = container.querySelectorAll(".floating-img");
    
    // Initialize image data
    imagesRef.current = Array.from(images).map((img, index) => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const rotation = Math.random() * 360;
      const scale = 0.5 + Math.random() * 0.5;

      return {
        id: index,
        x,
        y,
        rotation,
        scale,
        element: img as HTMLElement,
      };
    });

    // Create animations for each image
    imagesRef.current.forEach((img, index) => {
      if (!img.element) return;

      // Set initial position
      gsap.set(img.element, {
        x: img.x,
        y: img.y,
        rotation: img.rotation,
        scale: img.scale,
      });

      // Create random path animation
      const duration = 20 + Math.random() * 20; // 20-40 seconds
      const delay = Math.random() * 5; // 0-5 seconds delay

      // Create a complex path using multiple bezier curves
      const path = [
        { x: img.x, y: img.y },
        { 
          x: img.x + (Math.random() - 0.5) * 400, 
          y: img.y + (Math.random() - 0.5) * 400 
        },
        { 
          x: img.x + (Math.random() - 0.5) * 600, 
          y: img.y + (Math.random() - 0.5) * 600 
        },
        { 
          x: img.x + (Math.random() - 0.5) * 400, 
          y: img.y + (Math.random() - 0.5) * 400 
        },
        { x: img.x, y: img.y },
      ];

      // Animate along the path
      const tl = gsap.timeline({ repeat: -1, delay });
      
      tl.to(img.element, {
        duration: duration,
        motionPath: {
          path: path,
          autoRotate: true,
        },
        ease: "none",
      });

      // Add floating effect
      gsap.to(img.element, {
        y: "+=20",
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2,
      });

      // Add subtle rotation
      gsap.to(img.element, {
        rotation: "+=10",
        duration: 3 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 3,
      });

      // Add scale pulsing
      gsap.to(img.element, {
        scale: img.scale * 1.1,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2,
      });
    });

    // Handle resize
    const handleResize = () => {
      imagesRef.current.forEach((img) => {
        if (!img.element) return;
        
        // Adjust positions on resize
        const currentX = gsap.getProperty(img.element, "x") as number;
        const currentY = gsap.getProperty(img.element, "y") as number;
        
        if (currentX > window.innerWidth) {
          gsap.set(img.element, { x: window.innerWidth - 100 });
        }
        if (currentY > window.innerHeight) {
          gsap.set(img.element, { y: window.innerHeight - 100 });
        }
      });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      gsap.killTweensOf(".floating-img");
    };
  }, []);

  // Sample image URLs - replace with your actual product images
  const imageUrls = [
    "https://picsum.photos/200/200?random=1",
    "https://picsum.photos/200/200?random=2",
    "https://picsum.photos/200/200?random=3",
    "https://picsum.photos/200/200?random=4",
    "https://picsum.photos/200/200?random=5",
    "https://picsum.photos/200/200?random=6",
    "https://picsum.photos/200/200?random=7",
    "https://picsum.photos/200/200?random=8",
    "https://picsum.photos/200/200?random=9",
    "https://picsum.photos/200/200?random=10",
    "https://picsum.photos/200/200?random=11",
    "https://picsum.photos/200/200?random=12",
    "https://picsum.photos/200/200?random=13",
    "https://picsum.photos/200/200?random=14",
    "https://picsum.photos/200/200?random=15",
  ];

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {/* Radial gradient overlay to keep center clear */}
      <div className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, transparent 50%, hsl(var(--background) / 0.4) 70%, hsl(var(--background) / 0.8) 90%)',
        }}
      />
      
      {/* Floating images */}
      {imageUrls.map((url, index) => (
        <div
          key={index}
          className="floating-img absolute w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-lg"
          style={{
            willChange: 'transform',
          }}
        >
          <img
            src={url}
            alt={`Floating product ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

export default FloatingImages;
