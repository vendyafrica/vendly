"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ArrowLeft01Icon,
    CreditCardIcon,
    MoneyBag02Icon,
    SmartPhone01Icon,
    Loading03Icon,
    CheckmarkCircle02Icon
} from "@hugeicons/core-free-icons";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@vendly/ui/components/radio-group";
import { useCart } from "../../../contexts/cart-context";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type PaymentMethod = "card" | "mpesa" | "cash_on_delivery";

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const storeId = searchParams.get("storeId");

    const { itemsByStore, clearStoreFromCart, itemCount } = useCart();
    const storeItems = storeId ? itemsByStore[storeId] : [];
    const store = storeItems?.[0]?.store;

    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [phone, setPhone] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!storeId || !store) {
            if (itemCount > 0 && !store) {
                router.push("/cart"); 
            }
        }
    }, [storeId, store, itemCount, router]);

    if (!storeId || !store) {
        return (
            <div className="text-center py-20">
                <h1 className="text-xl">No items to checkout for this store.</h1>
                <Link href="/cart" className="text-blue-600 underline">Return to Cart</Link>
            </div>
        );
    }

    const storeSubtotal = storeItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const shipping = 0; // Free for now or calculated later
    const storeTotal = storeSubtotal + shipping;
    const currency = storeItems[0]?.product.currency || "EUR";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const payload = {
                customerName: `${firstName} ${lastName}`.trim(),
                customerEmail: email,
                customerPhone: phone || undefined,
                paymentMethod,
                shippingAddress: {
                    street: address,
                    city,
                    postalCode,
                    country: "Kenya" // Defaulting to Kenya for now
                },
                items: storeItems.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity
                }))
            };

            const res = await fetch(`${API_BASE}/api/storefront/${store.slug}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || `Failed to place order for ${store.name}`);
            }

            // Success
            setIsSuccess(true);
            clearStoreFromCart(store.id);

        } catch (err) {
            console.error("Checkout validation error:", err);
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-green-100 p-6 rounded-full mb-6 animate-in zoom-in duration-300">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-12 w-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
                <p className="text-neutral-500 mb-8 max-w-md">
                    Thank you for your purchase from {store.name}, {firstName}. We've sent a confirmation email to {email}.
                </p>
                <Link href="/">
                    <Button size="lg" className="rounded-full px-8">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Minimal Header */}
            <header className="border-b border-neutral-100 py-4 px-6 lg:px-12 flex items-center justify-between">
                <Link href="/cart" className="text-2xl font-bold tracking-tight text-indigo-600">
                    shop
                </Link>
            </header>

            <div className="grid lg:grid-cols-12 min-h-[calc(100vh-65px)]">
                {/* Left Column - Forms */}
                <div className="lg:col-span-7 p-6 lg:p-12 xl:p-20 order-2 lg:order-1">
                    <div className="max-w-xl mx-auto space-y-8">

                        {/* Auth / Contact */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium">Contact</h2>
                                {email && <Link href="/login" className="text-sm text-blue-600">Log in</Link>}
                            </div>
                            <Input
                                placeholder="Email or mobile phone number"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 bg-white rounded-lg border-neutral-200 focus:ring-2 focus:ring-blue-500/20"
                                required
                            />
                            {/* <div className="flex items-center gap-2">
                                <Checkbox id="newsletter" />
                                <Label htmlFor="newsletter" className="text-sm text-neutral-600">Email me with news and offers</Label>
                            </div> */}
                        </div>

                        {/* Delivery */}
                        <div className="space-y-4 pt-4">
                            <h2 className="text-lg font-medium">Delivery</h2>

                            <div className="relative">
                                <Label className="absolute -top-2 left-2 bg-white px-1 text-xs text-neutral-500 z-10 block">Country/Region</Label>
                                <select className="w-full h-12 rounded-lg border border-neutral-200 bg-white px-3 outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none">
                                    <option>Germany</option>
                                    <option>Kenya</option>
                                    <option>United States</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    placeholder="First name"
                                    className="h-12 rounded-lg"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <Input
                                    placeholder="Last name"
                                    className="h-12 rounded-lg"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <Input
                                    placeholder="Address"
                                    className="h-12 rounded-lg pr-10"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                <div className="absolute right-3 top-3.5 text-neutral-400">
                                    <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5 rotate-180" /> {/* Search icon replacement */}
                                </div>
                            </div>
                            <Input placeholder="Apartment, suite, etc. (optional)" className="h-12 rounded-lg" />

                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    placeholder="Postal code"
                                    className="h-12 rounded-lg"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                />
                                <Input
                                    placeholder="City"
                                    className="h-12 rounded-lg"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <Input
                                    placeholder="Phone (optional)"
                                    className="h-12 rounded-lg"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <div className="absolute right-3 top-3.5 text-neutral-400 cursor-help">
                                    <span className="text-sm font-bold">?</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Method */}
                        <div className="pt-6">
                            <h2 className="text-lg font-medium mb-4">Shipping method</h2>
                            <div className="bg-neutral-50 rounded-lg p-4 flex justify-between items-center border border-neutral-100">
                                <span className="text-sm text-neutral-600">Enter your shipping address to view available shipping methods.</span>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="pt-6">
                            <h2 className="text-lg font-medium mb-4">Payment</h2>
                            <p className="text-sm text-neutral-500 mb-4">All transactions are secure and encrypted.</p>

                            <RadioGroup
                                value={paymentMethod}
                                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                                className="border rounded-xl overflow-hidden divide-y"
                            >
                                {/* Credit Card */}
                                <div className={`p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50 ${paymentMethod === "card" ? "bg-neutral-50" : "bg-white"}`}>
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="card" id="card" />
                                        <Label htmlFor="card" className="font-medium cursor-pointer">Credit card</Label>
                                    </div>
                                    <div className="flex gap-2">
                                        <HugeiconsIcon icon={CreditCardIcon} className="h-5 w-5 text-neutral-400" />
                                    </div>
                                </div>

                                {paymentMethod === "card" && (
                                    <div className="p-4 bg-neutral-50 border-t border-neutral-200 animate-in slide-in-from-top-2">
                                        <div className="space-y-4">
                                            <Input placeholder="Card number" className="bg-white" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input placeholder="Expiration (MM / YY)" className="bg-white" />
                                                <Input placeholder="Security code" className="bg-white" />
                                            </div>
                                            <Input placeholder="Name on card" className="bg-white" />
                                        </div>
                                    </div>
                                )}

                                {/* M-Pesa */}
                                <div className={`p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50 ${paymentMethod === "mpesa" ? "bg-neutral-50" : "bg-white"}`}>
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="mpesa" id="mpesa" />
                                        <Label htmlFor="mpesa" className="font-medium cursor-pointer">M-Pesa</Label>
                                    </div>
                                    <HugeiconsIcon icon={SmartPhone01Icon} className="h-5 w-5 text-neutral-400" />
                                </div>

                                {/* Cash on Delivery */}
                                <div className={`p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50 ${paymentMethod === "cash_on_delivery" ? "bg-neutral-50" : "bg-white"}`}>
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="cash_on_delivery" id="cod" />
                                        <Label htmlFor="cod" className="font-medium cursor-pointer">Cash on Delivery</Label>
                                    </div>
                                    <HugeiconsIcon icon={MoneyBag02Icon} className="h-5 w-5 text-neutral-400" />
                                </div>
                            </RadioGroup>
                        </div>

                        <Button
                            size="lg"
                            className="w-full h-14 text-lg rounded-xl mt-8 bg-indigo-600 hover:bg-indigo-700 font-semibold"
                            onClick={handleSubmit}
                            disabled={isSubmitting} // Removing explicit validation disabling for demo flow feel
                        >
                            {isSubmitting ? (
                                <>
                                    <HugeiconsIcon icon={Loading03Icon} className="mr-2 h-5 w-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Pay now"
                            )}
                        </Button>

                        <div className="text-center pt-4">
                            <p className="text-xs text-neutral-400">
                                This site is protected by reCAPTCHA and the Google <a href="#" className="underline">Privacy Policy</a> and <a href="#" className="underline">Terms of Service</a> apply.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Right Column - Summary (Gray Background) */}
                <div className="lg:col-span-5 bg-neutral-50 p-6 lg:p-12 xl:p-20 order-1 lg:order-2 border-l border-neutral-100">
                    <div className="max-w-md sticky top-6">
                        <div className="space-y-4 mb-8">
                            {storeItems.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="relative h-16 w-16 border border-neutral-200 rounded-lg overflow-hidden bg-white shrink-0">
                                        {item.product.image && (
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                        <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-neutral-500 text-white text-xs font-medium rounded-full z-10 shadow-sm">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm text-neutral-800">{item.product.name}</h4>
                                        <p className="text-xs text-neutral-500">Off-white / XXS</p>
                                    </div>
                                    <div className="text-sm font-medium text-neutral-800">
                                        {currency}{item.product.price.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 mb-8">
                            <Input placeholder="Discount code or gift card" className="bg-white h-12" />
                            <Button variant="outline" className="h-12 bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-500">Apply</Button>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-neutral-200/60">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">Subtotal &middot; {storeItems.length} items</span>
                                <span className="font-medium text-neutral-900">{currency} {storeSubtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">Shipping</span>
                                <span className="text-neutral-500 text-xs">Enter shipping address</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-6 mt-6 border-t border-neutral-200/60">
                            <div>
                                <span className="text-xl font-bold text-neutral-900">Total</span>
                                <span className="text-xs text-neutral-500 block">Including €44.68 in taxes</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-neutral-500 mr-2">EUR</span>
                                <span className="text-2xl font-bold text-neutral-900">{currency}{storeTotal.toLocaleString()}</span>
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
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><HugeiconsIcon icon={Loading03Icon} className="animate-spin h-10 w-10 text-neutral-400" /></div>}>
            <CheckoutContent />
        </Suspense>
    );
}
