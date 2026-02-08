import { Input } from "@vendly/ui/components/input";
import { Button } from "@vendly/ui/components/button";
import HeroText from "./hero-text";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Solid wallpaper */}
      <div className="absolute inset-0 bg-linear-to-br from-neutral-950 via-neutral-900 to-black" />

      {/* Subtle glow */}
      <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-20 flex flex-col items-center text-center gap-16">

        {/* Text + CTA */}
        <div className="max-w-4xl space-y-8 flex flex-col items-center">
          <HeroText />

          <p className="text-lg md:text-xl text-white/70 max-w-2xl">
            Vendly helps creators and social sellers turn DMs into real businesses.
            Sell, get paid, and manage orders — all in one link.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <Input
              placeholder="Enter your phone number"
              className="h-12 bg-white text-black"
            />
            <Button className="h-12 px-6">
              Join the waitlist
            </Button>
          </div>

          <p className="text-sm text-white/40">
            No website. No business registration. Mobile money supported.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="relative w-full max-w-6xl">
          <div className="absolute inset-0 -m-4 rounded-xl bg-violet-500/20 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
