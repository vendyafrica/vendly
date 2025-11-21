"use client";

import { ShoppingBag, Blocks, Factory, PackageCheck } from "lucide-react";
import AnimatedBeamMultipleOutputDemo from "@/registry/example/animated-beam-multiple-outputs";
import { BentoCard, BentoGrid } from "@vendly/ui/components/bento-grid";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const features = [
  {
    Icon: Blocks,
    name: "Instant Setup & Sync",
    description:
      "Connect your socials, and we sync your products with your storefront in minutes. No migration, no plugins.",
    className: "col-span-12 lg:col-span-6",
    background: (
      <AnimatedBeamMultipleOutputDemo className="absolute inset-0 h-full w-full object-cover" />
    ),
    mediaClassName: "p-0",
  },
  {
    Icon: ShoppingBag,
    name: "Convert followers to customers",
    description:
      "Share your vendly store across all social media. Buyers can follow your store, save favorites, and re‑order in one tap.",
    className: "col-span-12 lg:col-span-6",
    background: (
      <div className="flex items-center justify-center w-full h-full ">
        {" "}
        {/* Adjusted for centering without absolute */}
        <DotLottieReact
          src="https://lottie.host/4b4415f8-555d-46c2-95ff-ca5f8cbb8221/pprvv7gvLr.lottie"
          loop
          autoplay
          speed={0.5}
          style={{
            width: "80%",
            height: "80%",
            objectFit: "contain",
          }}
        />
      </div>
    ),
    mediaClassName: "p-4",
  },
  {
    Icon: Factory,
    name: "Business tools at the tip of your fingers",
    description:
      "One dashboard to do it all. Manage orders, inventory, customers, and payouts without leaving your workflow.",
    className: "col-span-12",
    background: (
      <div className="mx-auto h-full w-full opacity-50 flex items-center justify-center">
        <DotLottieReact
          src="https://lottie.host/b991dfc1-ca24-478f-aa19-d96efadaa14e/WCseEhxinW.lottie"
          loop
          autoplay
          speed={0.5}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    ),
    mediaClassName: "p-4",
  },
];

export default function Features({id}: {id?: string}) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30" id={id}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            <span className="text-primary">Supercharge</span> your operations
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Everything you need to sell effortlessly online.
          </p>
        </div>
        <BentoGrid className="mx-auto max-w-6xl gap-6">
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
