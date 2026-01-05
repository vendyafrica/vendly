'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@vendly/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@vendly/ui/components/card";
import { useOnboarding } from '@/contexts/OnboardingContext';

type JobStatus = 'queued' | 'running' | 'failed' | 'ready';

type StatusResponse = {
  jobId: string;
  tenantSlug: string;
  status: JobStatus;
  readyUrl?: string;
  error?: string;
};

export function SuccessScreen() {
  const searchParams = useSearchParams();
  const { resetData } = useOnboarding();

  const jobId = searchParams.get('jobId');
  const subdomain = searchParams.get('subdomain');

  const [status, setStatus] = useState<JobStatus | 'idle'>('idle');
  const [error, setError] = useState<string | undefined>(undefined);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'vendlyafrica.store';
  const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  // For localhost development, use localhost URLs with proper ports
  const storeUrl = isDev 
    ? `http://${subdomain}.localhost:3000`
    : `https://${subdomain}.${rootDomain}`;
  const adminUrl = isDev 
    ? `http://localhost:4000/${subdomain}`
    : `https://admin.${rootDomain}/${subdomain}`;
  
  // Fallback localhost path-based URL for browsers that don't support *.localhost
  const storeUrlFallback = `http://localhost:3000/${subdomain}`;

  useEffect(() => {
    if (!jobId) return;

    let stopped = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      try {
        const res = await fetch(
          `${apiBaseUrl}/api/site-builder/status?jobId=${encodeURIComponent(jobId)}`,
          { cache: 'no-store' }
        );

        if (!res.ok) {
          const message = await res.text();
          throw new Error(message || 'Failed to fetch status');
        }

        const data = (await res.json()) as StatusResponse;
        if (stopped) return;

        setStatus(data.status);
        setError(data.error);

        if (data.status === 'ready') {
          resetData();
          return;
        }

        if (data.status === 'failed') {
          return;
        }

        timeout = setTimeout(poll, 1500);
      } catch (e) {
        if (stopped) return;
        const message = e instanceof Error ? e.message : 'Unknown error';
        setError(message);
        setStatus('failed');
      }
    };

    void poll();

    return () => {
      stopped = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [apiBaseUrl, jobId, resetData]);

  const isLoading = status === 'idle' || status === 'queued' || status === 'running';
  const isReady = status === 'ready';
  const isFailed = status === 'failed';

  if (!jobId || !subdomain) {
    return (
      <Card className="w-full max-w-4xl rounded-2xl py-10">
        <CardHeader className="px-10 text-center">
          <CardTitle className="text-xl">Missing Information</CardTitle>
          <CardDescription>
            Could not find job information. Please start the onboarding again.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10">
          <Link href="/sell">
            <Button className="w-full">Start Over</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl rounded-2xl py-10">
      <CardHeader className="px-10 text-center">
        {isLoading && (
          <>
            <div className="mx-auto mb-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
            <CardTitle className="text-xl">Creating Your Store</CardTitle>
            <CardDescription>
              We&apos;re generating your storefront. This usually takes a few seconds...
            </CardDescription>
          </>
        )}

        {isReady && (
          <>
            <div className="mx-auto mb-4">
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
            </div>
            <CardTitle className="text-xl">Your Store is Ready!</CardTitle>
            <CardDescription>
              Your storefront at <span className="font-medium">{subdomain}.{rootDomain}</span> is live.
            </CardDescription>
          </>
        )}

        {isFailed && (
          <>
            <div className="mx-auto mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <CardTitle className="text-xl">Something Went Wrong</CardTitle>
            <CardDescription>
              {error || 'Failed to generate your storefront. Please try again.'}
            </CardDescription>
          </>
        )}
      </CardHeader>

      <CardContent className="px-10">
        {isLoading && (
          <div className="text-center text-sm text-muted-foreground">
            Status: <span className="font-medium capitalize">{status}</span>
          </div>
        )}

        {isReady && (
          <div className="flex flex-col gap-3">
            <a href={storeUrl} target="_blank" rel="noreferrer">
              <Button className="w-full" variant="default">
                View Your Store
              </Button>
            </a>
            {isDev && (
              <a href={storeUrlFallback} target="_blank" rel="noreferrer">
                <Button className="w-full" variant="secondary">
                  View Store (Fallback)
                </Button>
              </a>
            )}
            <a href={adminUrl} target="_blank" rel="noreferrer">
              <Button className="w-full" variant="outline">
                Go to Admin Dashboard
              </Button>
            </a>
          </div>
        )}

        {isFailed && (
          <Link href="/sell/store-setup">
            <Button className="w-full" variant="outline">
              Try Again
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
