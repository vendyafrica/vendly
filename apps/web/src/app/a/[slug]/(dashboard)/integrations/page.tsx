"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useTenant } from "../tenant-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vendly/ui/components/card";
import { Button } from "@vendly/ui/components/button";

export default function IntegrationsPage() {
  const params = useSearchParams();
  const paramConnected = params.get("connected") === "true";

  const { bootstrap, error } = useTenant();
  const storeId = bootstrap?.storeId;

  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const [importError, setImportError] = React.useState<string | null>(null);
  const [syncError, setSyncError] = React.useState<string | null>(null);
  const [isConnectedFromApi, setIsConnectedFromApi] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = React.useState(false);

  // Check status on mount
  React.useEffect(() => {
    fetch("/api/integrations/instagram/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.connected) setIsConnectedFromApi(true);
      })
      .catch((e) => console.error("Failed to check instagram status", e));
  }, []);

  const connected = paramConnected || isConnectedFromApi;

  // Sync effect - primarily for after-auth callback
  React.useEffect(() => {
    const shouldSync = paramConnected && Boolean(storeId);
    if (!shouldSync) return;

    let cancelled = false;

    const run = async () => {
      try {
        setSyncError(null);
        const res = await fetch("/api/integrations/instagram/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storeId }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Instagram sync failed");
        }

        // After sync, ensure we mark as connected
        if (!cancelled) {
          setIsConnectedFromApi(true);
        }
      } catch (e) {
        if (!cancelled) {
          setSyncError(e instanceof Error ? e.message : "Instagram sync failed");
        }
      }
    };
    void run();

    return () => {
      cancelled = true;
    };
  }, [paramConnected, storeId]);

  const handleConnect = async () => {
    if (!bootstrap?.storeSlug) return;

    setIsConnecting(true);
    try {
      const { linkInstagram } = await import("@vendly/auth/client");
      await linkInstagram({
        callbackURL: `/a/${bootstrap.storeSlug}/integrations?connected=true`,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleImport = async () => {
    if (!bootstrap?.storeId) return;

    setIsImporting(true);
    setImportError(null);

    try {
      const res = await fetch("/api/integrations/instagram/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId: bootstrap.storeId }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Import failed");
      }
    } catch (e) {
      setImportError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setIsImporting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(false);

    try {
      const res = await fetch("/api/integrations/instagram", { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete Instagram data");
      }

      setIsConnectedFromApi(false);
      setDeleteSuccess(true);
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Failed to delete Instagram data");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Integrations</h1>
        <p className="text-sm text-muted-foreground">Connect your tools to keep Vendly in sync.</p>
      </div>

      {error && <div className="bg-destructive/10 text-destructive p-4 rounded-md">{error}</div>}

      <Card className="border border-border/70 shadow-none">
        <CardHeader>
          <CardTitle>Instagram</CardTitle>
          <CardDescription>Connect your Instagram account and import posts into products.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={handleConnect} disabled={isConnecting || !bootstrap?.storeSlug}>
            {isConnecting ? "Connecting..." : connected ? "Reconnect Instagram" : "Connect Instagram"}
          </Button>

          <div className="text-sm text-muted-foreground">
            {connected ? "Connected. You can import products now." : "Not connected yet."}
          </div>

          {syncError && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{syncError}</div>}

          <Button onClick={handleImport} disabled={!connected || isImporting || !bootstrap?.storeId} variant="outline">
            {isImporting ? "Importing..." : "Import products"}
          </Button>

          {importError && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{importError}</div>
          )}

          <div className="pt-2 space-y-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || !connected}
            >
              {isDeleting ? "Deleting..." : "Disconnect & delete Instagram data"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Removes tokens and Instagram account data stored by Vendly. Imported products remain.
            </p>
            {deleteError && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{deleteError}</div>
            )}
            {deleteSuccess && (
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-md text-sm">
                Instagram connection removed and data deleted.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
