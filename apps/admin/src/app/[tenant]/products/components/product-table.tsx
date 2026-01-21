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

export type ProductStatus = "draft" | "ready" | "published";

export interface ProductTableRow {
    id: string;
    title: string;
    priceAmount: number;
    currency: string;
    quantity: number;
    status: ProductStatus;
    thumbnailUrl?: string;
    hasContentVariants: boolean;
}

interface ProductTableProps {
    products: ProductTableRow[];
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onGenerateVariants?: (id: string) => void;
}

function formatPrice(amount: number, currency: string): string {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
    }).format(amount / 100);
}

function StatusBadge({ status }: { status: ProductStatus }) {
    const variants: Record<ProductStatus, { label: string; variant: "default" | "secondary" | "outline" }> = {
        draft: { label: "Draft", variant: "outline" },
        ready: { label: "Ready", variant: "secondary" },
        published: { label: "Published", variant: "default" },
    };

    const { label, variant } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
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
                    <div className="inline-flex items-center justify-center size-8 rounded-md hover:bg-accent cursor-pointer">
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
                <DropdownMenuItem variant="destructive" onClick={() => onDelete?.(productId)}>
                    <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function ProductTable({
    products,
    onEdit,
    onDelete,
    onGenerateVariants,
}: ProductTableProps) {
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
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-12">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>
                            <div className="relative size-10 overflow-hidden rounded-md bg-muted">
                                {product.thumbnailUrl ? (
                                    <Image
                                        src={product.thumbnailUrl}
                                        alt={product.title}
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
                        <TableCell className="font-medium">{product.title}</TableCell>
                        <TableCell>{formatPrice(product.priceAmount, product.currency)}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>
                            <StatusBadge status={product.status} />
                        </TableCell>
                        <TableCell>
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
