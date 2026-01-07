"use client";

import { Puck, Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { puckConfig, type Components, type RootProps } from "@/lib/puck-config";

// Initial data for a new page
const getInitialData = (storeName: string): Data<Components, RootProps> => ({
  content: [
    {
      type: "HeaderBlock",
      props: {
        id: "header-1",
        storeName: storeName,
        backgroundColor: "#1a1a2e",
        textColor: "#ffffff",
      },
    },
    {
      type: "HeroBlock",
      props: {
        id: "hero-1",
        label: "Urban Style",
        title: `Discover ${storeName}'s Collection`,
        subtitle: "Explore our curated selection of premium products designed for the modern lifestyle.",
        ctaText: "Discover Now",
        ctaLink: "/products",
        backgroundColor: "#4a6fa5",
        textColor: "#ffffff",
      },
    },
    {
      type: "ProductGridBlock",
      props: {
        id: "products-1",
        title: "Featured Products",
        showTitle: true,
        columns: 4,
        maxProducts: 8,
      },
    },
    {
      type: "FooterBlock",
      props: {
        id: "footer-1",
        showNewsletter: true,
        newsletterTitle: "Subscribe to our newsletter",
        newsletterSubtitle: "Get the latest updates on new products and upcoming sales",
        backgroundColor: "#1a1a2e",
        textColor: "#ffffff",
      },
    },
  ],
  root: {
    props: {
      title: "Home",
      description: "Welcome to our store",
      backgroundColor: "#ffffff",
      primaryColor: "#1a1a2e",
      headingFont: "Inter",
      bodyFont: "Inter",
    },
  },
  zones: {},
});

export default function StoreEditorPage() {
  const params = useParams<{ tenant: string }>();
  const tenant = params.tenant || "store";
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  
  const [data, setData] = useState<Data<Components, RootProps> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Fetch existing page data
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/storefront/${tenant}/page-data`);
        if (res.ok) {
          const result = await res.json();
          if (result.data?.pageData) {
            setData(result.data.pageData);
          } else {
            // Use initial data for new stores
            setData(getInitialData(tenant.charAt(0).toUpperCase() + tenant.slice(1)));
          }
        } else {
          setData(getInitialData(tenant.charAt(0).toUpperCase() + tenant.slice(1)));
        }
      } catch (error) {
        console.error("Error fetching page data:", error);
        setData(getInitialData(tenant.charAt(0).toUpperCase() + tenant.slice(1)));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPageData();
  }, [apiBaseUrl, tenant]);

  // Save page data
  const handlePublish = useCallback(async (newData: Data<Components, RootProps>) => {
    setIsSaving(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/storefront/${tenant}/page-data`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageData: newData }),
      });
      
      if (res.ok) {
        setLastSaved(new Date());
        setData(newData);
      } else {
        console.error("Failed to save page data");
      }
    } catch (error) {
      console.error("Error saving page data:", error);
    } finally {
      setIsSaving(false);
    }
  }, [apiBaseUrl, tenant]);

  if (isLoading || !data) {
    return (
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40,
            height: 40,
            border: "3px solid #e0e0e0",
            borderTopColor: "#1a1a2e",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem",
          }} />
          <p style={{ color: "#666" }}>Loading editor...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh" }}>
      <Puck
        config={puckConfig}
        data={data}
        onPublish={handlePublish}
        headerTitle={`${tenant} - Store Editor`}
        headerPath={`/${tenant}/store`}
        viewports={[
          { width: 1440, label: "Desktop", icon: "Monitor" },
          { width: 768, label: "Tablet", icon: "Tablet" },
          { width: 375, label: "Mobile", icon: "Smartphone" },
        ]}
      />
      
      {/* Save status indicator */}
      {lastSaved && (
        <div style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#10b981",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          fontSize: "0.875rem",
          zIndex: 9999,
        }}>
          ✓ Saved at {lastSaved.toLocaleTimeString()}
        </div>
      )}
      
      {isSaving && (
        <div style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#1a1a2e",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          fontSize: "0.875rem",
          zIndex: 9999,
        }}>
          Saving...
        </div>
      )}
    </div>
  );
}
