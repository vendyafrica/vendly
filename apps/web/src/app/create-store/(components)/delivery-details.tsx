import { Button } from "@/components/ui/button";

export function DeliveryDetails({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Delivery Details</h2>
        <p className="text-muted-foreground">
          Set up your delivery details to start receiving orders.
        </p>
      </div>

      <div className="flex gap-3 md:hidden">
        <Button type="button" variant="outline" onClick={onBack} className="cursor-pointer">
          Back
        </Button>
        <Button type="button" className="cursor-pointer flex-1">
          Complete Setup
        </Button>
      </div>
    </div>
  );
}
