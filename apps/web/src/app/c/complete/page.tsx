"use client";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@vendly/ui/components/empty";
import { useOnboarding } from "../context/onboarding-context";

export default function Complete() {
  const { data, isLoading } = useOnboarding();

  // Show loading state
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-lg rounded-xl p-6 md:p-8 shadow-sm bg-background">
        <Empty className="w-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </EmptyMedia>
            <EmptyTitle className="text-lg font-semibold">
              Setting up your store
            </EmptyTitle>
            <EmptyDescription className="text-sm text-muted-foreground">
              Please wait while we set up your store. Do not refresh the page.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  // Show welcome email sent confirmation
  return (
    <div className="mx-auto w-full max-w-lg rounded-xl p-6 md:p-8 shadow-sm bg-background">
      <Empty className="w-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </EmptyMedia>
          <EmptyTitle className="text-lg font-semibold">
            Your store is ready!
          </EmptyTitle>
          <EmptyDescription className="text-sm text-muted-foreground max-w-sm">
            Congratulations {data.personal?.fullName?.split(" ")[0] || "there"}!
            {data.store?.storeName ? ` Your store "${data.store.storeName}" has been created.` : " Your store has been created."}
          </EmptyDescription>
          <EmptyDescription className="text-sm text-muted-foreground max-w-sm mt-2">
            We&apos;ve sent a welcome email to your inbox. Click the link in the email to verify your account and access your dashboard.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
