import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons"
import { BellIcon, Share2Icon, TruckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import AnimatedBeamMultipleOutputDemo from "../registry/example/animated-beam-multiple-outputs"
import AnimatedListDemo from "../registry/example/animated-list-demo"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { Marquee } from "../registry/magicui/marquee"
import { Globe } from "../registry/magicui/globe"

export default function Features() {
  const features = [
    {
      Icon: Share2Icon,
      name: "Social Sync",
      description:
        "Connect Instagram or WhatsApp — every time you post, your products appear instantly in your store. Zero manual uploads.",
      className: "col-span-12 sm:col-span-6 lg:col-span-6",
      mediaClassName: "h-72 sm:h-80 lg:h-[22rem]",
      background: (
        <AnimatedBeamMultipleOutputDemo className="absolute inset-0 h-full w-full border-none opacity-60 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_20%,#000_80%,transparent_100%)] group-hover:opacity-80 transition-all duration-300 ease-out" />
      ),
    },
    {
      Icon: FileTextIcon,
      name: "AI Store Builder",
      description:
        "Vendly's AI designs your digital storefront, organizes your products, and manages everything — automatically.",
      className: "col-span-12 sm:col-span-6 lg:col-span-6",
      mediaClassName: "h-72 sm:h-80 lg:h-[22rem]",
      background: (
        <Marquee
          pauseOnHover
          className="absolute top-8 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_20%,#000_80%,transparent_100%)] [--duration:20s]"
        >
          {[
            { name: "Fashion Drops", body: "AI-generated storefront layout." },
            { name: "Daily Deals", body: "Smart categorization of new items." },
            { name: "Product Cards", body: "Auto-tagged and optimized visuals." },
          ].map((item, idx) => (
            <figure
              key={idx}
              className={cn(
                "relative w-36 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-200 bg-gray-50 hover:bg-gray-100",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                "transform-gpu transition-all duration-300 ease-out hover:scale-105"
              )}
            >
              <figcaption className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.name}
              </figcaption>
              <blockquote className="mt-2 text-xs text-gray-600">{item.body}</blockquote>
            </figure>
          ))}
        </Marquee>
      ),
    },
    {
      Icon: BellIcon,
      name: "Smart Payments",
      description:
        "Receive instant payments through M-Pesa, bank, or card. Your payouts are automatic",
      className: "col-span-12 sm:col-span-3 lg:col-span-4",
      mediaClassName: "h-56 sm:h-64 lg:h-64",
      background: (
        <AnimatedListDemo className="absolute inset-0 h-full w-full border-none opacity-60 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_20%,#000_80%,transparent_100%)] transition-all duration-300 ease-out group-hover:opacity-80" />
      ),
    },
    {
      Icon: TruckIcon,
      name: "Delivery & Pickup Automation",
      description:
        "Set up your delivery partners or pickup points. Vendly coordinates fulfillment and tracking so you don't have to.",
      className: "col-span-12 sm:col-span-3 lg:col-span-4",
      mediaClassName: "h-56 sm:h-64 lg:h-64",
      background: (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-60 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_20%,#000_80%,transparent_100%)] transition-opacity duration-300 ease-out group-hover:opacity-80"
          src="/scooter.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      ),
    },
    {
      Icon: CalendarIcon,
      name: "Sell Anywhere",
      description:
        "Shoppable links that allow you to sell anywhere your customers are.",
      className: "col-span-12 sm:col-span-3 lg:col-span-4",
      mediaClassName: "h-56 sm:h-64 lg:h-64",
      background: (
        <Globe
          className="absolute inset-0 h-full w-full opacity-70 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_20%,#000_80%,transparent_100%)] transition-opacity duration-300 ease-out group-hover:opacity-90"
          dotColor="rgba(99,102,241,0.9)"
          speed={0.35}
          density={10}
        />
      ),
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Sell Effortlessly
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Vendly automates your entire selling flow — from posting to payments.
          </p>
        </div>
        <BentoGrid className="max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}
