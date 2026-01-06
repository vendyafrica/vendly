import Link from "next/link";

interface FooterProps {
  storeSlug: string;
  storeName: string;
  storeDescription?: string;
}

export function Footer({ storeSlug, storeName, storeDescription }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Store Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-foreground mb-3">{storeName}</h3>
            {storeDescription && (
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                {storeDescription}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link 
                href={`/${storeSlug}`} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link 
                href={`/${storeSlug}/products`} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Products
              </Link>
              <Link 
                href={`/${storeSlug}/categories`} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Categories
              </Link>
              <Link 
                href={`/${storeSlug}/about`} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <p>Get in touch with us</p>
              <Link 
                href={`/${storeSlug}/contact`}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Contact Us →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {storeName}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <Link 
              href="https://vendlyafrica.store" 
              target="_blank"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Vendly
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
