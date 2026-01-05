"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type JobStatus = "queued" | "running" | "failed" | "ready";

type StatusResponse = {
  jobId: string;
  tenantSlug: string;
  status: JobStatus;
  readyUrl?: string;
  error?: string;
};

export default function StorePage() {
  const params = useParams<{ tenant: string }>();
  const searchParams = useSearchParams();

  const tenant = params.tenant;
  const jobId = searchParams.get("jobId");

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const rootDomain =
    process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "vendlyafrica.store";

  const tenantStorefrontUrl = useMemo(() => {
    return `https://${tenant}.${rootDomain}`;
  }, [tenant, rootDomain]);

  const [status, setStatus] = useState<JobStatus | "idle">("idle");
  const [error, setError] = useState<string | undefined>(undefined);
  const [readyUrl, setReadyUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!jobId) return;

    let stopped = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      try {
        const res = await fetch(
          `${apiBaseUrl}/api/site-builder/status?jobId=${encodeURIComponent(jobId)}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          const message = await res.text();
          throw new Error(message || "Failed to fetch status");
        }

        const data = (await res.json()) as StatusResponse;
        if (stopped) return;

        setStatus(data.status);
        setError(data.error);
        setReadyUrl(data.readyUrl);

        if (data.status === "ready" || data.status === "failed") {
          return;
        }

        timeout = setTimeout(poll, 1500);
      } catch (e) {
        if (stopped) return;
        const message = e instanceof Error ? e.message : "Unknown error";
        setError(message);
        setStatus("failed");
      }
    };

    void poll();

    return () => {
      stopped = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [apiBaseUrl, jobId]);

  const canShowPreview = status === "ready";
  const iframeSrc = readyUrl ?? tenantStorefrontUrl;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Store</h1>
          <p className="text-sm text-muted-foreground">
            Tenant: <span className="font-medium">{tenant}</span>
          </p>
        </div>

        <a
          className="text-sm underline text-muted-foreground"
          href={tenantStorefrontUrl}
          target="_blank"
          rel="noreferrer"
        >
          Open storefront
        </a>
      </div>

      {!jobId ? (
        <div className="rounded-xl border p-4">
          <p className="text-sm">
            Missing <code>jobId</code>. Start generation from the demo form again.
          </p>
        </div>
      ) : null}

      {jobId ? (
        <div className="rounded-xl border p-4">
          <div className="text-sm">
            <div>
              Status: <span className="font-medium">{status}</span>
            </div>
            {error ? <div className="mt-2 text-destructive">{error}</div> : null}
            {!error && status !== "ready" ? (
              <div className="mt-2 text-muted-foreground">
                Generating your storefront… this page will update automatically.
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-3 border-b text-sm text-muted-foreground">
          Preview
          {!canShowPreview ? " (waiting for generation to finish)" : ""}
        </div>
        <div className="aspect-video bg-muted/30">
          <iframe
            title="Store preview"
            src={iframeSrc}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
