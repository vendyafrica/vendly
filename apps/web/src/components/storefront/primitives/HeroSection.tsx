import Link from "next/link";

interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
}

interface ThemeProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  headingFont?: string;
  bodyFont?: string;
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
  theme?: ThemeProps;
  content?: ContentProps;
}

export function HeroSection({ store, storeSlug, theme, content }: HeroSectionProps) {
  const buttonBgColor = "var(--primary, #111111)";
  const textColor = "var(--primary-foreground, #ffffff)";

  // Use content or fallback to defaults
  const heroLabel = content?.heroLabel || "Urban Style";
  const heroTitle = content?.heroTitle || store.description || `Discover ${store.name}'s Collection`;
  const heroSubtitle = content?.heroSubtitle || "Explore our curated selection of premium products designed for the modern lifestyle.";
  const heroCta = content?.heroCta || "Discover Now";

  return (
    <section className="relative h-[560px] md:h-[640px] overflow-hidden">
      <div className="relative h-full container mx-auto px-4 lg:px-8 flex items-center pt-16">
        <div className="max-w-xl">
          {/* Category Label */}
          <span 
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ 
              color: "rgba(255,255,255,0.85)",
              fontFamily: theme?.bodyFont || "var(--font-body, inherit)",
            }}
          >
            {heroLabel}
          </span>
          
          {/* Main Headline */}
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ 
              color: textColor,
              fontFamily: theme?.headingFont || "var(--font-heading, inherit)",
              textShadow: "0 2px 16px rgba(0,0,0,0.35)",
            }}
          >
            {heroTitle}
          </h1>
          
          {/* Description */}
          <p 
            className="text-lg mb-8 max-w-md"
            style={{ 
              color: "rgba(255,255,255,0.85)",
              fontFamily: theme?.bodyFont || "var(--font-body, inherit)",
            }}
          >
            {heroSubtitle}
          </p>
          
          {/* CTA Button */}
          <Link
            href={`/${storeSlug}/products`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-none font-medium transition-colors text-sm tracking-wide uppercase"
            style={{
              backgroundColor: buttonBgColor,
              color: "var(--primary-foreground, #ffffff)",
              fontFamily: theme?.bodyFont || "var(--font-body, inherit)",
            }}
          >
            {heroCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
