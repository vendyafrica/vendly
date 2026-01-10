import Link from "next/link";
import type { ReactNode } from "react";

function FeaturedCard({
  label,
  title,
  cta,
  href,
  imageUrl,
  className,
  children,
}: {
  label: string;
  title: string;
  cta: string;
  href: string;
  imageUrl: string | null;
  className: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.50) 100%)",
        }}
      />
      <div className="relative p-8 flex flex-col justify-end h-full">
        <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/80 mb-2">
          {label}
        </span>
        <h3
          className="text-2xl md:text-3xl font-semibold text-white leading-tight"
          style={{ fontFamily: "var(--font-heading, inherit)" }}
        >
          {title}
        </h3>
        <Link
          href={href}
          className="inline-flex items-center text-sm font-medium text-white/90 hover:text-white transition-colors mt-4"
          style={{ fontFamily: "var(--font-body, inherit)" }}
        >
          {cta} →
        </Link>
        {children}
      </div>
    </div>
  );
}

interface FeaturedSectionsProps {
  storeSlug: string;
  storeName: string;
  images?: string[];
}

export function FeaturedSections({ storeSlug, images }: FeaturedSectionsProps) {
  const img = (i: number) => images?.[i] || images?.[0] || null;

  const sections = [
    {
      id: 1,
      label: "ETHEREAL ELEGANCE",
      title: "Where Dreams Meet Couture",
      cta: "Shop Now",
      href: `/${storeSlug}/products?collection=elegance`,
      size: "tall",
      imageUrl: img(0),
    },
    {
      id: 2,
      label: "RADIANT THREADS",
      title: "Enchanting Styles for Every Woman",
      cta: "Shop Now",
      href: `/${storeSlug}/products?collection=radiant`,
      size: "normal",
      imageUrl: img(1),
    },
    {
      id: 3,
      label: "NEW COLLECTION",
      title: "Explore Our Latest Arrivals",
      cta: "Discover",
      href: `/${storeSlug}/products?collection=new`,
      size: "normal",
      imageUrl: img(2),
    },
    {
      id: 4,
      label: "URBAN STRIDES",
      title: "Chic Footwear for City Living",
      cta: "Shop Now",
      href: `/${storeSlug}/products?collection=footwear`,
      size: "wide",
      imageUrl: img(3),
    },
    {
      id: 5,
      label: "TRENDSETTING BARGAINS",
      title: "Up to 50% Off",
      cta: "Shop Now",
      href: `/${storeSlug}/products?sale=true`,
      size: "normal",
      hasIcon: true,
      imageUrl: img(4),
    },
  ];

  return (
    <section className="py-16" style={{ backgroundColor: "var(--background, #ffffff)" }}>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <FeaturedCard
            label={sections[0].label}
            title={sections[0].title}
            cta={sections[0].cta}
            href={sections[0].href}
            imageUrl={sections[0].imageUrl}
            className="min-h-[420px] lg:row-span-2"
          />

          <div className="flex flex-col gap-4 md:gap-6">
            <FeaturedCard
              label={sections[1].label}
              title={sections[1].title}
              cta={sections[1].cta}
              href={sections[1].href}
              imageUrl={sections[1].imageUrl}
              className="min-h-[200px]"
            />
            <FeaturedCard
              label={sections[2].label}
              title={sections[2].title}
              cta={sections[2].cta}
              href={sections[2].href}
              imageUrl={sections[2].imageUrl}
              className="min-h-[200px]"
            />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
            <FeaturedCard
              label={sections[3].label}
              title={sections[3].title}
              cta={sections[3].cta}
              href={sections[3].href}
              imageUrl={sections[3].imageUrl}
              className="min-h-[200px]"
            />
            <FeaturedCard
              label={sections[4].label}
              title={sections[4].title}
              cta={sections[4].cta}
              href={sections[4].href}
              imageUrl={sections[4].imageUrl}
              className="min-h-[200px]"
            >
              <div className="flex items-center gap-3 mt-6">
                <span className="text-5xl md:text-6xl font-bold text-white">50</span>
                <span className="text-2xl font-bold text-white">% OFF</span>
              </div>
            </FeaturedCard>
          </div>
        </div>
      </div>
    </section>
  );
}
