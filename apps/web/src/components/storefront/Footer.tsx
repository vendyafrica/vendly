import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

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
  newsletterTitle?: string;
  newsletterSubtitle?: string | null;
}

interface FooterProps {
  storeSlug: string;
  storeName: string;
  storeDescription?: string;
  theme?: ThemeProps;
  content?: ContentProps;
}

export function Footer({ storeSlug, storeName, storeDescription, theme, content }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Use theme colors or fallback to defaults
  const bgColor = theme?.primaryColor || "#1a1a2e";
  const textColor = theme?.accentColor || "#ffffff";

  // Use content or fallback to defaults
  const newsletterTitle = content?.newsletterTitle || "Subscribe to our newsletter";
  const newsletterSubtitle = content?.newsletterSubtitle || "Get the latest updates on new products and upcoming sales";

  const footerLinks = {
    company: [
      { label: "About Us", href: `/${storeSlug}/about` },
      { label: "Contact", href: `/${storeSlug}/contact` },
      { label: "Careers", href: `/${storeSlug}/careers` },
      { label: "Press", href: `/${storeSlug}/press` },
    ],
    help: [
      { label: "Customer Service", href: `/${storeSlug}/support` },
      { label: "Track Order", href: `/${storeSlug}/track` },
      { label: "Shipping & Returns", href: `/${storeSlug}/shipping` },
      { label: "FAQ", href: `/${storeSlug}/faq` },
    ],
    legal: [
      { label: "Privacy Policy", href: `/${storeSlug}/privacy` },
      { label: "Terms of Service", href: `/${storeSlug}/terms` },
      { label: "Cookie Policy", href: `/${storeSlug}/cookies` },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "Youtube" },
  ];

  return (
    <footer style={{ backgroundColor: bgColor, color: textColor }}>
      {/* Newsletter Section */}
      <div style={{ borderBottom: `1px solid ${textColor}1a` }}>
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 
                className="text-xl mb-2"
                style={{ 
                  fontFamily: theme?.headingFont || 'serif',
                  color: textColor
                }}
              >
                {newsletterTitle}
              </h3>
              <p 
                className="text-sm"
                style={{ 
                  color: `${textColor}99`,
                  fontFamily: theme?.bodyFont || 'inherit'
                }}
              >
                {newsletterSubtitle}
              </p>
            </div>
            <form className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 focus:outline-none"
                style={{
                  backgroundColor: `${textColor}1a`,
                  border: `1px solid ${textColor}33`,
                  color: textColor,
                  fontFamily: theme?.bodyFont || 'inherit'
                }}
              />
              <button
                type="submit"
                className="px-6 py-3 font-medium transition-colors"
                style={{
                  backgroundColor: textColor,
                  color: bgColor,
                  fontFamily: theme?.bodyFont || 'inherit'
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link 
              href={`/${storeSlug}`} 
              className="text-2xl italic tracking-wide mb-4 inline-block"
              style={{ 
                fontFamily: theme?.headingFont || 'serif',
                color: textColor
              }}
            >
              {storeName}
            </Link>
            {storeDescription && (
              <p 
                className="text-sm leading-relaxed max-w-sm mt-4"
                style={{ 
                  color: `${textColor}99`,
                  fontFamily: theme?.bodyFont || 'inherit'
                }}
              >
                {storeDescription}
              </p>
            )}
            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: `${textColor}1a` }}
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" style={{ color: textColor }} />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 
              className="font-semibold mb-4 text-sm uppercase tracking-wide"
              style={{ 
                color: textColor,
                fontFamily: theme?.bodyFont || 'inherit'
              }}
            >
              Company
            </h4>
            <nav className="flex flex-col space-y-3">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm transition-colors"
                  style={{ 
                    color: `${textColor}99`,
                    fontFamily: theme?.bodyFont || 'inherit'
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Help Links */}
          <div>
            <h4 
              className="font-semibold mb-4 text-sm uppercase tracking-wide"
              style={{ 
                color: textColor,
                fontFamily: theme?.bodyFont || 'inherit'
              }}
            >
              Help
            </h4>
            <nav className="flex flex-col space-y-3">
              {footerLinks.help.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm transition-colors"
                  style={{ 
                    color: `${textColor}99`,
                    fontFamily: theme?.bodyFont || 'inherit'
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal Links */}
          <div>
            <h4 
              className="font-semibold mb-4 text-sm uppercase tracking-wide"
              style={{ 
                color: textColor,
                fontFamily: theme?.bodyFont || 'inherit'
              }}
            >
              Legal
            </h4>
            <nav className="flex flex-col space-y-3">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm transition-colors"
                  style={{ 
                    color: `${textColor}99`,
                    fontFamily: theme?.bodyFont || 'inherit'
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: `1px solid ${textColor}1a` }}>
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p 
              className="text-sm"
              style={{ 
                color: `${textColor}66`,
                fontFamily: theme?.bodyFont || 'inherit'
              }}
            >
              © {currentYear} {storeName}. All rights reserved.
            </p>
            <p 
              className="text-sm"
              style={{ 
                color: `${textColor}66`,
                fontFamily: theme?.bodyFont || 'inherit'
              }}
            >
              Powered by{" "}
              <Link
                href="https://vendlyafrica.store"
                target="_blank"
                className="font-medium transition-colors"
                style={{ color: `${textColor}99` }}
              >
                Vendly
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
