import { AppSidebar } from "@/components/app-sidebar"
import { AdminMobileDock } from "@/components/admin-mobile-dock"
import {
  SidebarInset,
  SidebarProvider,
} from "@vendly/ui/components/sidebar"
import { TenantProvider } from "./tenant-context"
import { DashboardHeader } from "./components/DashboardHeader"

export default async function TenantDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const basePath = `/a/${slug}`

  return (
    <TenantProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "14rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar basePath={basePath} />
        <SidebarInset>
          <DashboardHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-4 pb-24 md:pb-4">{children}</div>
        </SidebarInset>

        <AdminMobileDock basePath={basePath} />
      </SidebarProvider>
    </TenantProvider>
  )
}
