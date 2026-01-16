"use client";

import { Button } from "@vendly/ui/components/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@vendly/ui/components/sheet";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createStore } from "./actions";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";

interface Tenant {
    id: string;
    fullName: string;
}

interface CreateStoreSheetProps {
    tenants: Tenant[];
}

export function CreateStoreSheet({ tenants }: CreateStoreSheetProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);
        // Simple slugify
        setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    };

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                await createStore(formData);
                setOpen(false);
                setName("");
                setSlug("");
            } catch (error) {
                console.error(error);
            }
        });
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                render={
                    <Button>
                        <HugeiconsIcon icon={Add01Icon} className="mr-2 size-4" />
                        Create Store
                    </Button>
                }
            />
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Create Store</SheetTitle>
                    <SheetDescription>
                        Create a new store and assign it to a tenant.
                    </SheetDescription>
                </SheetHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="tenantId">Tenant</Label>
                        <select
                            id="tenantId"
                            name="tenantId"
                            required
                            defaultValue=""
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="" disabled>Select a tenant</option>
                            {tenants.map(tenant => (
                                <option key={tenant.id} value={tenant.id}>{tenant.fullName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Store Name</Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            placeholder="My Awesome Store"
                            value={name}
                            onChange={handleNameChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            name="slug"
                            required
                            placeholder="my-awesome-store"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                        />
                    </div>
                    <SheetFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Creating..." : "Create Store"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
