import { db, tenants, stores } from "@vendly/db";
import { count } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@vendly/ui/components/card";
import { UserGroupIcon, Store01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default async function DashboardPage() {
  const [tenantCount] = await db.select({ count: count() }).from(tenants);
  const [storeCount] = await db.select({ count: count() }).from(stores);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Overview of the platform.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tenants
            </CardTitle>
            <HugeiconsIcon icon={UserGroupIcon} className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenantCount?.count ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stores
            </CardTitle>
            <HugeiconsIcon icon={Store01Icon} className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storeCount?.count ?? 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
