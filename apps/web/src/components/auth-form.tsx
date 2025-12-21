import { cn } from "@/lib/utils"
import { Button } from "@vendly/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@vendly/ui/components/field"
import { Input } from "@vendly/ui/components/input"
import Image from "next/image"
import { Google } from "@vendly/ui/components/svgs/google"
import { Apple } from "@vendly/ui/components/svgs/apple"

export function AuthForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Image src="/icon.png" alt="vendly logo" width={32} height={32} />
              </div>
              <span className="sr-only">vendly .</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to vendly</h1>
            <FieldDescription>
              Already have an account? <a href="#">Sign in</a>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </Field>
          <Field>
            <Button type="submit">Create Account</Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" type="button">
              <Apple />
              Continue with Apple
            </Button>
            <Button variant="outline" type="button">
              <Google />
              Continue with Google
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
