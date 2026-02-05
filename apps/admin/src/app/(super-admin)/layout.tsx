import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@vendly/ui/components/sidebar"
import { headers } from "next/headers"
import { requirePlatformRole } from "@/lib/auth-guard"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requirePlatformRole(["super_admin"]);

  const headersList = await headers()
  const tenant = headersList.get('x-tenant-subdomain')

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Welcome back</h1>
            {tenant && (
              <>
                <span className="text-muted-foreground">|</span>
                <span className="text-sm text-muted-foreground">Tenant: {tenant}</span>
              </>
            )}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}