"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
    MoreHorizontalIcon,
    Edit02Icon,
    Delete02Icon,
    SparklesIcon,
} from "@hugeicons/core-free-icons";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@vendly/ui/components/table";
import { Badge } from "@vendly/ui/components/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@vendly/ui/components/dropdown-menu";
import Image from "next/image";

export type ProductStatus = "draft" | "ready" | "active" | "sold-out";

export interface ProductTableRow {
    id: string;
    productName: string;
    priceAmount: number;
    currency: string;
    quantity: number;
    status: ProductStatus;
    thumbnailUrl?: string;
    hasContentVariants: boolean;
    salesAmount?: number;
}

interface ProductTableProps {
    products: ProductTableRow[];
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onGenerateVariants?: (id: string) => void;
    isLoading?: boolean;
}

function formatPrice(amount: number, currency: string): string {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
    }).format(amount / 100);
}

function StatusBadge({ status }: { status: ProductStatus }) {
    const variants: Record<ProductStatus, { label: string; className: string }> = {
        draft: {
            label: "Draft",
            className: "bg-gray-100 text-gray-700 border-gray-200",
        },
        ready: {
            label: "Ready",
            className: "bg-orange-100 text-orange-700 border-orange-200",
        },
        active: {
            label: "Published",
            className: "bg-green-100 text-green-700 border-green-200",
        },
        "sold-out": {
            label: "Sold Out",
            className: "bg-red-100 text-red-700 border-red-200",
        },
    };

    const { label, className } = variants[status];

    return (
        <Badge variant="outline" className={className}>
            {label}
        </Badge>
    );
}

function ProductActions({
    productId,
    onEdit,
    onDelete,
    onGenerateVariants,
}: {
    productId: string;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onGenerateVariants?: (id: string) => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <div className="inline-flex items-center justify-center size-8 rounded-md hover:bg-accent cursor-pointer shrink-0">
                        <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4" />
                        <span className="sr-only">Actions</span>
                    </div>
                }
            />
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(productId)}>
                    <HugeiconsIcon icon={Edit02Icon} className="size-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onGenerateVariants?.(productId)}>
                    <HugeiconsIcon icon={SparklesIcon} className="size-4" />
                    Generate Variants
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete?.(productId)}
                >
                    <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function TableSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-2">
                    <div className="size-10 bg-muted rounded-md animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                    </div>
                    <div className="h-4 bg-muted rounded w-16 animate-pulse shrink-0" />
                    <div className="h-4 bg-muted rounded w-12 animate-pulse shrink-0" />
                    <div className="h-4 bg-muted rounded w-16 animate-pulse shrink-0" />
                    <div className="h-6 bg-muted rounded w-20 animate-pulse shrink-0" />
                    <div className="size-8 bg-muted rounded animate-pulse shrink-0" />
                </div>
            ))}
        </div>
    );
}

export function ProductTable({
    products,
    onEdit,
    onDelete,
    onGenerateVariants,
    isLoading = false,
}: ProductTableProps) {
    if (isLoading) {
        return <TableSkeleton />;
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No products yet</p>
                <p className="text-muted-foreground text-sm">
                    Add your first product to get started
                </p>
            </div>
        );
    }

    return (
        <Table className="table-fixed w-full">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-16 shrink-0">Image</TableHead>
                    <TableHead className="w-[30%]">Name</TableHead>
                    <TableHead className="w-[15%] shrink-0">Price</TableHead>
                    <TableHead className="w-[10%] shrink-0">Qty</TableHead>
                    <TableHead className="w-[15%] shrink-0">Sales</TableHead>
                    <TableHead className="w-[15%] shrink-0">Status</TableHead>
                    <TableHead className="w-16 shrink-0">Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell className="shrink-0">
                            <div className="relative size-10 overflow-hidden rounded-md bg-muted">
                                {product.thumbnailUrl ? (
                                    <Image
                                        src={product.thumbnailUrl}
                                        alt={product.productName}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center text-muted-foreground text-xs">
                                        N/A
                                    </div>
                                )}
                            </div>
                        </TableCell>

                        <TableCell className="font-medium max-w-[320px]">
                            <div
                                className="truncate"
                                title={product.productName}
                            >
                                {product.productName}
                            </div>
                        </TableCell>

                        <TableCell className="shrink-0">
                            {formatPrice(product.priceAmount, product.currency)}
                        </TableCell>

                        <TableCell className="shrink-0">
                            {product.quantity}
                        </TableCell>

                        <TableCell className="shrink-0">
                            {formatPrice(product.salesAmount || 0, product.currency)}
                        </TableCell>

                        <TableCell className="shrink-0">
                            <StatusBadge status={product.status} />
                        </TableCell>

                        <TableCell className="shrink-0">
                            <ProductActions
                                productId={product.id}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onGenerateVariants={onGenerateVariants}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
