import Image from "next/image";
import Link from "next/link";

interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
}

interface HeroSectionProps {
  store: Store;
  storeSlug: string;
}

export function HeroSection({ store, storeSlug }: HeroSectionProps) {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-[#4a6fa5]">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#4a6fa5]/95 via-[#4a6fa5]/80 to-[#4a6fa5]/60" />
      
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 lg:px-8 flex items-center">
        <div className="max-w-xl">
          {/* Category Label */}
          <span className="inline-block text-xs font-semibold tracking-widest text-white/80 uppercase mb-4">
            Urban Style
          </span>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {store.description || `Discover ${store.name}'s Collection`}
          </h1>
          
          {/* Description */}
          <p className="text-lg text-white/80 mb-8 max-w-md">
            Explore our curated selection of premium products designed for the modern lifestyle.
          </p>
          
          {/* CTA Button */}
          <Link
            href={`/${storeSlug}/products`}
            className="inline-flex items-center gap-2 bg-[#1a1a2e] text-white px-8 py-4 rounded-none font-medium hover:bg-[#2a2a3e] transition-colors text-sm tracking-wide uppercase"
          >
            Discover Now
          </Link>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 right-8 flex items-center gap-2">
        <button className="w-3 h-3 rounded-full bg-white" aria-label="Slide 1" />
        <button className="w-3 h-3 rounded-full bg-white/40 hover:bg-white/60 transition-colors" aria-label="Slide 2" />
        <button className="w-3 h-3 rounded-full bg-white/40 hover:bg-white/60 transition-colors" aria-label="Slide 3" />
      </div>
    </section>
  );
}
