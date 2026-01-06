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
    <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>
      
      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center px-4">
        <div className="max-w-3xl">
          {/* Store Logo */}
          {store.logoUrl && (
            <div className="mb-6 flex justify-center">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-background shadow-lg">
                <Image
                  src={store.logoUrl}
                  alt={store.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Welcome to {store.name}
          </h1>
          
          {store.description && (
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {store.description}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${storeSlug}/products`}
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              Shop Now
            </Link>
            <Link
              href={`/${storeSlug}/categories`}
              className="inline-block bg-background text-foreground px-8 py-3 rounded-lg font-medium border border-border hover:bg-muted transition-colors"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
