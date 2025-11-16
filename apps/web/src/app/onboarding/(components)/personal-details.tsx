import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"

export function PersonalDetailsForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8 space-y-6">
            <FieldGroup className="space-y-6">
              
              {/* Logo */}
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
                <span className="font-bold text-lg text-foreground">
                  vendly.
                </span>
              </Link>

              {/* Full Name */}
              <Field className="space-y-2">
                <FieldLabel htmlFor="full-name">Full Name</FieldLabel>
                <Input
                  id="full-name"
                  type="text"
                  placeholder="e.g., Sarah Naliaka"
                  required
                />
              </Field>

              {/* Phone Number */}
              <Field className="space-y-2">
                <FieldLabel htmlFor="phone-number">Phone Number</FieldLabel>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="+254 712 345 678"
                  required
                />
              </Field>

              {/* Password */}
              <Field className="space-y-2">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" required />
              </Field>

              {/* Confirm Password */}
              <Field className="space-y-2">
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input id="confirm-password" type="password" required />
              </Field>

              {/* Submit Button */}
              <Field>
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </Field>
            </FieldGroup>
          </form>

          {/* Side Illustration */}
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/assets/owner.png"
              alt="Personal Details Illustration"
              width={400}
              height={400}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
