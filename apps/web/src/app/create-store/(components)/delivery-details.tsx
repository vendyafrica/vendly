export function DeliveryDetails({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Delivery Details</h2>
      <p className="text-center text-muted-foreground">
        Set up your delivery details to start receiving orders.
      </p>
    </div>
  );
}
