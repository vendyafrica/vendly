import {
  ArrowUpRightIcon,
  BinocularsIcon,
  CogIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Button } from "./ui/button";

const plusPoints = [
  {
    icon: ShieldCheckIcon,
    title: "Sell to everyone",
    description:
      "Drive loyalty and repeat purchases. Sell quickly to interested buyers with your Storefront.",
  },
  {
    icon: CogIcon,
    title: "Payments and delivery",
    description:
      "Buyers can browse inventory, place orders, get invoiced automatically, and pay directly to you. Say goodbye to screenshots of payment.",
  },
  {
    icon: BinocularsIcon,
    title: "Free up time to do what you love",
    description: "Free up time to focus on making your business grow. We handle everything else",
  },
];

export function Features() {
  return (
    <div id="features" className="max-w-6xl mx-auto px-6 text-center py-20 sm:py-24 lg:py-28">
      <h2 className="max-w-4xl mx-auto text-3xl sm:text-4xl lg:text-5xl leading-[1.05] font-semibold tracking-tight text-balance">
        Commerce simplified for you
      </h2>
      <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
        We are working to make this better with your help.
      </p>

      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        {plusPoints.map((plusPoint) => (
          <div
            key={plusPoint.title}
            className="relative overflow-hidden border rounded-lg px-6 py-10 w-full sm:max-w-xs flex flex-col items-center gap-2 bg-gradient-to-b from-primary/3"
          >
            <BackgroundPattern />

            <plusPoint.icon className="size-14 stroke-[1.5px] text-primary" />
            <h3 className="mt-6 text-xl font-semibold">{plusPoint.title}</h3>
            <p className="text-muted-foreground text-balance">{plusPoint.description}</p>
            <Button className="mt-6">
              Learn More <ArrowUpRightIcon />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BackgroundPattern() {
  return (
    <div
      className="absolute inset-0 -top-px -left-px -z-1"
      style={{
        backgroundImage: `
        linear-gradient(to right, var(--border) 1px, transparent 1px),
        linear-gradient(to bottom, var(--border) 1px, transparent 1px)
      `,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 0",
        maskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
        WebkitMaskImage: `
 repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    />
  );
}
