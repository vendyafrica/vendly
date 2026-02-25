"use client";

import { useState } from "react";
import { Button } from "@vendly/ui/components/button";
import { signInWithTikTok } from "@vendly/auth/react";

export default function TikTokAuthTestPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTikTokSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const callbackURL = typeof window !== "undefined" ? window.location.origin + "/a" : "/a";
      const res = await signInWithTikTok({ callbackURL });
      if (res?.error) {
        setError(res.error.message || "Failed to start TikTok login.");
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start TikTok login.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">TikTok Login Test</h1>
          <p className="text-sm text-muted-foreground">
            Use this page to trigger the TikTok social login flow for testing.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          type="button"
          variant="default"
          className="w-full h-11"
          onClick={handleTikTokSignIn}
          disabled={loading}
        >
          {loading ? "Redirecting to TikTok…" : "Continue with TikTok"}
        </Button>
      </div>
    </div>
  );
}
