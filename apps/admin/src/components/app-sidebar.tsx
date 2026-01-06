"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardCircleIcon,
  ShoppingBag01Icon,
  ShoppingCart01Icon,
  Analytics02Icon,
  Message01Icon,
  UserGroupIcon,
  CustomerServiceIcon,
  Settings01Icon,
  Store01Icon,
} from "@hugeicons/core-free-icons";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@vendly/ui/components/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

type SidebarNavSubItem = {
  title: string;
  url: string;
};

type SidebarNavItem = {
  title: string;
  url: string;
  icon: typeof DashboardCircleIcon;
  items?: SidebarNavSubItem[];
};

const items: SidebarNavItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: DashboardCircleIcon,
  },
  {
    title: "Products",
    url: "/products",
    icon: ShoppingBag01Icon,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: ShoppingCart01Icon,
  },
  {
    title: "Reports & Analytics",
    url: "/analytics",
    icon: Analytics02Icon,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: Message01Icon,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: CustomerServiceIcon,
  },
  {
    title: "Store Manager",
    url: "/store",
    icon: Store01Icon,
  },
];

function normalizePath(path: string) {
  const resolved = path
    // Remove route groups like (dashboard) if they ever leak in
    .replace(/\/\([^)]+\)/g, "")
    // Collapse multiple slashes
    .replace(/\/+/g, "/")
    // Remove trailing slash (except for root)
    .replace(/\/$/, "");

  return resolved === "" ? "/" : resolved;
}

function joinPaths(a: string, b: string) {
  const left = a.endsWith("/") ? a.slice(0, -1) : a;
  const right = b.startsWith("/") ? b : `/${b}`;
  return normalizePath(`${left}${right}`);
}

function getTenantFromParams(params: ReturnType<typeof useParams>) {
  const raw = params?.tenant as string | string[] | undefined;
  return Array.isArray(raw) ? raw[0] : raw;
}

export function AppSidebar({
  basePath: basePathProp,
  ...props
}: React.ComponentProps<typeof Sidebar> & { basePath?: string }) {
  const pathname = usePathname();
  const params = useParams();
  
  // Try to get tenant from params first, then fallback to parsing basePath
  let tenant = getTenantFromParams(params);
  
  if (!tenant && basePathProp) {
    // basePath is usually formatted as "/tenant-slug", so we strip the leading slash
    const match = basePathProp.match(/^\/([^/]+)/);
    if (match) {
      tenant = match[1];
    }
  }

  // Ensure basePath is available for other uses
  const basePath = normalizePath(basePathProp ?? (tenant ? `/${tenant}` : ""));

  return (
    <Sidebar variant="inset" collapsible="icon" {...props} className="cursor-pointer">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href={basePath || "/"} />}
            >
              <div className="flex aspect-square size-6 items-center justify-center rounded-lg">
                <Image src="/vendly.png" alt="Vendly" width={24} height={24} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Vendly</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const fullUrl = basePath ? joinPaths(basePath, item.url) : normalizePath(item.url);
                const isActive = item.url === "/"
                  ? pathname === fullUrl
                  : pathname === fullUrl || pathname.startsWith(fullUrl + "/");

                return (
                  <SidebarMenuItem key={item.title} >
                    <SidebarMenuButton
                    className="cursor-pointer"
                      isActive={isActive}
                      render={<Link href={fullUrl} />}
                    >
                      <HugeiconsIcon icon={item.icon} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.items?.length ? (
                      <SidebarMenuSub className="ml-0 border-l-0 px-1.5 cursor-pointer">
                        {item.items.map((subItem) => {
                          const subFullUrl = basePath
                            ? joinPaths(basePath, subItem.url)
                            : normalizePath(subItem.url);
                          const isSubActive = pathname === subFullUrl;
                          
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                isActive={isSubActive}
                                render={<Link href={subFullUrl} />}
                              >
                                {subItem.title}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {(() => {
              const settingsUrl = basePath ? joinPaths(basePath, "/settings") : "/settings";
              const isSettingsActive = pathname === settingsUrl;
              return (
                <SidebarMenuButton
                  size="lg"
                  isActive={isSettingsActive}
                  render={<Link href={settingsUrl} />}
                >
                  <div>
                    <HugeiconsIcon icon={Settings01Icon} className="size-4" />
                  </div>
                  <span className="font-medium">Settings</span>
                </SidebarMenuButton>
              );
            })()}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div>
                <HugeiconsIcon icon={UserGroupIcon} className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">Admin User</span>
                <span className="">admin@vendly.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
