import { Button } from "@vendly/ui/components/button";
import Link from "next/link";

import OnboardingShell from "@/components/onboarding/OnboardingShell";

export function SuccessScreen() {
  return (
    <OnboardingShell
      title="Success"
      description="Your store is ready"
    >
      <div className="flex flex-col gap-6">
        <p className="text-sm text-muted-foreground text-center">
          You can now start adding products and selling.
        </p>
        <Link href="/">
          <Button className="w-full" type="button">
            Go to dashboard
          </Button>
        </Link>
      </div>
    </OnboardingShell>
  );
}
