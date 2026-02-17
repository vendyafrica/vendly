"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { WordRotate } from "./ui/word-rotate";
import { Iphone } from "./ui/iphone";
import { Safari } from "./ui/safari";

export function Hero() {
  return (
    <div className="relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Text Content */}
          <div className="text-left max-w-2xl lg:max-w-none lg:col-span-5">
            <strong className="font-semibold text-sm tracking-[0.08em] text-muted-foreground/90 whitespace-nowrap mb-6 block">
              The easiest way to sell{" "}
              <span className="inline-block min-w-[11ch] text-left align-baseline">
                <WordRotate
                  words={["online", "everywhere", "fast", "in store"]}
                  duration={3500}
                  className="inline-block text-sm font-semibold tracking-[0.08em] text-primary"
                />
              </span>
            </strong>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl mb-6">
              Online Stores for social media
            </h1>

            <p className="text-lg leading-8 text-muted-foreground mb-10 max-w-xl">
              Everything in one platform fast checkout, local delivery partners, order tracking, marketplace exposure for steady growth
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="https://www.duuka.store/c">
                <Button size="lg" className="min-w-36 h-12 text-base cursor-pointer">
                  Start Selling
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="min-w-36 h-12 text-base cursor-pointer">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Image Composition */}
          <div className="relative lg:col-span-7 w-full">
            {/* Background Blob/Gradient Effect */}
            <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl opacity-50" />
            
            <div className="relative w-full max-w-3xl mx-auto">
              {/* Browser Frame - centered with padding for phone overlap */}
              <div className="relative z-10 pl-16 sm:pl-20 lg:pl-24">
                <Safari
                  url="vendly.com"
                  imageSrc="/dashboard.png"
                  className="w-full shadow-2xl"
                />
              </div>

              {/* Phone Frame Overlay - positioned to overlap from bottom-left */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 z-20 w-32 sm:w-36 lg:w-44">
                <Iphone
                  videoSrc="https://mplsrodasp.ufs.sh/f/9yFN4ZxbAeCYDMvr8NEFldC5yAexJX0UPbcvMfWYIpsTjn4G"
                  className="shadow-2xl drop-shadow-2xl"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}