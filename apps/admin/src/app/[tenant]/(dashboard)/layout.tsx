import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@vendly/ui/components/sidebar"

export default function TenantDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { tenant: string }
}) {
  const basePath = `/${params.tenant}`

  return (
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
            <h1 className="text-lg font-semibold">Welcome back</h1>
            <span className="text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground">Tenant: {params.tenant}</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
