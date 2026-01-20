"use client";

import { Button } from "@vendly/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@vendly/ui/components/empty";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../context/onboarding-context";

export default function Complete() {
  const router = useRouter();
  const { data, isComplete, isLoading } = useOnboarding();

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

  // Show success state
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
            🎉 Your store is ready!
          </EmptyTitle>
          <EmptyDescription className="text-sm text-muted-foreground">
            Congratulations {data.personal?.fullName?.split(" ")[0]}!
            Your store &quot;{data.store?.storeName}&quot; has been created successfully.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="space-y-3">
          <Button
            size="lg"
            className="w-full cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full cursor-pointer"
            onClick={() => {
              // Navigate to the store preview
              const storeSlug = data.store?.storeName
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
              router.push(`/${storeSlug || "store"}`);
            }}
          >
            Preview Store
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
