"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Timeline,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const items = [
  {
    id: 1,
    step: "Step 1",
    title: "Create Your Account",
    description:
      "Sign up and connect your Instagram or WhatsApp — that's your new store backend.",
  },
  {
    id: 2,
    step: "Step 2",
    title: "Post Like You Normally Do",
    description:
      "Every product you share becomes a live listing on your Vendly store — automatically.",
  },
  {
    id: 3,
    step: "Step 3",
    title: "Get Paid Your Way",
    description:
      "Set your preferred payout method — M-Pesa, card, or direct bank deposit.",
  },
  {
    id: 4,
    step: "Step 4",
    title: "Deliver with Ease",
    description:
      "Choose delivery or pickup options; Vendly handles the logistics integrations for you.",
  },
  {
    id: 5,
    step: "Step 5",
    title: "Watch Vendly Build for You",
    description:
      "AI turns your posts into a professional storefront with product tags, prices, and customer tracking — no extra work required.",
  },
]

export default function TimelineComponent() {
  const headerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Animate timeline items
      if (timelineRef.current) {
        const timelineItems = timelineRef.current.querySelectorAll("[data-timeline-item]")
        
        timelineItems.forEach((item, index) => {
          gsap.from(item, {
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          })
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16">
      <div ref={headerRef} className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
        <p className="text-base md:text-lg text-gray-600">
          From social feed to full-fledged store — powered by AI.
        </p>
      </div>
      <div ref={timelineRef}>
        <Timeline defaultValue={1}>
          {items.map((item) => (
            <TimelineItem key={item.id} step={item.id} data-timeline-item>
              <TimelineHeader>
                <TimelineSeparator />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-purple-600">{item.step}</span>
                    <TimelineTitle className="text-lg md:text-xl font-bold text-gray-900">
                      {item.title}
                    </TimelineTitle>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 mt-2">{item.description}</p>
                </div>
                <TimelineIndicator />
              </TimelineHeader>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </div>
  )
}
