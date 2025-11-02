"use client";

import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-6">
      <div className="w-72 h-72">
        <DotLottieReact
          src="https://lottie.host/54b6ceac-10c0-4ec1-b566-3515e3f14a29/UTBVPYRj0s.lottie"
          loop
          autoplay
        />
      </div>

      <h1 className="mt-10 text-4xl sm:text-6xl font-geist font-medium tracking-tight text-foreground leading-tight">Coming <span className="text-primary">Soon</span></h1>
      <p className="text-gray-600 mt-2 max-w-md">
        The page you&apos;re looking for isn&apos;t ready yet or doesn&apos;t exist.
        Check back soon as we build it
      </p>
      <Button className="default mt-6">
        <Link
          href="/"
        >
          Back to Home
        </Link>
      </Button>
    </main>
  );
}
