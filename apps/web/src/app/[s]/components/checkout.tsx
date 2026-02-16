"use client";

import { useState } from "react";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@vendly/ui/components/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@vendly/ui/components/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";

const API_BASE = ""; // Force relative for same-origin internal API

interface CheckoutProduct {
    id: string;
    name: string;
    price: number;
    currency: string;
    image?: string;
}

interface CheckoutProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    storeSlug: string;
    product: CheckoutProduct;
    quantity: number;
}

type PaymentMethod = "cash_on_delivery" | "mpesa" | "card" | "mtn_momo";

export function Checkout({ open, onOpenChange, storeSlug, product, quantity }: CheckoutProps) {
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_on_delivery");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successStage, setSuccessStage] = useState<"paid" | "processing">("paid");
    const [error, setError] = useState<string | null>(null);

    const totalAmount = product.price * quantity;

    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const resetState = () => {
        setCustomerName("");
        setCustomerEmail("");
        setCustomerPhone("");
        setPaymentMethod("cash_on_delivery");
        setIsSuccess(false);
        setSuccessStage("paid");
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE}/api/storefront/${storeSlug}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customerName,
                    customerEmail,
                    customerPhone: customerPhone || undefined,
                    paymentMethod,
                    notes: notes || undefined,
                    items: [
                        {
                            productId: product.id,
                            quantity,
                        },
                    ],
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to place order");
            }

            const data = await response.json();

            if (paymentMethod === "mtn_momo") {
                if (data?.momo?.status === "failed") {
                    throw new Error(data?.momo?.error || "MTN MoMo payment request failed");
                }

                const referenceId = data?.momo?.referenceId;
                if (!referenceId) {
                    throw new Error("MTN MoMo reference ID was not returned");
                }

                setIsSuccess(true);
                setSuccessStage("processing");

                void (async () => {
                    for (let attempt = 0; attempt < 10; attempt++) {
                        await wait(4000);
                        const statusRes = await fetch(
                            `${API_BASE}/api/storefront/${storeSlug}/payments/mtn-momo/request-to-pay/${referenceId}`
                        );

                        if (!statusRes.ok) {
                            continue;
                        }

                        const statusJson = await statusRes.json().catch(() => ({}));
                        const normalized = statusJson?.normalizedPaymentStatus;

                        if (normalized === "paid") {
                            setSuccessStage("paid");
                            return;
                        }

                        if (normalized === "failed") {
                            setIsSuccess(false);
                            setError("MTN MoMo payment was not approved. Please try again.");
                            return;
                        }
                    }
                })();
            } else {
                setIsSuccess(true);
                setSuccessStage("paid");
                setTimeout(() => setSuccessStage("processing"), 1500);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to place order");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onOpenChange(false);
            setTimeout(() => {
                resetState();
            }, 200);
        }
    };

    if (isSuccess) {
        return (
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-md">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-4 rounded-full bg-green-100 p-3">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-12 w-12 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">
                            {paymentMethod === "mtn_momo"
                                ? successStage === "paid"
                                    ? "Payment Confirmed!"
                                    : "Approve Payment on Phone"
                                : successStage === "paid"
                                    ? "Order Placed!"
                                    : "Processing Order"}
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            {paymentMethod === "mtn_momo"
                                ? successStage === "paid"
                                    ? "Your MoMo payment succeeded and the seller is now processing your order."
                                    : "We sent a MoMo prompt to your phone. Enter your PIN to approve payment."
                                : successStage === "paid"
                                    ? "Check your WhatsApp for payment instructions and order updates."
                                    : "Your order is now being processed by the seller."}
                        </p>
                        <Button onClick={handleClose} className="w-full">
                            Continue Shopping
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Checkout</DialogTitle>
                    <DialogDescription>
                        Complete your order for {product.name}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Order Summary */}
                    <div className="rounded-lg border bg-muted/30 p-4">
                        <h3 className="font-medium mb-3">Order Summary</h3>
                        <div className="flex justify-between text-sm">
                            <span>{product.name} × {quantity}</span>
                            <span>{product.currency} {(product.price * quantity).toLocaleString()}</span>
                        </div>
                        <div className="border-t mt-3 pt-3 flex justify-between font-medium">
                            <span>Total</span>
                            <span>{product.currency} {totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="space-y-4">
                        <h3 className="font-medium">Your Details</h3>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">
                                {paymentMethod === "mtn_momo" ? "Phone Number *" : "WhatsApp Phone Number"}
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+256 7XX XXX XXX"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                required={paymentMethod === "mtn_momo"}
                            />
                            <p className="text-xs text-muted-foreground">
                                {paymentMethod === "mtn_momo"
                                    ? "Required for MTN MoMo payment prompt."
                                    : "Optional, used for order updates on WhatsApp."}
                            </p>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-4">
                        <h3 className="font-medium">Payment Method</h3>
                        <Select
                            value={paymentMethod}
                            onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
                                <SelectItem value="mpesa">M-Pesa</SelectItem>
                                <SelectItem value="mtn_momo">MTN MoMo (Sandbox)</SelectItem>
                                <SelectItem value="card">Card Payment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Notes */}
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Order Notes (Optional)</Label>
                        <Input
                            id="notes"
                            placeholder="Any special instructions..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="rounded-md bg-destructive/10 text-destructive p-3 text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-12"
                        disabled={
                            isSubmitting ||
                            !customerName ||
                            !customerEmail ||
                            (paymentMethod === "mtn_momo" && !customerPhone)
                        }
                    >
                        {isSubmitting ? (
                            <>
                                <HugeiconsIcon icon={Loading03Icon} className="mr-2 h-4 w-4 animate-spin" />
                                Placing Order...
                            </>
                        ) : (
                            `Pay ${product.currency} ${totalAmount.toLocaleString()}`
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
