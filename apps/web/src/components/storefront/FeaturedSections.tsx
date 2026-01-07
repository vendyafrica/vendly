import Link from "next/link";

interface FeaturedSectionsProps {
  storeSlug: string;
  storeName: string;
}

export function FeaturedSections({ storeSlug }: FeaturedSectionsProps) {
  const sections = [
    {
      id: 1,
      label: "ETHEREAL ELEGANCE",
      title: "Where Dreams Meet Couture",
      cta: "Shop Now",
      href: `/${storeSlug}/products?collection=elegance`,
      bgColor: "bg-gradient-to-br from-rose-100 to-rose-200",
      textColor: "text-gray-900",
      size: "tall",
    },
    {
      id: 2,
      label: "RADIANT THREADS",
      title: "Enchanting Styles for Every Woman",
      cta: "Shop Now",
      href: `/${storeSlug}/products?collection=radiant`,
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      textColor: "text-gray-900",
      size: "normal",
    },
    {
      id: 3,
      label: "NEW COLLECTION",
      title: "Explore Our Latest Arrivals",
      cta: "Discover",
      href: `/${storeSlug}/products?collection=new`,
      bgColor: "bg-gradient-to-br from-gray-100 to-gray-200",
      textColor: "text-gray-900",
      size: "normal",
    },
    {
      id: 4,
      label: "URBAN STRIDES",
      title: "Chic Footwear for City Living",
      cta: "Shop Now",
      href: `/${storeSlug}/products?collection=footwear`,
      bgColor: "bg-gradient-to-br from-slate-200 to-slate-300",
      textColor: "text-gray-900",
      size: "wide",
    },
    {
      id: 5,
      label: "TRENDSETTING BARGAINS",
      title: "Up to 50% Off",
      cta: "Shop Now",
      href: `/${storeSlug}/products?sale=true`,
      bgColor: "bg-gradient-to-br from-sky-100 to-sky-200",
      textColor: "text-gray-900",
      size: "normal",
      hasIcon: true,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* First Column - Tall Card */}
          <div className={`${sections[0].bgColor} rounded-lg p-8 flex flex-col justify-end min-h-[400px] lg:row-span-2`}>
            <span className="text-xs font-semibold tracking-widest text-gray-600 uppercase mb-2">
              {sections[0].label}
            </span>
            <h3 className="text-2xl font-serif text-gray-900 mb-4">
              {sections[0].title}
            </h3>
            <Link
              href={sections[0].href}
              className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              {sections[0].cta} →
            </Link>
          </div>

          {/* Second Column - Two Normal Cards */}
          <div className="flex flex-col gap-4 md:gap-6">
            <div className={`${sections[1].bgColor} rounded-lg p-6 flex flex-col justify-end min-h-[190px]`}>
              <span className="text-xs font-semibold tracking-widest text-gray-600 uppercase mb-2">
                {sections[1].label}
              </span>
              <h3 className="text-lg font-serif text-gray-900 mb-3">
                {sections[1].title}
              </h3>
              <Link
                href={sections[1].href}
                className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                {sections[1].cta} →
              </Link>
            </div>
            <div className={`${sections[2].bgColor} rounded-lg p-6 flex flex-col justify-end min-h-[190px]`}>
              <span className="text-xs font-semibold tracking-widest text-gray-600 uppercase mb-2">
                {sections[2].label}
              </span>
              <h3 className="text-lg font-serif text-gray-900 mb-3">
                {sections[2].title}
              </h3>
              <Link
                href={sections[2].href}
                className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                {sections[2].cta} →
              </Link>
            </div>
          </div>

          {/* Third and Fourth Columns - Wide Card and Sale Card */}
          <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
            <div className={`${sections[3].bgColor} rounded-lg p-6 flex flex-col justify-end min-h-[190px]`}>
              <span className="text-xs font-semibold tracking-widest text-gray-600 uppercase mb-2">
                {sections[3].label}
              </span>
              <h3 className="text-xl font-serif text-gray-900 mb-3">
                {sections[3].title}
              </h3>
              <Link
                href={sections[3].href}
                className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                {sections[3].cta} →
              </Link>
            </div>
            <div className={`${sections[4].bgColor} rounded-lg p-6 flex items-center justify-between min-h-[190px]`}>
              <div>
                <span className="text-xs font-semibold tracking-widest text-gray-600 uppercase mb-2 block">
                  {sections[4].label}
                </span>
                <Link
                  href={sections[4].href}
                  className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                >
                  {sections[4].cta} →
                </Link>
              </div>
              <div className="text-right">
                <span className="text-6xl font-bold text-gray-900">50</span>
                <span className="text-2xl font-bold text-gray-900">%</span>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-sm text-gray-600">OFF</span>
                  <svg className="w-8 h-8 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
