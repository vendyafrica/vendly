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

export function Footer({ storeSlug, storeName, theme }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "Youtube" },
  ];

  return (
    <footer
      style={{
        backgroundColor: "var(--background, #ffffff)",
        color: "var(--foreground, #111111)",
        borderTop: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center">
          <Link
            href={`/${storeSlug}`}
            className="text-2xl italic tracking-wide"
            style={{ fontFamily: theme?.headingFont || "var(--font-heading, inherit)" }}
          >
            {storeName}
          </Link>

          <div className="flex items-center gap-4 mt-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <p
            className="text-sm mt-8"
            style={{
              color: "rgba(0,0,0,0.55)",
              fontFamily: theme?.bodyFont || "var(--font-body, inherit)",
            }}
          >
            © {currentYear} {storeName}. Powered by{" "}
            <Link
              href="https://vendlyafrica.store"
              target="_blank"
              className="font-medium"
            >
              Vendly
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
