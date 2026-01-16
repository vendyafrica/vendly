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
import { createTenant } from "./actions";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";

export function CreateTenantSheet() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                await createTenant(formData);
                setOpen(false);
                // Optional: Show toast success
            } catch (error) {
                console.error(error);
                // Optional: Show toast error
            }
        });
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                render={
                    <Button>
                        <HugeiconsIcon icon={Add01Icon} className="mr-2 size-4" />
                        Create Tenant
                    </Button>
                }
            />
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Create Tenant</SheetTitle>
                    <SheetDescription>
                        Add a new tenant to the platform.
                    </SheetDescription>
                </SheetHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" name="fullName" required placeholder="Acme Corp" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="billingEmail">Billing Email</Label>
                        <Input id="billingEmail" name="billingEmail" type="email" placeholder="billing@acme.com" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" name="slug" required placeholder="acme" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="+1234567890" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="plan">Plan</Label>
                        <select
                            id="plan"
                            name="plan"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="free">Free</option>
                            <option value="pro">Pro</option>
                            <option value="enterprise">Enterprise</option>
                        </select>
                    </div>
                    <SheetFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Creating..." : "Create Tenant"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
