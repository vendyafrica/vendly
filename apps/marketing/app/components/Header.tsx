import Link from "next/link";
import { Button } from "@vendly/ui/components/button";
import Image from "next/image";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12">
      <div className="flex items-center gap-2">
        <Link href="/" className="font-display text-xl font-medium tracking-tight text-white flex items-center gap-2">
          <Image src="/vendly.png" alt="Vendly" width={100} height={100} className="w-10 h-10" />
          <span>vendly.</span>
        </Link>
      </div>
      <nav className="hidden md:flex items-center gap-8">
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
          Login
        </Link>
        <Link href="https://app.vendly.africa/register">
        <Button variant="outline" className="rounded-full border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-primary hover:text-white hover:border-primary/80 transition-all">
            Start Selling
          </Button>
        </Link>
      </div>
    </header>
  );
}
