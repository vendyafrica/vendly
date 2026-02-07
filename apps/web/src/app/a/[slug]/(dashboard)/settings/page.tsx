import { db } from "@vendly/db/db";
import { stores } from "@vendly/db/schema";
import { and, eq, isNull } from "@vendly/db";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const store = await db.query.stores.findFirst({
    where: and(eq(stores.slug, slug), isNull(stores.deletedAt)),
    columns: {
      id: true,
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
    <SettingsClient
      store={{
        id: store.id,
        name: store.name,
        storeContactPhone: store.storeContactPhone,
        defaultCurrency: store.defaultCurrency || "UGX",
      }}
    />
  );
}
