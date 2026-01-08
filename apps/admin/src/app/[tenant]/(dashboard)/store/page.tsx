"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@vendly/ui/components/button";
import { RefreshCw, Eye, Check, Monitor, Tablet, Smartphone } from "lucide-react";

type DevicePreview = "desktop" | "tablet" | "mobile";

const deviceWidths: Record<DevicePreview, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

interface PageData {
  content: Array<{ type: string; props: Record<string, unknown> }>;
  root: { props: Record<string, unknown> };
}

export default function StoreEditorPage() {
  const params = useParams<{ tenant: string }>();
  const tenant = params.tenant || "";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [devicePreview, setDevicePreview] = useState<DevicePreview>("desktop");
  const [iframeKey, setIframeKey] = useState(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Storefront URL with edit mode enabled
  const storefrontUrl = `http://${tenant}.localhost:3000?editMode=true`;

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${apiBaseUrl}/api/storefront/${tenant}/page-data`);
        if (res.ok) {
          const result = await res.json();
          if (result.data?.pageData) {
            setPageData(result.data.pageData);
          }
        }
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [apiBaseUrl, tenant]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "PROP_UPDATED") {
        // When a prop is updated in the iframe, save it
        const { blockIndex, prop, value } = event.data;

        setPageData(prev => {
          if (!prev) return prev;

          const updated = {
            ...prev,
            content: prev.content.map((block, i) => {
              if (i === blockIndex) {
                return {
                  ...block,
                  props: {
                    ...block.props,
                    [prop]: value,
                  },
                };
              }
              return block;
            }),
          };

          // Auto-save
          autoSave(updated);
          return updated;
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Auto-save with debouncing
  const autoSave = useCallback(async (data: PageData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        const res = await fetch(`${apiBaseUrl}/api/storefront/${tenant}/page-data`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageData: data }),
        });
        if (res.ok) {
          setLastSaved(new Date());
          // Refresh iframe
          setIframeKey(prev => prev + 1);
        }
      } catch (error) {
        console.error("Error saving:", error);
      } finally {
        setIsSaving(false);
      }
    }, 1500);
  }, [apiBaseUrl, tenant]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Minimal Top Bar */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-medium text-sm">{tenant}</span>

          {/* Save Status */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {isSaving ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <Check className="w-3 h-3 text-green-600" />
                <span>Saved</span>
              </>
            ) : (
              <span className="text-gray-400">Click elements to edit</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Device Preview Switcher */}
          <div className="flex bg-gray-100 rounded p-0.5">
            {(["desktop", "tablet", "mobile"] as DevicePreview[]).map((device) => (
              <button
                key={device}
                onClick={() => setDevicePreview(device)}
                className={`p-1.5 rounded transition ${devicePreview === device ? "bg-white shadow-sm" : ""}`}
                title={device}
              >
                {device === "desktop" && <Monitor className="w-4 h-4" />}
                {device === "tablet" && <Tablet className="w-4 h-4" />}
                {device === "mobile" && <Smartphone className="w-4 h-4" />}
              </button>
            ))}
          </div>

          <Button variant="ghost" size="sm" onClick={() => setIframeKey(prev => prev + 1)}>
            <RefreshCw className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`http://${tenant}.localhost:3000`, "_blank")}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Full-width Preview */}
      <div className="flex-1 overflow-hidden flex justify-center items-start p-4">
        <div
          className="bg-white shadow-lg rounded-lg overflow-hidden transition-all"
          style={{
            width: deviceWidths[devicePreview],
            maxWidth: "100%",
            height: "calc(100vh - 80px)",
          }}
        >
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={storefrontUrl}
            className="w-full h-full border-0"
            title="Store Preview"
          />
        </div>
      </div>

      {/* Helper Tooltip */}
      {!lastSaved && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
          Click on any section in the preview to edit it
        </div>
      )}
    </div>
  );
}
