"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function StoreRedirect() {
  const params = useParams<{ tenant: string }>();
  const router = useRouter();

  useEffect(() => {
    if (params.tenant) {
      router.replace(`/${params.tenant}/studio`);
    }
  }, [params.tenant, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting to Visual Editor...</p>
    </div>
  );
}
