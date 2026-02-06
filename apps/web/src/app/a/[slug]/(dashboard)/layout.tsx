import { AppSidebar } from "@/components/app-sidebar";
import { AdminMobileDock } from "@/components/admin-mobile-dock";
import { DashboardPageSkeleton } from "@/components/ui/page-skeletons";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@vendly/auth";
import { db } from "@vendly/db/db";
import { platformRoles, stores, tenantMemberships } from "@vendly/db/schema";
import { and, eq, isNull } from "@vendly/db";
import { Suspense } from "react";

import { SidebarInset, SidebarProvider } from "@vendly/ui/components/sidebar";
import { Providers } from "../../../providers";
import { DashboardHeader } from "./components/DashboardHeader";
import { TenantProvider } from "./tenant-context";
import { AppSessionProvider } from "@/contexts/app-session-context";

export default async function TenantDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const basePath = `/a/${slug}`;

  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <TenantDashboardLayoutInner slug={slug} basePath={basePath}>
        {children}
      </TenantDashboardLayoutInner>
    </Suspense>
  );
}

async function TenantDashboardLayoutInner({
  children,
  slug,
  basePath,
}: {
  children: React.ReactNode;
  slug: string;
  basePath: string;
}) {
  const headerList = await headers();

  const sessionPromise = auth.api.getSession({ headers: headerList });
  const storePromise = db.query.stores.findFirst({
    where: and(eq(stores.slug, slug), isNull(stores.deletedAt)),
    columns: { id: true, tenantId: true, name: true },
  });

  const session = await sessionPromise;

  if (!session?.user) {
    redirect(`/a/${slug}/login?next=${encodeURIComponent(basePath)}`);
  }

  const store = await storePromise;

  if (!store) {
    redirect("/");
  }

  const [platformRole, membership] = await Promise.all([
    db.query.platformRoles.findFirst({
      where: eq(platformRoles.userId, session.user.id),
      columns: { role: true },
    }),
    db.query.tenantMemberships.findFirst({
      where: and(
        eq(tenantMemberships.tenantId, store.tenantId),
        eq(tenantMemberships.userId, session.user.id)
      ),
      columns: { role: true },
    }),
  ]);

  const isTenantAdmin = membership && ["owner", "admin"].includes(membership.role);
  const isSuperAdmin = platformRole?.role === "super_admin";

  if (!isTenantAdmin && !isSuperAdmin) {
    redirect(`/a/${slug}/unauthorized`);
  }

  return (
    <Providers>
      <AppSessionProvider session={{ user: session.user }}>
        <TenantProvider
          initialBootstrap={{
            tenantId: store.tenantId,
            storeId: store.id,
            storeSlug: slug,
            storeName: store.name,
          }}
        >
          <SidebarProvider
            style={
              {
                "--sidebar-width": "14rem",
              } as React.CSSProperties
            }
          >
            <AppSidebar basePath={basePath} />
            <SidebarInset>
              <DashboardHeader tenantName={store.name} />
              <div className="flex flex-1 flex-col gap-4 p-4 pt-4 pb-24 md:pb-4">{children}</div>
            </SidebarInset>

            <AdminMobileDock basePath={basePath} />
          </SidebarProvider>
        </TenantProvider>
      </AppSessionProvider>
    </Providers>
  );
}
