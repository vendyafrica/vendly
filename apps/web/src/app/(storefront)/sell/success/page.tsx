import { Suspense } from "react";
import { SuccessScreen } from "@/components/onboarding/success";

function SuccessLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <SuccessScreen />
    </Suspense>
  );
}
