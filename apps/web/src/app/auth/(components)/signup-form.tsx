"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Google } from "@/components/ui/svgs/google"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-8 md:p-10">
            <div className="mb-6">
              <CardTitle className="text-2xl mb-2">Create an account</CardTitle>
              <CardDescription>
                Enter your information below to create your account
              </CardDescription>
            </div>
            
            <FieldGroup>
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
                <Button
                  onClick={handleSubmit}
                  className="w-full"
                >
                  Create Account
                </Button>
              </Field>
              
              <FieldSeparator>Or</FieldSeparator>
              
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                >
                  <Google className="size-5 mr-2" />
                  Continue with Google
                </Button>
              </Field>
              
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <a href="#" className="underline hover:text-primary">
                  Sign in
                </a>
              </FieldDescription>
            </FieldGroup>
          </div>
          
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop"
              alt="Signup illustration"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      
      <FieldDescription className="text-center text-sm">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-primary">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  )
}