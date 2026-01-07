"use client"

import * as React from "react"
import { Badge } from "@vendly/ui/components/badge"
import { Button } from "@vendly/ui/components/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@vendly/ui/components/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@vendly/ui/components/table"
import { cn } from "@vendly/ui/lib/utils"
// Import Input and Select components
import { Input } from "@vendly/ui/components/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@vendly/ui/components/select"
import { authClient } from "@vendly/auth/auth-client";



import { Skeleton } from "@vendly/ui/components/skeleton"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@vendly/ui/components/dialog"
import { createProduct, deleteProduct, updateProduct } from "./actions"

// Icons (Inline for safety/speed without checking external icon lib availability)
const Icons = {
    Filter: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    ),
    Sort: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="m3 16 4 4 4-4" />
            <path d="M7 20V4" />
            <path d="m21 8-4-4-4 4" />
            <path d="M17 4v16" />
        </svg>
    ),
    Download: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
    ),
    Settings: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    ChevronDown: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    ),
    Plus: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    ),
    Info: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    ),
    Star: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-yellow-400"
            {...props}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    Trash: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    ),
    MoreHorizontal: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
        </svg>
    ),
    Edit: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
        </svg>
    ),
    Tag: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l5 5a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828l-5-5z" />
            <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
        </svg>
    ),
    X: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 18 18" />
        </svg>
    ),
    Instagram: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    ),
    Upload: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    ),
    Check: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
}

// Dummy Data
const stats = [
    {
        label: "Total Product",
        value: "250",
        change: "+ 3 product",
        trend: "up",
        info: true,
    },
    {
        label: "Product Revenue",
        value: "$15,490",
        change: "+ 9%",
        trend: "up",
        info: true,
    },
    {
        label: "Product Sold",
        value: "2,355",
        change: "+ 7%",
        trend: "up",
        info: true,
    },
    {
        label: "Avg. Monthly Sales",
        value: "890",
        change: "+ 5%",
        trend: "up",
        info: true,
    },
]

export type Product = {
    id: string
    name: string
    variant?: string
    price: number
    sales: string
    revenue: string
    stock: number
    status: "active" | "archived" | "draft" | string
    rating: number
    selected?: boolean
    image?: string
}

function StatusBadge({ status }: { status: string }) {
    if (status === "active" || status === "In Stock") {
        return (
            <Badge
                className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 hover:bg-purple-100 hover:text-purple-600 border-0 shadow-none font-medium px-2.5"
            >
                Active
            </Badge>
        )
    }
    if (status === "archived" || status === "Out of Stock") {
        return (
            <Badge
                variant="destructive"
                className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 hover:bg-red-100 hover:text-red-600 border-0 shadow-none font-medium px-2.5"
            >
                Archived
            </Badge>
        )
    }
    if (status === "draft" || status === "Restock") {
        return (
            <Badge
                className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-100 hover:text-yellow-600 border-0 shadow-none font-medium px-2.5"
            >
                Draft
            </Badge>
        )
    }
    return <Badge>{status}</Badge>
}

// Simple custom checkbox using tailwind
function CustomCheckbox({
    checked,
    onChange,
}: {
    checked?: boolean
    onChange?: () => void
}) {
    return (
        <div
            onClick={(e) => {
                // Prevent row selection when clicking the checkbox/padding area
                e.stopPropagation();
                if (onChange) onChange();
            }}
            className={cn(
                "h-5 w-5 rounded border flex items-center justify-center cursor-pointer transition-colors z-20 relative",
                checked
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "border-input bg-background"
            )}
        >
            {checked && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            )}
        </div>
    )
}

function CustomSwitch() {
    return (
        <div className="w-9 h-5 bg-orange-500 rounded-full relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
            <div className="absolute right-0.5 top-0.5 h-4 w-4 bg-white rounded-full shadow-sm" />
        </div>
    )
}

interface ProductsClientProps {
    products: Product[]
    tenantSlug: string
}

export type InstagramMediaItem = {
    id: string
    instagramId: string
    mediaType: string
    mediaUrl: string
    thumbnailUrl: string | null
    caption: string | null
    timestamp: string
    isImported: boolean
}

export default function ProductsClient({ products: initialProducts, tenantSlug }: ProductsClientProps) {
    const [productList, setProductList] = React.useState(initialProducts)
    const [isSyncing, setIsSyncing] = React.useState(false)

    React.useEffect(() => {
        setProductList(initialProducts)
    }, [initialProducts])

    const handleConnectInstagram = async () => {
        await authClient.signIn.social({
            provider: "instagram",
            callbackURL: window.location.href
        });
    };

    const handleSyncInstagram = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"}/api/instagram/sync`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ tenantSlug })
            });
            if (res.ok) {
                console.log("Synced successfully - refreshing page");
                // Reload the page to show newly imported products
                window.location.reload();
            } else {
                console.error("Sync failed");
            }
        } catch (e) {
            console.error("Sync error", e);
        } finally {
            setIsSyncing(false);
        }
    };

    const toggleSelect = (id: string) => {
        setProductList((prev) =>
            prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
        )
    }

    const [isAdding, setIsAdding] = React.useState(false)
    const [newProductImage, setNewProductImage] = React.useState("")
    const [newProductTitle, setNewProductTitle] = React.useState("")
    const [isCreating, setIsCreating] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setNewProductImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleCreateProduct = async () => {
        if (!newProductImage || !newProductTitle) return

        setIsCreating(true)
        const result = await createProduct(tenantSlug, {
            title: newProductTitle,
            price: 0,
            stock: 0,
            imageUrl: newProductImage
        })

        if (result.success) {
            // Re-fetch or update local state
            // For now, let's just let revalidatePath handle it if we were server-side,
            // but since we are client-side with local state, we should refresh.
            // Actually, we can just add it to the list if we want immediate feedback.
            setProductList(prev => [{
                id: result.product!.id,
                name: result.product!.title,
                price: 0,
                sales: "0",
                revenue: "$0.00",
                stock: 0,
                status: "active",
                rating: 0,
                selected: false,
                image: newProductImage
            }, ...prev])
            setIsAdding(false)
            setNewProductImage("")
            setNewProductTitle("")
        }
        setIsCreating(false)
    }

    const handleDeleteProduct = async (id: string) => {
        const result = await deleteProduct(id, tenantSlug)
        if (result.success) {
            setProductList(prev => prev.filter(p => p.id !== id))
        }
    }

    const handlePriceChange = async (id: string, newPrice: number) => {
        setProductList(prev => prev.map(p => p.id === id ? { ...p, price: newPrice } : p))
        const result = await updateProduct(id, tenantSlug, { price: Math.round(newPrice * 100) })
        if (!result.success) console.error("Failed to update price")
    }

    const handleStockChange = async (id: string, newStock: number) => {
        setProductList(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p))
        const result = await updateProduct(id, tenantSlug, { stock: newStock })
        if (!result.success) console.error("Failed to update stock")
    }

    const handleStatusChange = async (id: string, newStatus: "active" | "archived" | "draft") => {
        setProductList(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p))
        const result = await updateProduct(id, tenantSlug, { status: newStatus })
        if (!result.success) console.error("Failed to update status")
    }


    const selectedCount = productList.filter((p) => p.selected).length

    return (
        <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">Products</h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 font-normal" onClick={handleConnectInstagram}>
                        <Icons.Instagram className="h-4 w-4 text-pink-600" />
                        Connect Instagram
                    </Button>
                    <Button
                        variant="outline"
                        className="gap-2 font-normal"
                        onClick={handleSyncInstagram}
                        disabled={isSyncing}
                    >
                        <Icons.Download className={cn("h-4 w-4", isSyncing && "animate-spin")} />
                        {isSyncing ? "Syncing..." : "Sync Media"}
                    </Button>
                    <Dialog open={isAdding} onOpenChange={setIsAdding}>
                        <DialogTrigger
                            render={
                                <Button className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 gap-2">
                                    <Icons.Plus className="h-4 w-4" /> Add New Product
                                </Button>
                            }
                        />
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Product</DialogTitle>
                                <DialogDescription>
                                    Enter the product name and upload an image to get started.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                                <div className="grid gap-2">
                                    <label htmlFor="title" className="text-sm font-medium">Product Name</label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Classic Sneakers"
                                        value={newProductTitle}
                                        onChange={(e) => setNewProductTitle(e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Product Image</label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={cn(
                                            "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:bg-muted/50 hover:border-orange-500/50",
                                            newProductImage ? "border-orange-500 bg-orange-50/10" : "border-border"
                                        )}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        {newProductImage ? (
                                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                                                <img src={newProductImage} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <span className="text-white text-xs font-medium">Change Image</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="h-10 w-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                                                    <Icons.Upload className="h-5 w-5 text-orange-600" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-medium">Click to upload product image</p>
                                                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WebP (max. 2MB)</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                                <Button
                                    onClick={handleCreateProduct}
                                    disabled={isCreating || !newProductImage || !newProductTitle}
                                    className="bg-orange-500 hover:bg-orange-600 text-white min-w-[100px]"
                                >
                                    {isCreating ? "Adding..." : "Add Product"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Product Table */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden relative pb-16">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="w-[40px] pl-4">
                                <CustomCheckbox />
                            </TableHead>
                            <TableHead className="w-[300px]">Product</TableHead>
                            <TableHead className="min-w-[100px]">Price</TableHead>
                            <TableHead>Sales</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead className="min-w-[100px]">Stock</TableHead>
                            <TableHead className="min-w-[140px]">Status</TableHead>
                            <TableHead className="text-right">Rating</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productList.length === 0 ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell className="pl-4">
                                        <Skeleton className="h-5 w-5 rounded" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-9 w-9 rounded-md" />
                                            <div className="flex flex-col gap-1">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-3 w-16" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-28" /></TableCell>
                                    <TableCell className="text-right flex justify-end items-center gap-1">
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                        <Skeleton className="h-4 w-8" />
                                    </TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            productList.map((product) => (
                                <TableRow
                                    key={product.id}
                                    className={cn(
                                        "cursor-pointer group transition-colors",
                                        product.selected && "bg-orange-50/50 dark:bg-orange-900/10 hover:bg-orange-50/60"
                                    )}
                                    onClick={() => toggleSelect(product.id)}
                                >
                                    <TableCell className="pl-4 relative">
                                        {product.selected && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                                        )}
                                        <CustomCheckbox
                                            checked={product.selected}
                                            onChange={() => toggleSelect(product.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-md border bg-muted flex items-center justify-center text-xs text-muted-foreground overflow-hidden">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                ) : "Img"}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm">{product.name}</span>
                                                {product.variant && (
                                                    <span className="text-xs text-muted-foreground">
                                                        - {product.variant}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={product.price}
                                                className="w-24 pl-5 h-8 text-xs bg-transparent border-transparent hover:border-input focus:border-input transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => {
                                                    const val = parseFloat(e.target.value);
                                                    setProductList(prev => prev.map(p => p.id === product.id ? { ...p, price: isNaN(val) ? 0 : val } : p))
                                                }}
                                                onBlur={(e) => {
                                                    const val = parseFloat(e.target.value);
                                                    handlePriceChange(product.id, isNaN(val) ? 0 : val)
                                                }}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>{product.sales}</TableCell>
                                    <TableCell>{product.revenue}</TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={product.stock}
                                            className="w-20 h-8 text-xs bg-transparent border-transparent hover:border-input focus:border-input transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                setProductList(prev => prev.map(p => p.id === product.id ? { ...p, stock: isNaN(val) ? 0 : val } : p))
                                            }}
                                            onBlur={(e) => {
                                                const val = parseInt(e.target.value);
                                                handleStockChange(product.id, isNaN(val) ? 0 : val)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <Select
                                                value={product.status}
                                                onValueChange={(val: any) => handleStatusChange(product.id, val)}
                                            >
                                                <SelectTrigger className="h-8 border-transparent hover:border-input focus:ring-0 bg-transparent px-2">
                                                    <StatusBadge status={product.status} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="draft">Draft</SelectItem>
                                                    <SelectItem value="archived">Archived</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // This can be a "Save" or "Done" button or just a tick for completion
                                                }}
                                            >
                                                <Icons.Check className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteProduct(product.id);
                                                }}
                                            >
                                                <Icons.Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Floating Action Bar */}
                {selectedCount > 0 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-in slide-in-from-bottom-5 fade-in duration-300">
                        <div className="flex items-center gap-2 bg-background border shadow-xl rounded-lg p-1.5 pr-2">
                            <div className="flex items-center gap-2 border-r pr-3 pl-2">
                                <span className="flex items-center justify-center bg-foreground text-background text-xs font-bold h-5 w-5 rounded-full">
                                    {selectedCount}
                                </span>
                                <span className="text-sm font-medium">Selected</span>
                            </div>
                            <Button size="sm" variant="ghost" className="gap-2 h-8 text-xs">
                                <Icons.Tag className="h-3.5 w-3.5" />
                                Apply Code
                            </Button>
                            <Button size="sm" variant="ghost" className="gap-2 h-8 text-xs">
                                <Icons.Edit className="h-3.5 w-3.5" />
                                Edit Info
                            </Button>
                            <Button size="sm" variant="ghost" className="gap-2 h-8 text-xs hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">
                                <Icons.Trash className="h-3.5 w-3.5" />
                                Delete
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 px-0">
                                <Icons.MoreHorizontal className="h-4 w-4" />
                            </Button>
                            <div className="w-[1px] h-4 bg-border mx-1" />
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 px-0 hover:bg-transparent"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setProductList(prev => prev.map(p => ({ ...p, selected: false })))
                                }}
                            >
                                <Icons.X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
