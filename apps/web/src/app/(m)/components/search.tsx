"use client";

import { Input } from "@vendly/ui/components/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

export default function Search() {
  return (
    <div className="flex flex-1 justify-center">
      <div className="relative w-full max-w-2xl">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          <HugeiconsIcon icon={Search01Icon} size={15} />
        </div>
        <Input
          type="search"
          id="search-desktop"
          placeholder="Search products, stores, creators…"
          className="h-10 pl-9 rounded-md"
        />
      </div>
    </div>
  )
}