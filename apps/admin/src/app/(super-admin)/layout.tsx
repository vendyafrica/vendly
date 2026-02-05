import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@vendly/ui/components/sidebar"
import { headers } from "next/headers"
import { requirePlatformRole } from "@/lib/auth-guard"
import { DashboardHeader } from "./components/DashboardHeader"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = await requirePlatformRole(["super_admin"]);
  const user = session.user;

  // Mock title based on path could be added here or passed from pages

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "14rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader user={user} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4 pb-24 md:pb-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}