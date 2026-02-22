import { Card } from "@/components/ui/card";
import { Check, Minus } from "lucide-react";

const competitors = [
  { name: "Vendly", highlighted: true },
  { name: "Social Media Only" },
  { name: "Marketplaces" },
];

const features = [
  { name: "Storefront", vendly: true, social: false, marketplace: false },
  { name: "Branding", vendly: true, social: false, marketplace: false },
  { name: "Customer Data", vendly: true, social: false, marketplace: false },
  { name: "Payments", vendly: true, social: false, marketplace: true },
  { name: "Mobile Money", vendly: true, social: false, marketplace: true },
  { name: "Order Management", vendly: true, social: false, marketplace: true },
  { name: "Delivery Tools", vendly: true, social: false, marketplace: true },
  { name: "Analytics", vendly: true, social: false, marketplace: true },
  { name: "Platform Fees", vendly: "Low", social: "None", marketplace: "High" },
  { name: "Business Control", vendly: true, social: false, marketplace: false },
];

export function FeaturesComparison() {
  return (
    <section className="bg-background @container py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Find your forever customers with us.
          </p>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base sm:text-lg text-balance">
            Compare Vendly with selling on social media or other marketplaces.
          </p>
        </div>

        <Card className="*:min-w-xl mt-12 overflow-auto">
          {/* Header */}
          <div className="grid grid-cols-4 border-b">
            <div className="p-4"></div>
            {competitors.map((c, idx) => (
              <div
                key={c.name}
                className={`border-l p-4 text-center ${idx === 0 ? "bg-primary/5" : ""}`}
              >
                <p className="text-foreground font-medium">{c.name}</p>
              </div>
            ))}
          </div>

          {/* Feature Rows */}
          {features.map((feature) => (
            <div key={feature.name} className="grid grid-cols-4 border-b last:border-b-0">
              <div className="text-muted-foreground p-4 text-sm">{feature.name}</div>

              {["vendly", "social", "marketplace"].map((key, idx) => {
                const value = feature[key as keyof typeof feature];
                return (
                  <div
                    key={key}
                    className={`flex items-center justify-center border-l p-4 text-sm ${idx === 0 ? "bg-primary/5" : ""}`}
                  >
                    {typeof value === "boolean" ? (
                      value ? (
                        <Check className="size-4 text-primary" />
                      ) : (
                        <Minus className="size-4 text-muted-foreground" />
                      )
                    ) : (
                      <span className="text-foreground font-medium">{value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}
