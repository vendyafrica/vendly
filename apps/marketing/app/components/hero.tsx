import Link from "next/link";
import { Button } from "@vendly/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Image from "next/image";

export function Hero() {
  return (
    <>
      <main className="overflow-hidden">
        <section className="bg-background">
          <div className="relative min-h-[calc(100vh-4rem)] flex items-center py-24 md:py-32">
            <div className="mask-radial-from-45% mask-radial-to-75% mask-radial-at-top mask-radial-[75%_100%] mask-t-from-50% lg:aspect-9/4 absolute inset-0 aspect-square lg:top-24 dark:opacity-5">
              <Image
                src="/hero-landing.png"
                alt="hero background"
                width={2268}
                height={1740}
                className="size-full object-cover object-top"
              />
            </div>
            <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
              <div className="mx-auto max-w-xl text-center">
                <h1 className="text-balance font-serif text-4xl font-medium sm:text-5xl">
                  Ship faster. Integrate smarter.
                </h1>
                <p className="text-muted-foreground mt-4 text-balance">
                  Veil is your all-in-one engine for adding seamless
                  integrations to your app.
                </p>

                <Link href="#link">
                  <Button variant="default" className="mt-6 gap-2">
                    Start Building
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      className="opacity-50"
                    />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
