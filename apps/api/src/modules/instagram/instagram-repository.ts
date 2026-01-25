import { db } from "@vendly/db/db";
import {
    instagramConnections,
    instagramSyncJobs,
    type InstagramConnection,
    type NewInstagramConnection,
    type InstagramSyncJob,
    type NewInstagramSyncJob,
} from "@vendly/db/schema";
import { eq, and, desc } from "drizzle-orm";

export class InstagramConnectionRepository {
    /**
     * Create Instagram connection
     */
    async createConnection(
        connection: NewInstagramConnection
    ): Promise<InstagramConnection> {
        const [created] = await db
            .insert(instagramConnections)
            .values(connection)
            .returning();
        return created;
    }

    /**
     * Get connection by tenant
     */
    async getConnectionByTenant(
        tenantId: string
    ): Promise<InstagramConnection | null> {
        const [connection] = await db
            .select()
            .from(instagramConnections)
            .where(
                and(
                    eq(instagramConnections.tenantId, tenantId),
                    eq(instagramConnections.isActive, true)
                )
            )
            .limit(1);

        return connection || null;
    }

    /**
     * Get connection by ID
     */
    async getConnectionById(
        connectionId: string,
        tenantId: string
    ): Promise<InstagramConnection | null> {
        const [connection] = await db
            .select()
            .from(instagramConnections)
            .where(
                and(
                    eq(instagramConnections.id, connectionId),
                    eq(instagramConnections.tenantId, tenantId)
                )
            )
            .limit(1);

        return connection || null;
    }

    /**
     * Update sync timestamp
     */
    async updateSyncTimestamp(connectionId: string): Promise<void> {
        await db
            .update(instagramConnections)
            .set({
                lastSyncedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(instagramConnections.id, connectionId));
    }

    /**
     * Delete connection (deactivate)
     */
    async deleteConnection(
        connectionId: string,
        tenantId: string
    ): Promise<boolean> {
        const [deleted] = await db
            .update(instagramConnections)
            .set({ isActive: false, updatedAt: new Date() })
            .where(
                and(
                    eq(instagramConnections.id, connectionId),
                    eq(instagramConnections.tenantId, tenantId)
                )
            )
            .returning();

        return !!deleted;
    }

    /**
     * Create sync job
     */
    async createSyncJob(job: NewInstagramSyncJob): Promise<InstagramSyncJob> {
        const [created] = await db
            .insert(instagramSyncJobs)
            .values(job)
            .returning();
        return created;
    }

    /**
     * Update sync job
     */
    async updateSyncJob(
        jobId: string,
        data: Partial<NewInstagramSyncJob>
    ): Promise<InstagramSyncJob | null> {
        const [updated] = await db
            .update(instagramSyncJobs)
            .set(data)
            .where(eq(instagramSyncJobs.id, jobId))
            .returning();

        return updated || null;
    }

    /**
     * Get sync job by ID
     */
    async getSyncJobById(
        jobId: string,
        tenantId: string
    ): Promise<InstagramSyncJob | null> {
        const [job] = await db
            .select()
            .from(instagramSyncJobs)
            .where(
                and(
                    eq(instagramSyncJobs.id, jobId),
                    eq(instagramSyncJobs.tenantId, tenantId)
                )
            )
            .limit(1);

        return job || null;
    }

    /**
     * Get sync history for tenant
     */
    async getSyncHistory(
        tenantId: string,
        limit: number = 10
    ): Promise<InstagramSyncJob[]> {
        const jobs = await db
            .select()
            .from(instagramSyncJobs)
            .where(eq(instagramSyncJobs.tenantId, tenantId))
            .orderBy(desc(instagramSyncJobs.createdAt))
            .limit(limit);

        return jobs;
    }
}

export const instagramConnectionRepository =
    new InstagramConnectionRepository();
