
import { db, tenants } from "@vendly/db";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@vendly/ui/components/table";
import { format } from "date-fns";
import { desc } from "drizzle-orm";

import { CreateTenantSheet } from "./create-tenant-sheet";

export default async function TenantsPage() {
    const allTenants = await db.select().from(tenants).orderBy(desc(tenants.createdAt));

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Tenants</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage all tenants on the platform.
                    </p>
                </div>
                <CreateTenantSheet />
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Created At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allTenants.map((tenant) => (
                            <TableRow key={tenant.id}>
                                <TableCell className="font-medium">{tenant.fullName}</TableCell>
                                <TableCell className="capitalize">{tenant.plan}</TableCell>
                                <TableCell className="capitalize">
                                    {tenant.status}
                                </TableCell>
                                <TableCell>{tenant.phoneNumber || "-"}</TableCell>
                                <TableCell>{format(tenant.createdAt, "PPP")}</TableCell>
                            </TableRow>
                        ))}
                        {allTenants.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No tenants found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
