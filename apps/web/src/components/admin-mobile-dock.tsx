"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardCircleIcon,
  ShoppingBag01Icon,
  PackageOpenIcon,
  Analytics02Icon,
  Message01Icon,
  UserGroupIcon,
  Settings01Icon,
  Store01Icon,
  MenuSquareIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@vendly/ui/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@vendly/ui/components/sheet";

type DockItem = {
  label: string;
  href: string;
  icon: typeof DashboardCircleIcon;
};

function normalizePath(path: string) {
  const resolved = path.replace(/\/+/g, "/").replace(/\/$/, "");
  return resolved === "" ? "/" : resolved;
}

function joinPaths(a: string, b: string) {
  const left = a.endsWith("/") ? a.slice(0, -1) : a;
  const right = b.startsWith("/") ? b : `/${b}`;
  return normalizePath(`${left}${right}`);
}

export function AdminMobileDock({ basePath }: { basePath: string }) {
  const pathname = usePathname();

  const primary: DockItem[] = [
    { label: "Home", href: joinPaths(basePath, "/"), icon: DashboardCircleIcon },
    { label: "Products", href: joinPaths(basePath, "/products"), icon: ShoppingBag01Icon },
    { label: "Orders", href: joinPaths(basePath, "/orders"), icon: PackageOpenIcon },
    { label: "Inbox", href: joinPaths(basePath, "/messages"), icon: Message01Icon },
    { label: "Studio", href: joinPaths(basePath, "/studio"), icon: Store01Icon },
  ];

  const more: DockItem[] = [
    { label: "Analytics", href: joinPaths(basePath, "/analytics"), icon: Analytics02Icon },
    { label: "Customers", href: joinPaths(basePath, "/customers"), icon: UserGroupIcon },
    { label: "Settings", href: joinPaths(basePath, "/settings"), icon: Settings01Icon },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 md:hidden">
      <div className="grid grid-cols-6 items-center gap-1 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
        {primary.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-xs",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <HugeiconsIcon icon={item.icon} className="size-5" />
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}

        <Sheet>
          <SheetTrigger className={cn("flex flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-xs text-muted-foreground")}> 
            <HugeiconsIcon icon={MenuSquareIcon} className="size-5" />
            <span className="leading-none">More</span>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>More</SheetTitle>
            </SheetHeader>
            <div className="grid gap-2 px-4 pb-4">
              {more.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border border-border/70 bg-card px-3 py-3 text-sm",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <HugeiconsIcon icon={item.icon} className="size-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
