import {
  Timeline,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"

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
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
        <p className="text-lg text-gray-600">
          From social feed to full-fledged store — powered by AI.
        </p>
      </div>
      <Timeline defaultValue={1}>
        {items.map((item) => (
          <TimelineItem key={item.id} step={item.id}>
            <TimelineHeader>
              <TimelineSeparator />
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-purple-600">{item.step}</span>
                  <TimelineTitle className="text-xl font-bold text-gray-900">
                    {item.title}
                  </TimelineTitle>
                </div>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </div>
              <TimelineIndicator />
            </TimelineHeader>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}
