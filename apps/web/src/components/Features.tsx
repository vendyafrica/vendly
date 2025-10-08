import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons"
import { BellIcon, Share2Icon, TruckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import AnimatedBeamMultipleOutputDemo from "@/registry/example/animated-beam-multiple-outputs"
import AnimatedListDemo from "@/registry/example/animated-list-demo"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { Marquee } from "@/registry/magicui/marquee"

export default function Features() {
  const features = [
    {
      Icon: Share2Icon,
      name: "Social Sync",
      description:
        "Connect Instagram or WhatsApp — every time you post, your products appear instantly in your store. Zero manual uploads.",
      className: "col-span-3 lg:col-span-2",
      background: (
        <AnimatedBeamMultipleOutputDemo className="absolute top-4 right-2 h-[300px] border-none opacity-90 [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105 transition-all duration-300 ease-out" />
      ),
    },
    {
      Icon: FileTextIcon,
      name: "AI Store Builder",
      description:
        "Vendly’s AI designs your digital storefront, organizes your products, and manages everything — automatically.",
      className: "col-span-3 lg:col-span-1",
      background: (
        <Marquee
          pauseOnHover
          className="absolute top-10 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] [--duration:20s]"
        >
          {[
            { name: "Fashion Drops", body: "AI-generated storefront layout." },
            { name: "Daily Deals", body: "Smart categorization of new items." },
            { name: "Product Cards", body: "Auto-tagged and optimized visuals." },
          ].map((item, idx) => (
            <figure
              key={idx}
              className={cn(
                "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
              )}
            >
              <figcaption className="text-sm font-medium dark:text-white">
                {item.name}
              </figcaption>
              <blockquote className="mt-2 text-xs">{item.body}</blockquote>
            </figure>
          ))}
        </Marquee>
      ),
    },
    {
      Icon: BellIcon,
      name: "Smart Payments",
      description:
        "Receive instant payments through M-Pesa, bank, or card. Your payouts are automatic — no extra setup required.",
      className: "col-span-3 lg:col-span-1",
      background: (
        <AnimatedListDemo className="absolute top-4 right-2 h-[300px] w-full scale-75 border-none opacity-90 [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-90" />
      ),
    },
    {
      Icon: TruckIcon,
      name: "Delivery & Pickup Automation",
      description:
        "Set up your delivery partners or pickup points. Vendly coordinates fulfillment and tracking so you don't have to.",
      className: "col-span-3 lg:col-span-2",
      background: (
        <div className="absolute top-10 right-0 w-full h-full flex items-center justify-center opacity-20 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]">
          <div className="grid grid-cols-3 gap-4 p-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      ),
    },
  ]

  return (
    <section className="py-24">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Everything You Need to Sell Effortlessly</h2>
        <p className="text-gray-600">Vendly automates your entire selling flow — from posting to payments.</p>
      </div>
      <BentoGrid>
        {features.map((feature, idx) => (
          <BentoCard key={idx} {...feature} />
        ))}
      </BentoGrid>
    </section>
  )
}
