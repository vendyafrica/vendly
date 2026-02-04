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

type PaymentMethod = "cash_on_delivery" | "mpesa" | "mtn_momo" | "card";

type OrderCreateResponse =
    | { order: { id: string; paymentStatus?: string; orderNumber?: string }; momo: { referenceId: string } | null }
    | { id: string; paymentStatus?: string; orderNumber?: string };

type MtnStatusResponse = {
    status?: string;
    normalizedPaymentStatus?: "pending" | "paid" | "failed";
};

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

    const [isPolling, setIsPolling] = useState(false);
    const [momoReferenceId, setMomoReferenceId] = useState<string | null>(null);
    const [momoStatus, setMomoStatus] = useState<"pending" | "paid" | "failed">("pending");

    const totalAmount = product.price * quantity;

    const resetState = () => {
        setCustomerName("");
        setCustomerEmail("");
        setCustomerPhone("");
        setPaymentMethod("cash_on_delivery");
        setNotes("");
        setIsSuccess(false);
        setSuccessStage("paid");
        setError(null);
        setIsPolling(false);
        setMomoReferenceId(null);
        setMomoStatus("pending");
    };

    const startMomoPolling = async (referenceId: string) => {
        setIsPolling(true);
        setMomoReferenceId(referenceId);
        setMomoStatus("pending");

        const maxAttempts = 30;
        const delayMs = 3000;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const res = await fetch(
                    `${API_BASE}/api/storefront/${storeSlug}/payments/mtn-momo/request-to-pay/${referenceId}`,
                    { method: "GET" }
                );
                const json = (await res.json().catch(() => ({}))) as MtnStatusResponse;

                if (!res.ok) {
                    throw new Error((json as { error?: string }).error || "Failed to check MoMo status");
                }

                const normalized = json.normalizedPaymentStatus || "pending";
                setMomoStatus(normalized);

                if (normalized === "paid") {
                    setIsSuccess(true);
                    setSuccessStage("paid");
                    setTimeout(() => setSuccessStage("processing"), 1000);
                    setTimeout(() => {
                        window.location.href = "http://localhost:3000/cart";
                    }, 1200);
                    return;
                }

                if (normalized === "failed") {
                    setError("Payment failed. Please try again.");
                    setIsPolling(false);
                    return;
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to check MoMo status");
                setIsPolling(false);
                return;
            }

            await new Promise((r) => setTimeout(r, delayMs));
        }

        setError("Payment is taking longer than expected. Please check your phone and try again.");
        setIsPolling(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (paymentMethod === "mtn_momo" && !customerPhone) {
                throw new Error("Phone Number is required for MTN MoMo");
            }

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

            const data = (await response.json()) as OrderCreateResponse;
            const momo = "momo" in data ? data.momo : null;

            if (paymentMethod === "mtn_momo") {
                if (!momo?.referenceId) {
                    throw new Error("Failed to initiate MTN MoMo payment");
                }
                await startMomoPolling(momo.referenceId);
                return;
            }

            setIsSuccess(true);
            setSuccessStage("paid");
            setTimeout(() => setSuccessStage("processing"), 1000);
            setTimeout(() => {
                window.location.href = "http://localhost:3000/cart";
            }, 1200);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to place order");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting && !isPolling) {
            onOpenChange(false);
            setTimeout(() => {
                resetState();
            }, 200);
        }
    };

    if (paymentMethod === "mtn_momo" && isPolling) {
        return (
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-md">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-4 rounded-xl bg-[#004F71] px-4 py-2 text-white font-semibold">
                            MoMo from MTN
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">Confirm payment on your phone</h2>
                        <p className="text-muted-foreground mb-4">
                            We sent a payment request. Please approve it on your MTN MoMo prompt.
                        </p>
                        <div className="rounded-md bg-muted/40 p-3 text-sm w-full text-left mb-4">
                            <div className="flex justify-between">
                                <span>Status</span>
                                <span className="font-medium">{momoStatus}</span>
                            </div>
                            {momoReferenceId && (
                                <div className="flex justify-between mt-2">
                                    <span>Reference</span>
                                    <span className="font-mono text-xs">{momoReferenceId}</span>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="rounded-md bg-destructive/10 text-destructive p-3 text-sm w-full mb-4">
                                {error}
                            </div>
                        )}

                        <Button onClick={handleClose} className="w-full" disabled={isSubmitting || isPolling}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (isSuccess) {
        return (
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-md">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-4 rounded-full bg-green-100 p-3">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-12 w-12 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">
                            {successStage === "paid" ? "Payment Successful" : "Processing Order"}
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            {successStage === "paid"
                                ? "Payment received. We’re confirming your order."
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
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+254 7XX XXX XXX"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                            />
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
                                <SelectItem value="mtn_momo">MTN MoMo</SelectItem>
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
                        disabled={isSubmitting || !customerName || !customerEmail}
                    >
                        {isSubmitting ? (
                            <>
                                <HugeiconsIcon icon={Loading03Icon} className="mr-2 h-4 w-4 animate-spin" />
                                Placing Order...
                            </>
                        ) : (
                            paymentMethod === "mtn_momo"
                                ? `Pay with MoMo (MTN) - ${product.currency} ${totalAmount.toLocaleString()}`
                                : `Pay ${product.currency} ${totalAmount.toLocaleString()}`
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
