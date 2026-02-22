import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <div className="px-6 max-w-(--breakpoint-xl) mx-auto">
      <nav className="h-20 flex items-center justify-between w-full">
        <Logo />
        <Button asChild>
          <Link href="https://www.duuka.store/c">Start selling</Link>
        </Button>
      </nav>
    </div>
  );
}
