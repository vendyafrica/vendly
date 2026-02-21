import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Start with everything you need to sell today.",
    features: [
      "Storefront & checkout",
      "Unlimited products",
      "Direct payouts",
      "Customer messaging",
    ],
    highlighted: true,
    badge: "Default",
    cta: "Get started free",
  },
  {
    name: "Pricing plan",
    price: "Working on it",
    period: "",
    description: "Next-tier pricing coming soon. We are finalizing the details.",
    features: ["Early access perks", "Priority support", "Launch partner benefits"],
    cta: "Join the waitlist",
    subtle: true,
  },
];

export function Pricing() {
  return (
    <section className="bg-background @container py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-[10vw] md:text-[5vw] font-black tracking-tighter uppercase leading-[0.85] text-balance">
            One simple plan today, more coming soon
          </h2>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg sm:text-2xl font-mono font-bold lowercase text-balance">
            Start free right now. Our next pricing option is in progress—join the waitlist to be first to know.
          </p>
        </div>
        <div className="@xl:grid-cols-2 @xl:gap-6 mt-12 grid gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative p-6 h-full flex flex-col gap-6",
                plan.highlighted && "ring-primary"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black tracking-tighter uppercase text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground mt-2 text-sm font-mono font-bold lowercase leading-relaxed">{plan.description}</p>
                </div>
                {plan.badge && (
                  <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-mono font-bold uppercase">
                    {plan.badge}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-black tracking-tighter text-5xl md:text-6xl">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-lg font-mono font-bold lowercase">{plan.period}</span>}
              </div>

              <ul className="mt-2 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-muted-foreground flex items-center gap-2 text-sm font-mono font-bold lowercase">
                    <Check className="text-primary size-4" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.highlighted ? "default" : "outline"}
                className="mt-auto w-full gap-2"
              >
                <Link href="#pricing">
                  {plan.cta}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Card>
          ))}
        </div>
        <p className="text-muted-foreground mt-8 text-center text-sm">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
