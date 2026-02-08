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
import { Delete02Icon, Edit02Icon, MoreHorizontalIcon, SparklesIcon } from "@hugeicons/core-free-icons";
import { UploadModal } from "./components/upload-modal";
import { EditProductModal } from "./components/edit-product-modal";
import { Checkbox } from "@vendly/ui/components/checkbox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@vendly/ui/components/dropdown-menu";
import {
  useProducts,
  useDeleteProduct,
  useInvalidateProducts,
  type ProductTableRow,
  type ProductApiRow,
} from "@/hooks/use-products";
import { ProductsPageSkeleton } from "@/components/ui/page-skeletons";

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ProductsPage() {
  const { bootstrap, error: bootstrapError } = useTenant();

  // Use React Query for products with optimistic updates
  const {
    data: rows = [],
    isLoading,
    error: queryError,
  } = useProducts(bootstrap?.storeId);

  const deleteProduct = useDeleteProduct(bootstrap?.storeId ?? "");
  const { invalidate } = useInvalidateProducts();

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isPublishing, setIsPublishing] = React.useState(false);

  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  // Type compatible with EditProductModal's Product interface
  const [editingProduct, setEditingProduct] = React.useState<{
    id: string;
    productName: string;
    description?: string;
    priceAmount: number;
    currency: string;
    quantity: number;
    status: string;
    thumbnailUrl?: string;
    media?: { id?: string; blobUrl: string; contentType?: string; blobPathname?: string }[];
  } | null>(null);

  // Optimistic delete - removes instantly from UI
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    // This will optimistically remove the product from the list
    deleteProduct.mutate(id, {
      onError: (error) => {
        alert(error instanceof Error ? error.message : "Failed to delete product");
      },
    });
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Failed to load product");
      const product = (await res.json()) as ProductApiRow;
      // Convert null to undefined for fields to match modal's expected type
      setEditingProduct({
        id: product.id,
        productName: product.productName,
        description: product.description ?? undefined,
        priceAmount: product.priceAmount,
        currency: product.currency,
        quantity: product.quantity,
        status: product.status,
        media: product.media?.map((m) => ({
          blobUrl: m.blobUrl,
          contentType: m.contentType ?? undefined,
          blobPathname: m.blobPathname ?? undefined,
        })),
      });
      setEditModalOpen(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to load product");
    }
  };

  const handleUploadComplete = () => {
    // Invalidate and refetch products after upload
    if (bootstrap?.storeId) {
      invalidate(bootstrap.storeId);
    }
  };

  const handleProductUpdated = () => {
    // Invalidate and refetch products after edit
    if (bootstrap?.storeId) {
      invalidate(bootstrap.storeId);
    }
  };

  const selectedIds = React.useMemo(() => Object.keys(rowSelection), [rowSelection]);

  const handlePublishSelected = React.useCallback(async () => {
    if (selectedIds.length === 0) return;
    try {
      setIsPublishing(true);
      const res = await fetch("/api/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, action: "publish" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Publish failed");
      }
      if (bootstrap?.storeId) {
        invalidate(bootstrap.storeId);
      }
      setRowSelection({});
    } catch (err) {
      alert(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setIsPublishing(false);
    }
  }, [bootstrap?.storeId, invalidate, selectedIds]);

  React.useEffect(() => {
    // Clear selections for rows that no longer exist
    const existingIds = new Set(rows.map((r) => r.id));
    setRowSelection((prev) => {
      let changed = false;
      const next: Record<string, boolean> = {};
      Object.entries(prev).forEach(([id, value]) => {
        if (value && existingIds.has(id)) {
          next[id] = true;
        } else {
          changed = true;
        }
      });
      // If nothing changed, return prev to avoid unnecessary rerenders
      if (!changed && Object.keys(prev).length === Object.keys(next).length) {
        return prev;
      }
      return next;
    });
  }, [rows]);

  const toggleAll = (checked: boolean) => {
    if (checked) {
      const next: Record<string, boolean> = {};
      rows.forEach((r) => {
        next[r.id] = true;
      });
      setRowSelection(next);
    } else {
      setRowSelection({});
    }
  };

  const toggleOne = (id: string, checked: boolean) => {
    setRowSelection((prev) => {
      const next = { ...prev };
      if (checked) next[id] = true;
      else delete next[id];
      return next;
    });
  };

  const columns: ColumnDef<ProductTableRow>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          aria-label="Select all"
          checked={selectedIds.length > 0 && selectedIds.length === rows.length}
          indeterminate={selectedIds.length > 0 && selectedIds.length < rows.length}
          onCheckedChange={(checked) => toggleAll(Boolean(checked))}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={rowSelection[row.original.id]}
          onCheckedChange={(checked) => toggleOne(row.original.id, Boolean(checked))}
        />
      ),
      size: 32,
      enableSorting: false,
    },
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
                unoptimized={row.original.thumbnailUrl.includes("blob.vercel-storage.com")}
              />
            ) : (
              <div className="flex size-full items-center justify-center text-xs text-muted-foreground">N/A</div>
            )}
          </div>
          <div className="min-w-0 max-w-[220px]">
            <div className="truncate font-medium" title={row.original.name}>
              {row.original.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap">
          {formatMoney(row.original.priceAmount, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Inventory",
      cell: ({ row }) => <span className="text-sm">{row.original.quantity}</span>,
    },
    {
      id: "sales",
      header: "Sales",
      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap">
          {formatMoney(row.original.salesAmount ?? 0, row.original.currency)}
        </span>
      ),
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
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              nativeButton={true}
              render={(props) => (
                <Button
                  {...props}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                />
              )}
            >
              <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4" />
              <span className="sr-only">Actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
              <DropdownMenuItem onClick={() => handleEdit(row.original.id)} className="p-2 cursor-pointer">
                <HugeiconsIcon icon={Edit02Icon} className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDelete(row.original.id)}
                disabled={deleteProduct.isPending}
                className="p-2 cursor-pointer"
              >
                <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const error = queryError?.message ?? null;
  const totalProducts = rows.length;
  const activeCount = rows.filter((p) => p.status === "active" || p.status === "ready").length;
  const draftCount = rows.filter((p) => p.status === "draft").length;
  const lowStockCount = rows.filter((p) => p.quantity > 0 && p.quantity < 5).length;

  const statSegments = [
    {
      label: "Total Products",
      value: totalProducts.toLocaleString(),
      changeLabel: "",
      changeTone: "neutral" as const,
    },
    {
      label: "Active",
      value: activeCount.toLocaleString(),
      changeLabel: "",
      changeTone: "neutral" as const,
    },
    {
      label: "Low Stock",
      value: lowStockCount.toLocaleString(),
      changeLabel: "",
      changeTone: "neutral" as const,
    },
    {
      label: "Drafts",
      value: draftCount.toLocaleString(),
      changeLabel: "",
      changeTone: "neutral" as const,
    },
  ];

  if (isLoading) {
    return <ProductsPageSkeleton />;
  }

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
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Button
            variant="outline"
            disabled={selectedIds.length === 0 || isPublishing}
            onClick={handlePublishSelected}
            className="sm:order-1"
          >
            {isPublishing ? "Publishing..." : (
              <span className="inline-flex items-center gap-2">
                <HugeiconsIcon icon={SparklesIcon} className="size-4" />
                Publish
              </span>
            )}
          </Button>
          <AddProductButton
            onUploadClick={() => {
              setUploadModalOpen(true);
            }}
          />
        </div>
      </div>

      <SegmentedStatsCard segments={statSegments} />

      <div className="rounded-md border bg-card p-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border border-dashed border-border/60 p-3 bg-muted/30">
                <div className="size-10 bg-muted rounded-md animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                </div>
                <div className="h-4 bg-muted rounded w-16 animate-pulse shrink-0" />
                <div className="h-6 bg-muted rounded w-20 animate-pulse shrink-0" />
                <div className="size-8 bg-muted rounded animate-pulse shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={rows}
            rowSelection={rowSelection}
            onRowSelectionChange={(updater) => {
              setRowSelection((prev) =>
                typeof updater === "function" ? updater(prev) : updater
              );
            }}
          />
        )}
      </div>

      <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        storeId={bootstrap?.storeId || ""}
        tenantId={bootstrap?.tenantId || ""}
        onUploadComplete={handleUploadComplete}
      />

      <EditProductModal
        product={editingProduct}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        tenantId={bootstrap?.tenantId || ""}
        onProductUpdated={handleProductUpdated}
      />
    </div>
  );
}