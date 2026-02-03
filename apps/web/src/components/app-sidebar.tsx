"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardCircleIcon,
  ShoppingBag01Icon,
  Analytics02Icon,
  Message01Icon,
  UserGroupIcon,
  CustomerServiceIcon,
  Settings01Icon,
  Store01Icon,
  UserMultiple02Icon,
  GroupLayersIcon,
  Payment02Icon,
  PackageOpenIcon,
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
  useSidebar,
} from "@vendly/ui/components/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

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

const tenantAdminItems: SidebarNavItem[] = [
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
    url: "/orders",
    icon: PackageOpenIcon,
  },
  {
    title: "Reports & Analytics",
    url: "/analytics",
    icon: Analytics02Icon,
  },
  {
    title: "Notifications",
    url: "/messages",
    icon: Message01Icon,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: CustomerServiceIcon,
  },
  {
    title: "Studio",
    url: "/studio",
    icon: Store01Icon,
  },
];

const superAdminItems: SidebarNavItem[] = [
  {
    title: "Tenants",
    url: "/tenants",
    icon: UserMultiple02Icon,
  },
  {
    title: "Stores",
    url: "/stores",
    icon: Store01Icon,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: GroupLayersIcon,
  },
  {
    title: "Users",
    url: "/users",
    icon: UserGroupIcon,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: Payment02Icon,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: PackageOpenIcon,
  },
  {
    title: "Reports & Analytics",
    url: "/analytics",
    icon: Analytics02Icon,
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

function getSlugFromParams(params: ReturnType<typeof useParams>) {
  const raw = params?.slug as string | string[] | undefined;
  return Array.isArray(raw) ? raw[0] : raw;
}

export function AppSidebar({
  basePath: basePathProp,
  ...props
}: React.ComponentProps<typeof Sidebar> & { basePath?: string }) {
  const pathname = usePathname();
  const params = useParams();
  const { state, toggleSidebar } = useSidebar();

  // Try to get slug from params first, then fallback to parsing basePath
  let slug = getSlugFromParams(params);

  if (!slug && basePathProp) {
    // basePath is usually formatted as "/a/store-slug", so we strip the leading segments
    const match = basePathProp.match(/^\/a\/([^/]+)/) || basePathProp.match(/^\/([^/]+)/);
    if (match) {
      slug = match[1];
    }
  }

  // Ensure basePath is available for other uses
  const basePath = normalizePath(basePathProp ?? (slug ? `/a/${slug}` : ""));

  // Select items based on whether we are in a store context
  const items = slug || basePathProp ? tenantAdminItems : superAdminItems;

  return (
    <Sidebar variant="inset" collapsible="icon" {...props} className="cursor-pointer">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {state === "expanded" ? (
              <div className="flex items-center gap-1">
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

                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="ml-auto inline-flex size-9 items-center justify-center rounded-md hover:bg-sidebar-accent text-sidebar-foreground/80"
                  aria-label="Collapse sidebar"
                >
                  <ChevronsLeft className="size-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="inline-flex size-9 items-center justify-center rounded-md hover:bg-sidebar-accent text-sidebar-foreground/80"
                  aria-label="Expand sidebar"
                >
                  <ChevronsRight className="size-4" />
                </button>
              </div>
            )}
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
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
