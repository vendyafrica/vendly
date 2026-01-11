import Link from "next/link";

interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
}

interface ContentProps {
  heroLabel?: string;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroCta?: string;
  heroImageUrl?: string | null;
}

interface HeroSectionProps {
  store: Store;
  storeSlug: string;
  content?: ContentProps;
}

export function HeroSection({ store, storeSlug, content }: HeroSectionProps) {
  // Use content or fallback to defaults
  const heroLabel = content?.heroLabel || "Collection";
  const heroTitle = content?.heroTitle || store.description || `Welcome to ${store.name}`;
  const heroSubtitle = content?.heroSubtitle || "Discover our latest curated collection.";
  const heroCta = content?.heroCta || "Shop Now";
  const bgImage = content?.heroImageUrl;

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden flex items-center">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-gray-200"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 w-full mx-auto px-4 lg:px-8 max-w-[var(--container-max,1400px)]">
        <div className="max-w-2xl text-white">
          {/* Category Label */}
          <div
            className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-[0.2em] uppercase bg-white/10 backdrop-blur-sm rounded-sm border border-white/20"
            style={{
              fontFamily: "var(--font-body, inherit)",
            }}
          >
            {heroLabel}
          </div>

          {/* Main Headline */}
          <h1
            className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight"
            style={{
              fontFamily: "var(--font-heading, inherit)",
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            {heroTitle}
          </h1>

          {/* Description */}
          <p
            className="text-lg md:text-xl mb-10 text-white/90 leading-relaxed max-w-lg"
            style={{
              fontFamily: "var(--font-body, inherit)",
            }}
          >
            {heroSubtitle}
          </p>

          {/* CTA Button */}
          <Link
            href={`/${storeSlug}/products`}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-sm font-bold tracking-widest uppercase transition-all hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] hover:gap-4"
            style={{
              borderRadius: "var(--radius, 0)",
            }}
          >
            {heroCta}
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
