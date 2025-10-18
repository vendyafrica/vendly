import { Instagram, Twitter, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-background text-muted-foreground">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center space-y-6">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2">
          <Image
            src="/apple-icon.png"
            alt="Vendly logo"
            width={28}
            height={28}
          />
          <span className="text-lg font-semibold text-foreground">vendly</span>
        </a>

        {/* Short tagline */}
        <p className="max-w-md text-medium  text-black ">
          One platform to sell anywhere, manage everything, and grow your
          business.
        </p>

        {/* Socials */}
        <div className="flex items-center gap-5">
          <a
            href="#"
            className="hover:text-foreground transition-colors"
            aria-label="Twitter"
          >
            <Twitter size={18} />
          </a>
          <a
            href="#"
            className="hover:text-foreground transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
          <a
            href="#"
            className="hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="mailto:hello@vendly.store"
            className="hover:text-foreground transition-colors"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
        </div>  
        {/* Bottom text */}
        <div className="text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} Vendly. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
