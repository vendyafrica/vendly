import Link from "next/link";
import { Instagram, Twitter, Facebook } from "lucide-react";

interface SocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
}

export interface FooterBlockProps {
  storeName: string;
  backgroundColor: string;
  textColor: string;
  showNewsletter?: boolean;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
  socialLinks?: SocialLinks;
  storeSlug?: string;
}

export function FooterBlock({
  storeName,
  backgroundColor,
  textColor,
  showNewsletter = false,
  newsletterTitle = "Subscribe to our newsletter",
  newsletterSubtitle = "Get the latest updates",
  socialLinks = {},
  storeSlug = "",
}: FooterBlockProps) {
  const currentYear = new Date().getFullYear();

  const socialIcons = [
    { key: "instagram", icon: Instagram, href: socialLinks.instagram },
    { key: "twitter", icon: Twitter, href: socialLinks.twitter },
    { key: "facebook", icon: Facebook, href: socialLinks.facebook },
  ].filter((s) => s.href);

  return (
    <footer style={{ backgroundColor, color: textColor }}>
      {/* Newsletter Section */}
      {showNewsletter && (
        <div
          className="py-10 md:py-12"
          style={{ borderBottom: `1px solid ${textColor}20` }}
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-serif mb-2">{newsletterTitle}</h3>
                <p className="text-sm opacity-70">{newsletterSubtitle}</p>
              </div>
              <form className="flex w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 md:w-72 px-4 py-3 text-sm focus:outline-none"
                  style={{
                    backgroundColor: `${textColor}15`,
                    border: `1px solid ${textColor}30`,
                    color: textColor,
                  }}
                />
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: textColor,
                    color: backgroundColor,
                  }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer */}
      <div className="py-10 md:py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col items-center gap-6">
            {/* Logo */}
            <Link
              href={storeSlug ? `/${storeSlug}` : "/"}
              className="text-2xl font-serif italic tracking-wide"
              style={{ color: textColor }}
            >
              {storeName}
            </Link>

            {/* Social Links */}
            {socialIcons.length > 0 && (
              <div className="flex items-center gap-4">
                {socialIcons.map((social) => (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{ backgroundColor: `${textColor}20` }}
                    aria-label={social.key}
                  >
                    <social.icon size={18} style={{ color: textColor }} />
                  </a>
                ))}
              </div>
            )}

            {/* Quick Links */}
            <nav className="flex flex-wrap justify-center gap-6 text-sm opacity-70">
              <Link
                href={storeSlug ? `/${storeSlug}` : "/"}
                className="hover:opacity-100 transition-opacity"
              >
                Home
              </Link>
              <Link
                href={storeSlug ? `/${storeSlug}/products` : "/products"}
                className="hover:opacity-100 transition-opacity"
              >
                Shop
              </Link>
              <Link
                href={storeSlug ? `/${storeSlug}/about` : "/about"}
                className="hover:opacity-100 transition-opacity"
              >
                About
              </Link>
              <Link
                href={storeSlug ? `/${storeSlug}/contact` : "/contact"}
                className="hover:opacity-100 transition-opacity"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="py-4"
        style={{ borderTop: `1px solid ${textColor}20` }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 text-sm opacity-60">
            <span>
              © {currentYear} {storeName}. All rights reserved.
            </span>
            <span className="hidden md:inline">•</span>
            <span>
              Powered by{" "}
              <a
                href="https://vendlyafrica.store"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:opacity-100 transition-opacity"
              >
                Vendly
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterBlock;
