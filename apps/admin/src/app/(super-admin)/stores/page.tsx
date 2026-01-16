
import { db, stores, tenants } from "@vendly/db";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@vendly/ui/components/table";
import { format } from "date-fns";
import { desc, eq } from "drizzle-orm";
import { CreateStoreSheet } from "./store-sheet";

export default async function StoresPage() {
    const allStores = await db
        .select({
            store: stores,
            tenantName: tenants.fullName,
        })
        .from(stores)
        .leftJoin(tenants, eq(stores.tenantId, tenants.id))
        .orderBy(desc(stores.createdAt));

    // Fetch tenants for the create form
    const allTenants = await db.select().from(tenants);

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Stores</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage all stores across tenants.
                    </p>
                </div>
                <CreateStoreSheet tenants={allTenants} />
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Store Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Tenant</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allStores.map(({ store, tenantName }) => (
                            <TableRow key={store.id}>
                                <TableCell className="font-medium">{store.name}</TableCell>
                                <TableCell>{store.slug}</TableCell>
                                <TableCell>{tenantName || "Unknown"}</TableCell>
                                <TableCell className="capitalize">
                                    {store.status ? "Active" : "Inactive"}
                                </TableCell>
                                <TableCell>{format(store.createdAt, "PPP")}</TableCell>
                            </TableRow>
                        ))}
                        {allStores.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No stores found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
