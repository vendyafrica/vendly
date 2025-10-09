import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons"
import { BellIcon, Share2Icon, TruckIcon } from "lucide-react"
import AnimatedListDemo from "../registry/example/animated-list-demo"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

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
        <div className="absolute inset-0 flex items-center justify-center opacity-60 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_20%,#000_80%,transparent_100%)] transition-opacity duration-300 ease-out group-hover:opacity-80">
          <DotLottieReact
            src="https://lottie.host/4fce24f0-4867-4b22-9fc4-0022c768ff69/8MX4Z6EIQj.lottie"
            loop
            autoplay
            speed={0.5}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
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
        <div className="absolute inset-0 flex items-center justify-center opacity-60 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_20%,#000_80%,transparent_100%)] transition-opacity duration-300 ease-out group-hover:opacity-80">
          <DotLottieReact
            src="https://lottie.host/e27da8af-2e54-4bf8-8b3d-53053c26f080/7XJEi8568C.lottie"
            loop
            autoplay
            speed={0.5}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
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
        <div className="absolute inset-0 flex items-center justify-center opacity-60 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_20%,#000_80%,transparent_100%)] transition-opacity duration-300 ease-out group-hover:opacity-80">
          <DotLottieReact
            src="https://lottie.host/1b8d9ada-bb1c-40ff-a975-8099d0c809f6/7rQHuc0TWN.lottie"
            loop
            autoplay
            speed={0.5}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
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
        <div className="absolute inset-0 flex items-center justify-center opacity-60 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_20%,#000_80%,transparent_100%)] transition-opacity duration-300 ease-out group-hover:opacity-80">
          <DotLottieReact
            src="https://lottie.host/95eec910-d0b3-461e-921d-1e83d3919f83/k7wo33GDVi.lottie"
            loop
            autoplay
            speed={0.5}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
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

