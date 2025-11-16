// CreateStoreForm.tsx
"use client"

import { useState } from "react"
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
import { HTMLAttributes } from "react"

interface CreateStoreFormProps extends HTMLAttributes<HTMLDivElement> {
  onNext?: () => void;
  onPrev?: () => void;
}

export function CreateStoreForm({ 
  className, 
  onNext,
  onPrev,
  ...props 
}: CreateStoreFormProps) {
  const [slug, setSlug] = useState("")
  const [storeName, setStoreName] = useState("")
  const router = useRouter()

  const createSlug = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, "-")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add any form submission logic here (e.g., API call)
    onNext?.()
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <FieldGroup>
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
            Welcome to vendly.
          </h1>
          <Field>
            <FieldLabel htmlFor="store-name">Store Name</FieldLabel>
            <Input
              id="store-name"
              type="text"
              placeholder="vendlystore"
              required
              value={storeName}
              onChange={(e) => {
                setStoreName(e.target.value)
                setSlug(createSlug(e.target.value))
              }}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="slug">Store URL</FieldLabel>

            <ButtonGroup>
              <InputGroup>
                <InputGroupInput
                  id="slug"
                  placeholder="zara-store"
                  required
                  value={slug}
                  onChange={(e) => setSlug(createSlug(e.target.value))}
                />
              </InputGroup>
              <ButtonGroupText asChild>
                <Label htmlFor="slug">.vendly.africa</Label>
              </ButtonGroupText>
            </ButtonGroup>

            <FieldDescription>
              Your unique store URL where your customers can shop your products
            </FieldDescription>
            {slug && (
              <p className="text-xs text-muted-foreground mt-1">
                Preview:{" "}
                <span className="font-medium underline hover:text-primary cursor-pointer">
                  {slug}.vendly.africa
                </span>
              </p>
            )}
          </Field>

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