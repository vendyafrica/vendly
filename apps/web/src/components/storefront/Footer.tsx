import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";

interface FooterProps {
  storeSlug: string;
  storeName: string;
  storeDescription?: string;
}

export function Footer({ storeSlug, storeName, storeDescription }: FooterProps) {
  const currentYear = new Date().getFullYear();

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
    <footer className="bg-[#1a1a2e] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-serif mb-2">Subscribe to our newsletter</h3>
              <p className="text-white/60 text-sm">Get the latest updates on new products and upcoming sales</p>
            </div>
            <form className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-[#1a1a2e] font-medium hover:bg-white/90 transition-colors"
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
            <Link href={`/${storeSlug}`} className="text-2xl font-serif italic tracking-wide mb-4 inline-block">
              {storeName}
            </Link>
            {storeDescription && (
              <p className="text-white/60 text-sm leading-relaxed max-w-sm mt-4">
                {storeDescription}
              </p>
            )}
            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Company</h4>
            <nav className="flex flex-col space-y-3">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Help</h4>
            <nav className="flex flex-col space-y-3">
              {footerLinks.help.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Legal</h4>
            <nav className="flex flex-col space-y-3">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/40">
              © {currentYear} {storeName}. All rights reserved.
            </p>
            <p className="text-sm text-white/40">
              Powered by{" "}
              <Link
                href="https://vendlyafrica.store"
                target="_blank"
                className="font-medium text-white/60 hover:text-white transition-colors"
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
