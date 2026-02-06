import { db } from "@vendly/db/db";
import { stores } from "@vendly/db/schema";
import { and, eq, isNull } from "@vendly/db";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const store = await db.query.stores.findFirst({
    where: and(eq(stores.slug, slug), isNull(stores.deletedAt)),
    columns: {
      name: true,
      storeContactPhone: true,
      defaultCurrency: true,
    },
  });

  if (!store) {
    return (
      <div className="space-y-6 p-6">
        <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">Store not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Store details</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4 space-y-2">
          <div className="text-xs uppercase text-muted-foreground">Store Name</div>
          <div className="text-base font-semibold text-foreground">{store.name || "—"}</div>
        </div>

        <div className="rounded-lg border bg-card p-4 space-y-2">
          <div className="text-xs uppercase text-muted-foreground">Phone Number</div>
          <div className="text-base font-semibold text-foreground">{store.storeContactPhone || "—"}</div>
        </div>

        <div className="rounded-lg border bg-card p-4 space-y-2">
          <div className="text-xs uppercase text-muted-foreground">Store Currency</div>
          <div className="text-base font-semibold text-foreground">{store.defaultCurrency || "UGX"}</div>
        </div>
      </div>
    </div>
  );
}
