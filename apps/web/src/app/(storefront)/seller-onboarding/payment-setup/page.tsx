"use client";

import { useState } from "react";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@vendly/ui/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vendly/ui/components/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeftIcon, ArrowRightIcon, CreditCardIcon, BankIcon } from "@hugeicons/core-free-icons";

const currencies = [
  { value: "USD", label: "USD - US Dollar", symbol: "$" },
  { value: "EUR", label: "EUR - Euro", symbol: "€" },
  { value: "GBP", label: "GBP - British Pound", symbol: "£" },
  { value: "CAD", label: "CAD - Canadian Dollar", symbol: "C$" },
  { value: "AUD", label: "AUD - Australian Dollar", symbol: "A$" },
  { value: "JPY", label: "JPY - Japanese Yen", symbol: "¥" },
];

const paymentMethods = [
  { value: "bank", label: "Bank Transfer", icon: BankIcon },
  { value: "card", label: "Credit/Debit Card", icon: CreditCardIcon },
];

export default function PaymentSetupPage() {
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save payment data and redirect to store-setup
    window.location.href = "/seller-onboarding/store-setup";
  };

  const handleBack = () => {
    window.location.href = "/seller-onboarding/personal-info";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Set up your payment method</h1>
        <p className="text-muted-foreground">
          How you want to receive payments from your sales
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center space-x-2">
        <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
          ✓
        </div>
        <div className="w-16 h-1 bg-muted"></div>
        <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
          ✓
        </div>
        <div className="w-16 h-1 bg-primary"></div>
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
          3
        </div>
        <div className="w-16 h-1 bg-muted"></div>
        <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
          4
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Preferences</CardTitle>
          <CardDescription>
            Set up how you want to receive payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Currency */}
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <Label>Payment Method</Label>
              {paymentMethods.map((method) => (
                <div key={method.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment-method"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary"
                    required
                  />
                  <Label className="flex items-center space-x-2 cursor-pointer">
                    <HugeiconsIcon icon={method.icon} size={16} />
                    <span>{method.label}</span>
                  </Label>
                </div>
              ))}
            </div>

            {/* Payment Details */}
            {paymentMethod === "bank" ? (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <h4 className="font-medium">Bank Account Details</h4>
                <div className="space-y-2">
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input
                    id="bank-name"
                    placeholder="e.g., Chase Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input
                    id="account-number"
                    placeholder="Your account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routing-number">Routing Number</Label>
                  <Input
                    id="routing-number"
                    placeholder="Your routing number"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <h4 className="font-medium">Card Details</h4>
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack}
                className="flex-1"
              >
                <HugeiconsIcon icon={ArrowLeftIcon} size={16} className="mr-2" />
                Back
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                size="lg"
                disabled={!selectedCurrency}
              >
                Continue to Store Setup
                <HugeiconsIcon icon={ArrowRightIcon} size={16} className="ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
