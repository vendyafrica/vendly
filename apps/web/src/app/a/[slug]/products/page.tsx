"use client";

import * as React from "react";
import { SegmentedStatsCard } from "../components/SegmentedStatsCard";
import { DataTable } from "../components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { AddProductButton } from "./components/add-product-button";
import { useTenant } from "../tenant-context";
import Image from "next/image";
import { Button } from "@vendly/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Edit02Icon, ViewIcon } from "@hugeicons/core-free-icons";
import { UploadModal } from "./components/upload-modal";
import { EditProductModal } from "./components/edit-product-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@vendly/ui/components/dialog";
import { useRouter } from "next/navigation";

type ProductMediaItem = {
  blobUrl: string;
  blobPathname?: string | null;
  contentType?: string | null;
};

type ProductApiRow = {
  id: string;
  storeId: string;
  productName: string;
  slug: string;
  description?: string | null;
  priceAmount: number;
  currency: string;
  quantity: number;
  status: "draft" | "ready" | "active" | "sold-out";
  media: ProductMediaItem[];
};

type ProductTableRow = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  priceAmount: number;
  currency: string;
  quantity: number;
  status: "draft" | "ready" | "active" | "sold-out";
  thumbnailUrl?: string;
};

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ProductsPage() {
  const router = useRouter();
  const { bootstrap, error: bootstrapError } = useTenant();

  const [rows, setRows] = React.useState<ProductTableRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<ProductApiRow | null>(null);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewProduct, setPreviewProduct] = React.useState<ProductTableRow | null>(null);

  const fetchProducts = React.useCallback(async () => {
    if (!bootstrap?.storeId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/products?storeId=${bootstrap.storeId}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load products");
      }

      const data = (await res.json()) as { products: ProductApiRow[] };
      const mapped: ProductTableRow[] = (data.products || []).map((p) => ({
        id: p.id,
        name: p.productName,
        slug: p.slug,
        description: p.description,
        priceAmount: p.priceAmount,
        currency: p.currency,
        quantity: p.quantity,
        status: p.status,
        thumbnailUrl: p.media?.[0]?.blobUrl,
      }));

      setRows(mapped);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [bootstrap?.storeId]);

  React.useEffect(() => {
    if (bootstrap?.storeId) fetchProducts();
  }, [bootstrap?.storeId, fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      await fetchProducts();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete product");
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Failed to load product");
      const product = (await res.json()) as ProductApiRow;
      setEditingProduct(product);
      setEditModalOpen(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to load product");
    }
  };

  const handleView = (row: ProductTableRow) => {
    setPreviewProduct(row);
    setPreviewOpen(true);
  };

  const columns: ColumnDef<ProductTableRow>[] = [
    {
      id: "product",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative size-10 overflow-hidden rounded-md bg-muted shrink-0">
            {row.original.thumbnailUrl ? (
              <Image
                src={row.original.thumbnailUrl}
                alt={row.original.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-xs text-muted-foreground">N/A</div>
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate font-medium" title={row.original.name}>
              {row.original.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatMoney(row.original.priceAmount, row.original.currency)}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Inventory",
      cell: ({ row }) => <span className="text-sm">{row.original.quantity}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const label = status === "active" ? "Active" : status === "ready" ? "Ready" : status === "sold-out" ? "Sold out" : "Draft";
        const tone = status === "active" ? "text-emerald-600" : status === "ready" ? "text-amber-600" : status === "sold-out" ? "text-rose-600" : "text-muted-foreground";
        return <span className={`text-sm font-medium ${tone}`}>{label}</span>;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleView(row.original)}
            className="h-9 w-9"
          >
            <HugeiconsIcon icon={ViewIcon} className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original.id)}
            className="h-9 w-9"
          >
            <HugeiconsIcon icon={Edit02Icon} className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original.id)}
            className="h-9 w-9 text-destructive hover:text-destructive"
          >
            <HugeiconsIcon icon={Delete02Icon} className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  const totalProducts = rows.length;
  const activeCount = rows.filter((p) => p.status === "active" || p.status === "ready").length;
  const draftCount = rows.filter((p) => p.status === "draft").length;
  const lowStockCount = rows.filter((p) => p.quantity > 0 && p.quantity < 5).length;

  const statSegments = [
    {
      label: "Total Products",
      value: totalProducts.toLocaleString(),
      changeLabel: "+4.2% vs last 30 days",
      changeTone: "positive" as const,
    },
    {
      label: "Active",
      value: activeCount.toLocaleString(),
      changeLabel: "+2.1% vs last 30 days",
      changeTone: "positive" as const,
    },
    {
      label: "Low Stock",
      value: lowStockCount.toLocaleString(),
      changeLabel: "+6 items vs last 30 days",
      changeTone: "neutral" as const,
    },
    {
      label: "Drafts",
      value: draftCount.toLocaleString(),
      changeLabel: "-3 vs last 30 days",
      changeTone: "positive" as const,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {bootstrapError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">{bootstrapError}</div>
      )}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">{error}</div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Keep your catalog tidy and stay on top of stock.</p>
        </div>
        <AddProductButton
          onUploadClick={() => {
            setUploadModalOpen(true);
          }}
          onInstagramClick={() => {
            if (!bootstrap?.storeSlug) return;
            router.push(`/a/${bootstrap.storeSlug}/integrations`);
          }}
        />
      </div>

      <SegmentedStatsCard segments={statSegments} />

      <div className="rounded-md border bg-card p-3">
        <DataTable columns={columns} data={rows} />
      </div>

      <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        storeId={bootstrap?.storeId || ""}
        tenantId={bootstrap?.tenantId || ""}
        onUploadComplete={fetchProducts}
      />

      <EditProductModal
        product={editingProduct}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        tenantId={bootstrap?.tenantId || ""}
        onProductUpdated={fetchProducts}
      />

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewProduct?.name || "Preview"}</DialogTitle>
          </DialogHeader>
          {previewProduct && bootstrap?.storeSlug ? (
            <div className="overflow-hidden rounded-md border bg-background">
              <iframe
                title="Product preview"
                src={`/${bootstrap.storeSlug}/products/${previewProduct.slug}`}
                className="h-[70vh] w-full"
              />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Preview unavailable.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}