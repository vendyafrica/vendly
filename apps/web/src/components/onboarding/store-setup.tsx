
'use client';

import { Button } from "@vendly/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@vendly/ui/components/card";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, UploadIcon } from "@radix-ui/react-icons";

export function StoreSetupForm() {
  return (
    <div className="w-full max-w-4xl rounded-2xl py-10 gap-10">
      <div className="px-10">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight">Store Setup</h1>
          <p className="text-muted-foreground text-sm text-balance mt-1">
            Set up your storefront
          </p>
        </div>
      </div>
      <div className="px-10">
        <form>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" type="text" placeholder="My Store" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="storeSlug">Store URL</Label>
              <Input id="storeSlug" type="text" placeholder="my-store" required />
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <Label>Profile Picture</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
              <UploadIcon className="mx-auto h-8 w-8 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  // Handle file upload
                  console.log('File uploaded:', e.target.files?.[0]);
                }}
              />
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <Label>Color Palette</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Ocean Blue", colors: ["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8"] },
                { name: "Sunset Orange", colors: ["#FF6B35", "#F77F00", "#FCBF49", "#EAE2B7"] },
                { name: "Forest Green", colors: ["#2D6A4F", "#52B788", "#95D5B2", "#D8F3DC"] },
                { name: "Royal Purple", colors: ["#7209B7", "#A663CC", "#C77DFF", "#E0AAFF"] }
              ].map((palette) => (
                <div key={palette.name} className="flex items-center space-x-2">
                  <Checkbox.Root
                    id={palette.name}
                    className="h-4 w-4 rounded border border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  >
                    <Checkbox.Indicator className="flex items-center justify-center text-white">
                      <CheckIcon className="h-3 w-3" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label
                    htmlFor={palette.name}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {palette.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span>{palette.name}</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
