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
  // Use theme colors or fallback to defaults
  const bgColor = theme?.secondaryColor || "#4a6fa5";
  const buttonBgColor = theme?.primaryColor || "#1a1a2e";
  const textColor = theme?.accentColor || "#ffffff";

  // Use content or fallback to defaults
  const heroLabel = content?.heroLabel || "Urban Style";
  const heroTitle = content?.heroTitle || store.description || `Discover ${store.name}'s Collection`;
  const heroSubtitle = content?.heroSubtitle || "Explore our curated selection of premium products designed for the modern lifestyle.";
  const heroCta = content?.heroCta || "Discover Now";
  const heroImageUrl = content?.heroImageUrl;

  return (
    <section 
      className="relative h-[500px] md:h-[600px] overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Image if provided */}
      {heroImageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
        />
      )}

      {/* Background Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: heroImageUrl 
            ? `linear-gradient(to right, ${bgColor}f2 0%, ${bgColor}cc 50%, ${bgColor}99 100%)`
            : `linear-gradient(to right, ${bgColor}f2 0%, ${bgColor}cc 50%, ${bgColor}99 100%)`
        }}
      />
      
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
          <span 
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ 
              color: `${textColor}cc`,
              fontFamily: theme?.bodyFont || 'inherit'
            }}
          >
            {heroLabel}
          </span>
          
          {/* Main Headline */}
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ 
              color: textColor,
              fontFamily: theme?.headingFont || 'inherit'
            }}
          >
            {heroTitle}
          </h1>
          
          {/* Description */}
          <p 
            className="text-lg mb-8 max-w-md"
            style={{ 
              color: `${textColor}cc`,
              fontFamily: theme?.bodyFont || 'inherit'
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
              color: textColor,
              fontFamily: theme?.bodyFont || 'inherit'
            }}
          >
            {heroCta}
          </Link>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 right-8 flex items-center gap-2">
        <button 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: textColor }}
          aria-label="Slide 1" 
        />
        <button 
          className="w-3 h-3 rounded-full transition-colors" 
          style={{ backgroundColor: `${textColor}66` }}
          aria-label="Slide 2" 
        />
        <button 
          className="w-3 h-3 rounded-full transition-colors" 
          style={{ backgroundColor: `${textColor}66` }}
          aria-label="Slide 3" 
        />
      </div>
    </section>
  );
}
