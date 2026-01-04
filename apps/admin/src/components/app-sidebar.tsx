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
    title: "Message",
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

function joinPaths(basePath: string, href: string) {
  if (!basePath) return href;
  if (href === "/") return basePath;
  return `${basePath}${href}`;
}

export function AppSidebar({
  basePath = "",
  ...props
}: React.ComponentProps<typeof Sidebar> & { basePath?: string }) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<a href={joinPaths(basePath, "/")} />}
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    render={<a href={joinPaths(basePath, item.url)} />}
                  >
                    <HugeiconsIcon icon={item.icon} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            render={
                              <a href={joinPaths(basePath, subItem.url)} />
                            }
                          >
                            {subItem.title}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<a href={joinPaths(basePath, "/settings")} />}
            >
              <div>
                <HugeiconsIcon icon={Settings01Icon} className="size-4" />
              </div>
              <span className="font-medium">Settings</span>
            </SidebarMenuButton>
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
