import { Button } from "@vendly/ui/components/button";
import Link from "next/link";

export function SuccessScreen() {
  return (
    <div className="w-full max-w-4xl rounded-2xl py-10 gap-10">
      <div className="px-10">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight">Success</h1>
          <p className="text-muted-foreground text-sm text-balance mt-1">
            Your store is ready
          </p>
        </div>
      </div>
      <div className="px-10">
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
      </div>
    </div>
  );
}
