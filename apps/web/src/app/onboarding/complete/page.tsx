"use client";

import { Button } from "@vendly/ui/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@vendly/ui/components/empty"
import { Spinner } from "@vendly/ui/components/spinner"
import { useRouter } from "next/navigation"

export default function Complete() {
  const router = useRouter();
  return (
    <div className="mx-auto w-full max-w-lg rounded-xl p-6 md:p-8 ">
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Setting up your store</EmptyTitle>
        <EmptyDescription>
          Please wait while we set up your store. Do not refresh the page.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="destructive" size="lg" className="w-[200px]" onClick={() => router.push("/")}>
          Cancel
        </Button>
      </EmptyContent>
    </Empty>
    </div>
  )
}
