
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroHeader } from "@/components/header"
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'

export function Hero() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <section className="relative bg-black">
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="size-full object-cover"
              src="https://cdn.cosmos.so/08020ebf-2819-4bb1-ab66-ae3642a73697.mp4"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-black/20" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32 md:py-48">
            <div className="max-w-3xl text-left">
              <h1 className="text-balance text-5xl font-bold tracking-tight text-white sm:text-7xl">
                Build your store <br />
                <span className="text-blue-500">Sell everywhere.</span>
              </h1>
              <p className="mt-6 text-start text-lg text-gray-300 md:text-xl">
                Sell across social media.<br /> Grow your audience and sales all in one platform.
              </p>

              <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-blue-600 px-8 text-white hover:bg-blue-700 cursor-pointer">
                  <Link href="#create-store">
                    <span className="text-nowrap font-medium">Create your store</span>
                    <HugeiconsIcon icon={ArrowRight02Icon} className="ml-2 size-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-white/20 bg-white/10 px-8 text-white backdrop-blur-md hover:bg-white/20 hover:text-white cursor-pointer">
                  See pricing
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}