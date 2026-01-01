import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardCircleIcon,
  ShoppingBag01Icon,
  ShoppingCart01Icon,
  Analytics02Icon,
  Message01Icon,
  UserGroupIcon,
  CustomerServiceIcon,
  Settings01Icon,
  HelpCircleIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"

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
} from "@vendly/ui/components/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: DashboardCircleIcon,
  },
  {
    title: "Products",
    url: "#",
    icon: ShoppingBag01Icon,
  },
  {
    title: "Transactions",
    url: "#",
    icon: ShoppingCart01Icon,
    items: [
      {
        title: "All Transactions",
        url: "#",
      },
      {
        title: "Pending",
        url: "#",
      },
      {
        title: "Completed",
        url: "#",
      },
    ],
  },
  {
    title: "Reports & Analytics",
    url: "#",
    icon: Analytics02Icon,
    items: [
      {
        title: "Sales Report",
        url: "#",
      },
      {
        title: "Customer Analytics",
        url: "#",
      },
      {
        title: "Product Performance",
        url: "#",
      },
    ],
  },
  {
    title: "Message",
    url: "#",
    icon: Message01Icon,
    items: [
      {
        title: "Inbox",
        url: "#",
      },
      {
        title: "Sent",
        url: "#",
      },
      {
        title: "Drafts",
        url: "#",
      },
    ],
  },
  {
    title: "Team Performance",
    url: "#",
    icon: UserGroupIcon,
  },
  {
    title: "Campaigns",
    url: "#",
    icon: Analytics02Icon,
  },
  {
    title: "Customers",
    url: "#",
    icon: CustomerServiceIcon,
    items: [
      {
        title: "All Customers",
        url: "#",
      },
      {
        title: "Active",
        url: "#",
      },
      {
        title: "Inactive",
        url: "#",
      },
    ],
  },
  {
    title: "Channels",
    url: "#",
    icon: Mail01Icon,
  },
  {
    title: "Order Management",
    url: "#",
    icon: ShoppingCart01Icon,
  },
  {
    title: "Roles & Permissions",
    url: "#",
    icon: Settings01Icon,
  },
  {
    title: "Billing & Subscription",
    url: "#",
    icon: Analytics02Icon,
  },
  {
    title: "Integrations",
    url: "#",
    icon: Settings01Icon,
  },
]

const helpItems = [
  {
    title: "Help Center",
    url: "#",
    icon: HelpCircleIcon,
  },
  {
    title: "Feedback",
    url: "#",
    icon: Mail01Icon,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings01Icon,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={DashboardCircleIcon} className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Vendly</span>
                  <span className="">Admin</span>
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
        
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {helpItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <HugeiconsIcon icon={item.icon} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
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
  )
}
