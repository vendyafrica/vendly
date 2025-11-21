"use client"

// --- NEW IMPORT ---
import { HTMLAttributes, useState } from "react" 
import { cn } from "@/lib/utils"
import { Button } from "@vendly/ui/components/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@vendly/ui/components/field"
import { Input } from "@vendly/ui/components/input"
import { Label } from "@vendly/ui/components/label"
import { RadioGroup, RadioGroupItem } from "@vendly/ui/components/radio-group" 
import Link from "next/link"
import Image from "next/image"
import { useSteps } from "./step-context"
import { Landmark, Smartphone, ReceiptText } from "lucide-react"

interface PaymentSetupFormProps extends HTMLAttributes<HTMLDivElement> {
  onNext?: () => void;
  onBack?: () => void;
}

export function PaymentSetupForm({
  className,
  onNext,
  onBack,
  ...props
}: PaymentSetupFormProps) {
  const { formData, setFormData } = useSteps()
  
  // --- NEW STATE FOR ERROR HANDLING ---
  const [error, setError] = useState<string | null>(null)

  // --- UPDATED HANDLESUBMIT ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Clear previous errors

    // 1. Check if a method is selected
    if (!formData.paymentMethod) {
      setError("Please select a payout method.")
      return
    }

    // 2. Check required fields for the selected method
    switch (formData.paymentMethod) {
      case "till":
        if (!formData.mpesaTillNumber) {
          setError("Please enter your M-Pesa Till Number.")
          return
        }
        break
      case "phone":
        if (!formData.mpesaPhoneNumber) {
          setError("Please enter your M-Pesa Phone Number.")
          return
        }
        break
      case "bank":
        if (!formData.bankName || !formData.bankAccountName || !formData.bankAccountNumber) {
          setError("Please fill in all bank details.")
          return
        }
        break
    }

    // 3. If all checks pass, call onNext
    onNext?.()
  }

  // Helper to set payment method (and clear errors)
  const handleMethodChange = (value: 'till' | 'phone' | 'bank') => {
    setError(null)
    setFormData({ paymentMethod: value })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <FieldGroup>
          {/* ... (Header remains the same) ... */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/apple-icon.png"
              alt="vendly logo"
              width={32}
              height={32}
            />
            <span className="font-bold text-lg text-foreground">vendly.</span>
          </Link>
          <h1 className="!text-lg !font-semibold text-muted-foreground">
            How you'll get paid
          </h1>

          {/* ... (Radio Group Card selection remains the same) ... */}
           <Field>
            <FieldLabel>Payout Method</FieldLabel>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) => handleMethodChange(value as any)}
              className="grid grid-cols-3 gap-4 pt-2"
            >
              {/* Card 1: Till Number */}
              <div>
                <RadioGroupItem value="till" id="till" className="sr-only" />
                <Label
                  htmlFor="till"
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-lg border p-4 cursor-pointer transition-colors",
                    "hover:border-muted-foreground",
                    formData.paymentMethod === 'till'
                      ? "border-primary ring-2 ring-primary"
                      : "border-muted"
                  )}
                >
                  <ReceiptText className="h-6 w-6" />
                  <span className="text-sm font-medium">Till</span>
                </Label>
              </div>

              {/* Card 2: Phone Number */}
              <div>
                <RadioGroupItem value="phone" id="phone" className="sr-only" />
                <Label
                  htmlFor="phone"
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-lg border p-4 cursor-pointer transition-colors",
                    "hover:border-muted-foreground",
                    formData.paymentMethod === 'phone'
                      ? "border-primary ring-2 ring-primary"
                      : "border-muted"
                  )}
                >
                  <Smartphone className="h-6 w-6" />
                  <span className="text-sm font-medium">Phone</span>
                </Label>
              </div>

              {/* Card 3: Bank Account */}
              <div>
                <RadioGroupItem value="bank" id="bank" className="sr-only" />
                <Label
                  htmlFor="bank"
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-lg border p-4 cursor-pointer transition-colors",
                    "hover:border-muted-foreground",
                    formData.paymentMethod === 'bank'
                      ? "border-primary ring-2 ring-primary"
                      : "border-muted"
                  )}
                >
                  <Landmark className="h-6 w-6" />
                  <span className="text-sm font-medium">Bank</span>
                </Label>
              </div>
            </RadioGroup>
          </Field>
          
          {/* ----- CONDITIONAL FIELDS (REMOVED `required`) ----- */}

          {/* --- 1. M-Pesa Till --- */}
          {formData.paymentMethod === "till" && (
            <Field>
              <FieldLabel htmlFor="till-number">Till Number</FieldLabel>
              <Input
                id="till-number"
                type="text"
                placeholder="e.g., 555444"
                // required (REMOVED)
                value={formData.mpesaTillNumber || ""}
                onChange={(e) => setFormData({ mpesaTillNumber: e.target.value })}
              />
            </Field>
          )}

          {/* --- 2. M-Pesa Phone --- */}
          {formData.paymentMethod === "phone" && (
            <Field>
              <FieldLabel htmlFor="phone-number">M-Pesa Phone Number</FieldLabel>
              <Input
                id="phone-number"
                type="tel"
                placeholder="+254 712 345 678"
                // required (REMOVED)
                value={formData.mpesaPhoneNumber || ""}
                onChange={(e) => setFormData({ mpesaPhoneNumber: e.target.value })}
              />
            </Field>
          )}

          {/* --- 3. Bank Account --- */}
          {formData.paymentMethod === "bank" && (
            <>
              <Field>
                <FieldLabel htmlFor="bank-name">Bank Name</FieldLabel>
                <Input
                  id="bank-name"
                  type="text"
                  placeholder="e.g., Equity Bank"
                  // required (REMOVED)
                  value={formData.bankName || ""}
                  onChange={(e) => setFormData({ bankName: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="account-name">Account Name</FieldLabel>
                <Input
                  id="account-name"
                  type="text"
                  placeholder="John Doe"
                  // required (REMOVED)
                  value={formData.bankAccountName || ""}
                  onChange={(e) => setFormData({ bankAccountName: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="account-number">Account Number</FieldLabel>
                <Input
                  id="account-number"
                  type="text"
                  placeholder="0123456789"
                  // required (REMOVED)
                  value={formData.bankAccountNumber || ""}
                  onChange={(e) => setFormData({ bankAccountNumber: e.target.value })}
                />
              </Field>
            </>
          )}

          {/* --- NEW ERROR MESSAGE DISPLAY --- */}
          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack} className="cursor-pointer">
                Back
              </Button>
            )}
            <Button type="submit" className="cursor-pointer flex-1">
              Continue
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}