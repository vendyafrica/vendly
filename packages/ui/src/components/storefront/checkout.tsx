import * as React from "react";
import { cn } from "../../lib/utils";
import { Check, CreditCard } from "lucide-react";

interface CheckoutProps {
  showSteps: boolean;
  layout: "single" | "split";
  showOrderSummary: boolean;
  backgroundColor?: string;
  padding?: string;
}

export function Checkout({
  showSteps,
  layout,
  showOrderSummary,
  backgroundColor,
  padding
}: CheckoutProps) {
  return (
    <section 
      className={cn("w-full min-h-screen", padding || "py-8")}
      style={{ backgroundColor: backgroundColor || "#f9fafb" }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Steps */}
        {showSteps && (
          <div className="mb-12 flex justify-center">
            <div className="flex items-center space-x-8">
              {["Shipping", "Payment", "Review"].map((step, i) => (
                <div key={step} className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                    {i === 0 ? <Check className="h-5 w-5" /> : i + 1}
                  </div>
                  <span className="ml-3 font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={cn("grid gap-12", layout === "split" ? "lg:grid-cols-2" : "max-w-2xl mx-auto")}>
          
          {/* Form */}
          <div className="bg-white rounded-2xl p-8">
            <h1 className="text-2xl font-bold mb-8">Checkout</h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="font-semibold mb-4">Contact</h2>
                <input className="w-full p-3 border rounded-lg" placeholder="Email" />
              </div>
              
              <div>
                <h2 className="font-semibold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input className="p-3 border rounded-lg" placeholder="First name" />
                  <input className="p-3 border rounded-lg" placeholder="Last name" />
                </div>
                <input className="w-full p-3 border rounded-lg mt-4" placeholder="Address" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <input className="p-3 border rounded-lg" placeholder="City" />
                  <input className="p-3 border rounded-lg" placeholder="ZIP code" />
                </div>
              </div>

              <div>
                <h2 className="font-semibold mb-4">Payment</h2>
                <div className="border rounded-lg p-4 flex items-center gap-3">
                  <CreditCard className="h-5 w-5" />
                  <span>Credit Card</span>
                </div>
              </div>

              <button className="w-full bg-black text-white py-4 rounded-lg font-semibold">
                Complete Order
              </button>
            </div>
          </div>

          {/* Order Summary */}
          {showOrderSummary && (
            <div className="bg-white rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <h3 className="font-medium">Premium T-Shirt</h3>
                    <p className="text-gray-600">Size: M, Color: Black</p>
                    <p className="font-semibold">$29.99</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>$29.99</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$9.99</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>$39.98</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
