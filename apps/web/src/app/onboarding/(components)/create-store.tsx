"use client";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";

export function CreateStoreForm() {
  const [storeName, setStoreName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setStoreName(name);
    
    // Auto-generate slug from store name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setStoreSlug(slug);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/^-+|-+$/g, "");
    setStoreSlug(slug);
  };

  const checkSlugAvailability = async () => {
    if (!storeSlug) return;
    
    setIsCheckingSlug(true);
    // Simulate API call to check slug availability
    setTimeout(() => {
      setSlugAvailable(true);
      setIsCheckingSlug(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ storeName, storeSlug });
    // Handle store creation logic
  };

  return (
    <div className="w-full max-w-md rounded-xl border bg-background shadow-sm">
      <div className="flex flex-col items-center justify-center gap-6 rounded-t-xl border-b bg-card/60 py-12">
        <Image
          src="/apple-icon.png"
          alt="Vendly Logo"
          width={24}
          height={24}
          className="h-6 w-6"
        />
        <div className="flex flex-col items-center space-y-2">
          <h2 className="font-semibold text-2xl">Create your Store</h2>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Set up your professional online store and start selling in minutes
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup className="p-6 space-y-6">
          <Field className="space-y-2">
            <FieldLabel htmlFor="storeName">Store Name</FieldLabel>
            <Input
              autoComplete="off"
              id="storeName"
              placeholder="e.g., Sarah's Fashion Boutique"
              value={storeName}
              onChange={handleStoreNameChange}
              required
            />
            <FieldDescription>
              This is the name of your store that customers will see
            </FieldDescription>
          </Field>

          <Field className="space-y-2">
            <FieldLabel htmlFor="slug">Store URL</FieldLabel>
            <ButtonGroup>
              <ButtonGroupText asChild>
                <Label htmlFor="slug">vendly.africa/</Label>
              </ButtonGroupText>
              <InputGroup>
                <InputGroupInput
                  id="slug"
                  placeholder="e.g., sarahs-boutique"
                  value={storeSlug}
                  onChange={handleSlugChange}
                  onBlur={checkSlugAvailability}
                  required
                />
                {slugAvailable !== null && (
                  <InputGroupAddon align="inline-end">
                    {slugAvailable ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-xs text-destructive">Taken</span>
                    )}
                  </InputGroupAddon>
                )}
              </InputGroup>
            </ButtonGroup>
            <FieldDescription>
              Your unique store URL where customers can shop your products
            </FieldDescription>
          </Field>
        </FieldGroup>

        <div className="rounded-b-xl border-t bg-card/60 p-6">
          <Button
            className="w-full"
            type="submit"
            disabled={!storeName || !storeSlug || !slugAvailable}
          >
            Create Store
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-4">
            You can customize your store design and branding after creation
          </p>
        </div>
      </form>
    </div>
  );
}