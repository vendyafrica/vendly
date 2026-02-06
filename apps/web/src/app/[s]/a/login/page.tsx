"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { LoginForm } from "@/app/(auth)/components/login-form";

function LoginInner({ storeSlug }: { storeSlug: string }) {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const canonicalBase = `/a/${storeSlug}`;
  const legacyBase = `/${storeSlug}/a`;

  const normalizedNext = next
    ? next.startsWith(legacyBase)
      ? `${canonicalBase}${next.slice(legacyBase.length)}`
      : next
    : null;

  const redirectTo = normalizedNext && normalizedNext.startsWith(canonicalBase) ? normalizedNext : canonicalBase;
  const title = `Welcome to ${storeSlug} Admin`;

  return <LoginForm title={title} redirectTo={redirectTo} />;
}

export default function StoreAdminLoginPage() {
  const params = useParams();
  const storeSlug = params?.s as string;

  return (
    <div className="relative min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="relative z-10 w-full bg-white shadow-xl rounded-t-2xl p-6 pb-12 sm:max-w-md sm:rounded-xl sm:p-8 sm:pb-8 sm:mb-0">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted sm:hidden" />
        <Suspense fallback={<div>Loading...</div>}>
          <LoginInner storeSlug={storeSlug} />
        </Suspense>
      </div>
    </div>
  );
}
