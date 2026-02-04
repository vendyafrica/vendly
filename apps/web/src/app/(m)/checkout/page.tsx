"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Loading03Icon,
    CheckmarkCircle02Icon,
    ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
import { useCart } from "../../../contexts/cart-context";
import { useAppSession } from "@/contexts/app-session-context";

const API_BASE = ""; // Force relative for same-origin internal API

type PaymentMethod = "mtn_momo";

type OrderCreateResponse =
    | { order: { id: string; orderNumber?: string; paymentStatus?: string }; momo: { referenceId: string } | null }
    | { id: string; orderNumber?: string; paymentStatus?: string };

type MtnStatusResponse = {
    status?: string;
    normalizedPaymentStatus?: "pending" | "paid" | "failed";
};

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const storeId = searchParams.get("storeId");
    const { itemsByStore, clearStoreFromCart, itemCount } = useCart();
    const { session } = useAppSession();

    const storeItems = storeId ? itemsByStore[storeId] : [];
    const store = storeItems?.[0]?.store;

    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [paymentMethod] = useState<PaymentMethod>("mtn_momo");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [momoReferenceId, setMomoReferenceId] = useState<string | null>(null);
    const [momoStatus, setMomoStatus] = useState<"pending" | "paid" | "failed">("pending");

    useEffect(() => {
        if (session?.user) {
            setEmail(session.user.email || "");
            setFullName(session.user.name || "");
        }
    }, [session]);

    useEffect(() => {
        if (!storeId || !store) {
            if (itemCount > 0 && !store) router.push("/cart");
        }
    }, [storeId, store, itemCount, router]);

    if (!storeId || !store) {
        return (
            <div className="text-center py-20">
                <h1 className="text-xl">No items to checkout.</h1>
                <Link href="/cart" className="text-primary underline">
                    Return to Cart
                </Link>
            </div>
        );
    }

    const storeSubtotal = storeItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
    );
    const storeTotal = storeSubtotal;
    const currency = storeItems[0]?.product.currency || "UGX";

    const startMomoPolling = async (referenceId: string) => {
        setIsPolling(true);
        setMomoReferenceId(referenceId);
        setMomoStatus("pending");

        const maxAttempts = 30;
        const delayMs = 3000;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const res = await fetch(
                    `${API_BASE}/api/storefront/${store.slug}/payments/mtn-momo/request-to-pay/${referenceId}`,
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
                    clearStoreFromCart(store.id);
                    setTimeout(() => {
                        window.location.href = "http://localhost:3000/cart";
                    }, 800);
                    return;
                }

                if (normalized === "failed") {
                    setError("Payment failed. Please try again.");
                    setIsPolling(false);
                    return;
                }
            } catch {
                setError("Something went wrong. Please try again.");
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
            if (!phone) throw new Error("Phone number is required for MTN MoMo");

            const payload = {
                customerName: fullName,
                customerEmail: email,
                customerPhone: phone,
                paymentMethod,
                shippingAddress: {
                    street: address,
                    country: "Uganda",
                },
                items: storeItems.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
            };

            const res = await fetch(
                `${API_BASE}/api/storefront/${store.slug}/orders`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("Checkout failed");

            const data = (await res.json()) as OrderCreateResponse;
            const momo = "momo" in data ? data.momo : null;
            if (!momo?.referenceId) throw new Error("Failed to initiate MTN MoMo payment");
            await startMomoPolling(momo.referenceId);
        } catch {
            setError("Something went wrong. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (isPolling) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center px-4">
                <div className="max-w-md w-full">
                    <div className="mb-4 rounded-xl bg-[#004F71] px-4 py-2 text-white font-semibold inline-block">
                        MoMo from MTN
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Confirm payment on your phone</h1>
                    <p className="text-neutral-500 mb-6">
                        A payment request was sent. Approve it on your phone to complete checkout.
                    </p>
                    <div className="rounded-lg border bg-neutral-50 p-4 text-sm text-neutral-700 mb-4 text-left">
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
                    {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
                    <Button size="lg" className="rounded-full px-8" onClick={() => router.push("/cart")}
                        disabled={isSubmitting || isPolling}>
                        Back to cart
                    </Button>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center px-4">
                <div>
                    <div className="bg-green-100 p-6 rounded-full inline-block mb-6">
                        <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            className="h-12 w-12 text-green-600"
                        />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        Order Confirmed
                    </h1>
                    <p className="text-neutral-500 mb-6 max-w-md">
                        Thank you for shopping with {store.name}.
                    </p>
                    <Link href="/">
                        <Button size="lg" className="rounded-full px-8">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="grid lg:grid-cols-2 min-h-screen">
                {/* LEFT — FORM */}
                <div className="flex justify-center items-start p-6 lg:p-12 order-2 lg:order-1">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-xl space-y-6"
                    >
                        <div className="flex items-center gap-2">
                            <Link href={`/${store.slug}`} className="text-xl font-semibold hover:underline hover:text-primary/80">
                                {store.name}
                            </Link>
                            <HugeiconsIcon
                                icon={ArrowRight01Icon}
                                className="h-4 w-4 text-neutral-400"
                            />
                            <h2 className="text-md font-semibold text-neutral-400">Checkout</h2>
                        </div>

                        <Input
                            placeholder="Full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />

                        <Input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            placeholder="Phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />

                        <Input
                            placeholder="Delivery address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />

                        <div className="p-3 rounded-lg bg-neutral-50 border text-sm text-neutral-600">
                            You&apos;ll receive a payment prompt on your phone to complete your order.
                        </div>

                        {error && (
                            <p className="text-sm text-red-600">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl text-lg bg-[#004F71] hover:bg-[#f7cf2d] text-white hover:text-[#004F71] transition-colors flex items-center justify-center gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <HugeiconsIcon
                                        icon={Loading03Icon}
                                        className="mr-2 h-5 w-5 animate-spin"
                                    />
                                    Processing…
                                </>
                            ) : (
                                <>
                                    <Image
                                        src="https://momodeveloper.mtn.com/content/momo_mtna.png"
                                        alt="MoMo from MTN"
                                        width={100}
                                        height={100}
                                        className="h-6 w-auto"
                                    />
                                    <span>Pay with MoMo (MTN)</span>
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {/* RIGHT — SUMMARY (SCROLLABLE) */}
                <div className="bg-neutral-50 lg:border-l overflow-y-auto order-1 lg:order-2">
                    <div className="flex justify-center items-start p-6 lg:p-12">
                        <div className="w-full max-w-md space-y-6">
                            <h2 className="text-xl font-semibold">Order details</h2>
                            {storeItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 items-center"
                                >
                                    <div className="relative h-16 w-16 rounded-lg overflow-hidden border bg-white">
                                        {item.product.image && (
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-neutral-700 text-white text-xs flex items-center justify-center">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            {item.product.name}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {currency} {item.product.price}
                                    </p>
                                </div>
                            ))}

                            <div className="border-t pt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>
                                        {currency} {storeSubtotal}
                                    </span>
                                </div>
                                <div className="flex justify-between font-semibold text-base">
                                    <span>Total</span>
                                    <span>
                                        {currency} {storeTotal}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <HugeiconsIcon
                        icon={Loading03Icon}
                        className="h-10 w-10 animate-spin text-neutral-400"
                    />
                </div>
            }
        >
            <CheckoutContent />
        </Suspense>
    );
}
