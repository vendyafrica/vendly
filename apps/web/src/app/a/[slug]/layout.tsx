import { AppSidebar } from "@/components/app-sidebar"
import { AdminMobileDock } from "@/components/admin-mobile-dock"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@vendly/ui/components/sidebar"
import { TenantProvider } from "./tenant-context"

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
            "--sidebar-width": "19rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar basePath={basePath} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-muted-foreground">Welcome back</h1>
              <span className="text-sm text-muted-foreground">{slug}</span>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 pb-24 md:pb-4">{children}</div>
        </SidebarInset>

        <AdminMobileDock basePath={basePath} />
      </SidebarProvider>
    </TenantProvider>
  )
}
