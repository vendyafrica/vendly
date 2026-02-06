import { AppSidebar } from "@/components/app-sidebar"
import { AdminMobileDock } from "@/components/admin-mobile-dock"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@vendly/auth"
import { db } from "@vendly/db/db"
import { platformRoles, stores, tenantMemberships } from "@vendly/db/schema"
import { and, eq, isNull } from "@vendly/db"
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

  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect(`/a/${slug}/login?next=${encodeURIComponent(basePath)}`)
  }

  // Parallelize independent DB queries to avoid waterfall
  const [store, platformRole] = await Promise.all([
    db.query.stores.findFirst({
      where: and(eq(stores.slug, slug), isNull(stores.deletedAt)),
      columns: { tenantId: true },
    }),
    db.query.platformRoles.findFirst({
      where: eq(platformRoles.userId, session.user.id),
      columns: { role: true },
    }),
  ])

  if (!store) {
    redirect("/")
  }

  // Fetch membership after we have tenantId
  const membership = await db.query.tenantMemberships.findFirst({
    where: and(
      eq(tenantMemberships.tenantId, store.tenantId),
      eq(tenantMemberships.userId, session.user.id)
    ),
    columns: { role: true },
  })

  const isTenantAdmin = membership && ["owner", "admin"].includes(membership.role)
  const isSuperAdmin = platformRole?.role === "super_admin"

  if (!isTenantAdmin && !isSuperAdmin) {
    redirect("/login?unauthorized=1")
  }

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