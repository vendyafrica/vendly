import Link from "next/link";
import Image from "next/image";
import { Container } from "./container";

export default function Footer() {
  return (
    <footer className="border-t bg-background/70">
      <Container className="py-10 grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <Image src="/icon0.svg" alt="Vendly logo" width={24} height={24} />
            <span>Vendly</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your store beyond the feed.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
            <li><Link href="#how" className="hover:text-foreground">How it works</Link></li>
            <li><Link href="#pricing" className="hover:text-foreground">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-foreground">About</Link></li>
            <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
            <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-foreground">Privacy</Link></li>
            <li><Link href="#" className="hover:text-foreground">Terms</Link></li>
            <li><Link href="#" className="hover:text-foreground">Cookies</Link></li>
          </ul>
        </div>
      </Container>
      <div className="border-t">
        <Container className="py-6 text-xs text-muted-foreground flex items-center justify-between">
          <p>© {new Date().getFullYear()} Vendly. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground">X</Link>
            <Link href="#" className="hover:text-foreground">IG</Link>
            <Link href="#" className="hover:text-foreground">YT</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}