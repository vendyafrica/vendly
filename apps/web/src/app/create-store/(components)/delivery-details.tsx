"use client"

import { HTMLAttributes, useState } from "react" // Added useState
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import Image from "next/image"
import { useSteps } from "./step-context"
import { PackageCheck, UserRound } from "lucide-react"

interface DeliveryDetailsProps extends HTMLAttributes<HTMLDivElement> {
  onBack?: () => void;
  onFinish?: () => void;
}

export function DeliveryDetails({
  className,
  onBack,
  onFinish,
  ...props
}: DeliveryDetailsProps) {
  const { formData, setFormData } = useSteps()
  
  // --- NEW ---
  const [error, setError] = useState<string | null>(null)

  // --- UPDATED HANDLESUBMIT ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!formData.deliveryMethod) {
      setError("Please select a delivery method.")
      return
    }
    
    onFinish?.()
  }
  
  const handleMethodChange = (value: 'vendly' | 'self') => {
    setError(null)
    setFormData({ deliveryMethod: value })
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
            Delivery Setup
          </h1>

          {/* ----- SECTION 1: REMOVED ----- */}
          {/* The County and Building fields have been moved to create-store.tsx */}

          {/* Section 2: Fulfillment Method */}
          <Field className="pt-4">
            <FieldLabel>How will you fulfill orders?</FieldLabel>
            <RadioGroup
              value={formData.deliveryMethod}
              onValueChange={(value) => handleMethodChange(value as any)}
              className="grid grid-cols-2 gap-4 pt-2"
            >
              {/* ... (Card 1: Vendly Managed - no change) ... */}
              <div>
                <RadioGroupItem value="vendly" id="vendly" className="sr-only" />
                <Label
                  htmlFor="vendly"
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-lg border p-4 cursor-pointer transition-colors h-full",
                    "hover:border-muted-foreground",
                    formData.deliveryMethod === 'vendly'
                      ? "border-primary ring-2 ring-primary"
                      : "border-muted"
                  )}
                >
                  <PackageCheck className="h-6 w-6" />
                  <span className="text-sm font-medium text-center">Vendly Managed</span>
                  <p className="text-xs text-muted-foreground text-center">Use our partner couriers</p>
                </Label>
              </div>
              
              {/* ... (Card 2: Self-Fulfillment - no change) ... */}
              <div>
                <RadioGroupItem value="self" id="self" className="sr-only" />
                <Label
                  htmlFor="self"
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-lg border p-4 cursor-pointer transition-colors h-full",
                    "hover:border-muted-foreground",
                    formData.deliveryMethod === 'self'
                      ? "border-primary ring-2 ring-primary"
                      : "border-muted"
                  )}
                >
                  <UserRound className="h-6 w-6" />
                  <span className="text-sm font-medium text-center">Self-Fulfillment</span>
                  <p className="text-xs text-muted-foreground text-center">You handle deliveries</p>
                </Label>
              </div>
            </RadioGroup>
          </Field>
          
          {/* ----- NEW CONDITIONAL FIELD ----- */}
          {formData.deliveryMethod === 'vendly' && (
            <Field>
              <FieldLabel htmlFor="more-details">Pickup Details (Optional)</FieldLabel>
              <Input
                id="more-details"
                type="text"
                placeholder="e.g., Floor 3, Room 12"
                value={formData.pickupMoreDetails || ""}
                onChange={(e) => setFormData({ pickupMoreDetails: e.target.value })}
              />
              <FieldDescription>
                Add any specific details our couriers need to find you.
              </FieldDescription>
            </Field>
          )}

          {/* --- NEW ERROR MESSAGE --- */}
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
              Finish Setup
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}