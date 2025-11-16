"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { HTMLAttributes } from "react"

interface PersonalDetailsFormProps extends HTMLAttributes<HTMLDivElement> {
  onNext?: () => void;
  currentStep?: number;
}

export function PersonalDetailsForm({
  className,
  onNext,
  currentStep = 1,
  ...props
}: PersonalDetailsFormProps) {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ... your validation logic
    onNext?.() // Call the onNext callback
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
          <Field>
            <FieldLabel htmlFor="full-name">Full Name</FieldLabel>
            <Input
              id="full-name"
              type="text"
              placeholder="John Doe"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="phone-number">Phone Number</FieldLabel>
            <Input
              id="phone-number"
              type="tel"
              placeholder="+254 4567890"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="********"
              required
            />
          </Field>
          <Field>
            <Button type="submit" className="cursor-pointer">Continue</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}