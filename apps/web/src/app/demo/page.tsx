"use client";

import { useActionState } from "react";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@vendly/ui/components/card";

import { createTenant } from "../create-tenant";


export default function DemoPage() {
  const [state, formAction, isPending] = useActionState(createTenant, null);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your store</CardTitle>
          <CardDescription>
            Pick a store name, category and subdomain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input id="name" name="name" placeholder="Vendly Fashion" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" placeholder="Fashion" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <Input
                id="subdomain"
                name="subdomain"
                placeholder="vendly-fashion"
                required
              />
              <p className="text-muted-foreground text-sm">
                This becomes <span className="font-medium">subdomain</span>.vendlyafrica.store
              </p>
            </div>

            {state?.error ? (
              <p className="text-sm text-destructive">{state.error}</p>
            ) : null}

            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create store"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
