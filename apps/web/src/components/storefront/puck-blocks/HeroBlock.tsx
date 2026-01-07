import Link from "next/link";

export interface HeroBlockProps {
  label: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundColor: string;
  textColor: string;
  imageUrl?: string | null;
}

export function HeroBlock({
  label,
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundColor,
  textColor,
  imageUrl,
}: HeroBlockProps) {
  return (
    <section
      className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Background Image */}
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}

      {/* Overlay Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: imageUrl
            ? `linear-gradient(to right, ${backgroundColor}f2 0%, ${backgroundColor}cc 50%, ${backgroundColor}99 100%)`
            : `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}dd 100%)`,
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
      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="max-w-xl">
          {/* Category Label */}
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: `${textColor}cc` }}
          >
            {label}
          </span>

          {/* Headline */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 font-serif"
            style={{ color: textColor }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg mb-8 max-w-md"
            style={{ color: `${textColor}cc` }}
          >
            {subtitle}
          </p>

          {/* CTA Button */}
          <Link
            href={ctaLink}
            className="inline-flex items-center gap-2 px-8 py-4 font-medium transition-transform hover:scale-105 text-sm tracking-wide uppercase"
            style={{
              backgroundColor: textColor,
              color: backgroundColor,
            }}
          >
            {ctaText}
          </Link>
        </div>
      </div>

      {/* Navigation Dots (decorative) */}
      <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-2">
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

export default HeroBlock;
