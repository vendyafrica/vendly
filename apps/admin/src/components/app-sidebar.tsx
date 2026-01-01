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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src="/vendly.png"
                    alt="Vendly"
                    width={24}
                    height={24}
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Vendly</span>
                </div>
              </a>
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
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <HugeiconsIcon icon={item.icon} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>{subItem.title}</a>
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
            <SidebarMenuButton size="lg" asChild>
              <a href="/settings">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={Settings01Icon} className="size-4" />
                </div>
                <span className="font-medium">Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={UserGroupIcon} className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Admin User</span>
                  <span className="">admin@vendly.com</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
