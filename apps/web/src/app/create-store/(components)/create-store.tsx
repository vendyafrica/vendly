// app/create-store/(components)/create-store.tsx
"use client"

import { useState, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useSteps } from "./step-context"

interface CreateStoreFormProps extends HTMLAttributes<HTMLDivElement> {
  onNext?: () => void;
  onPrev?: () => void;
  currentStep?: number;
}

export function CreateStoreForm({
  className,
  onNext,
  onPrev,
  currentStep = 1,
  ...props
}: CreateStoreFormProps) {
  const { formData, setFormData } = useSteps();
  const router = useRouter()
  
  const [error, setError] = useState<string | null>(null)

  const createSlug = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, "-")
  }

  // --- UPDATED HANDLESUBMIT ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    // --- REMOVED storeName check ---
    if (!formData.slug) {
      setError("Please enter a store name.") // Error message is fine
      return
    }
    if (!formData.pickupCounty) {
      setError("Please enter your store's location.") // Simplified message
      return
    }
    if (!formData.pickupBuilding) {
      setError("Please enter your store's building or area.")
      return
    }

    onNext?.()
  }
  
  // --- REMOVED handleStoreNameChange ---
  // This is no longer needed as there is no separate storeName input
  
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Also update slug here, but we can also update storeName
    // to be the same value just in case we need it.
    const newSlug = createSlug(e.target.value);
    setFormData({ 
      slug: newSlug,
      storeName: e.target.value // Keep storeName in sync with the slug input
    });
  };


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <FieldGroup>
          {/* ... (Header remains the same) ... */}
          {currentStep > 1 ? (
            <button
              type="button" 
              onClick={onPrev}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/apple-icon.png"
                alt="vendly logo"
                width={32}
                height={32}
              />
              <span className="font-bold text-lg text-foreground">vendly.</span>
            </button>
          ) : (
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
          )}

          <h1 className="!text-lg !font-semibold text-muted-foreground">
            Tell us about your store
          </h1>
          <Field>
            {/* This is your new "Store Name" field which is actually the slug */}
            <FieldLabel htmlFor="slug">Store Name</FieldLabel>
            <ButtonGroup>
              <InputGroup>
                <InputGroupInput
                  id="slug"
                  placeholder="zara-store"
                  // Use formData.storeName so the user sees the non-slugified text
                  value={formData.storeName || ""} 
                  onChange={handleSlugChange}
                />
              </InputGroup>
              <ButtonGroupText asChild>
                <Label htmlFor="slug">.vendly.africa</Label>
              </ButtonGroupText>
            </ButtonGroup>
            <FieldDescription>
              {/* Show the resulting slug as a preview */}
              Your unique store URL will be: {formData.slug ? <span className="text-primary cursor-pointer underline">{formData.slug}.vendly.africa</span> : "..."}
            </FieldDescription>
          </Field>
          
          {/* ----- NEW LOCATION FIELDS ----- */}
          <Field>
            <FieldLabel htmlFor="county">Location</FieldLabel>
            <Input
              id="county"
              type="text"
              placeholder="e.g., Nairobi"
              value={formData.pickupCounty || ""}
              onChange={(e) => setFormData({ pickupCounty: e.target.value })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="building">Building, Estate, or Area</FieldLabel>
            <Input
              id="building"
              type="text"
              placeholder="e.g., ABC Plaza, Westlands"
              value={formData.pickupBuilding || ""}
              onChange={(e) => setFormData({ pickupBuilding: e.target.value })}
            />
             <FieldDescription>
              This will be your default pickup location.
            </FieldDescription>
          </Field>
          {/* ----- END OF NEW FIELDS ----- */}

          {/* --- NEW ERROR MESSAGE --- */}
          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            {onPrev && (
              <Button type="button" variant="outline" onClick={onPrev} className="cursor-pointer">
                Back
              </Button>
            )}
            <Button type="submit" className="cursor-pointer flex-1">
              Create Store
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}