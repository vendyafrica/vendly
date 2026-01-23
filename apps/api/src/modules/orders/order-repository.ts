import { db } from "@vendly/db/db";
import { orders, orderItems, products, productMedia, mediaObjects, stores } from "@vendly/db/schema";
import { eq, and, isNull, desc, sql, like, or, inArray } from "drizzle-orm";
import type { OrderFilters, OrderWithItems, OrderStats } from "./order-models";

class OrderRepository {
    /**
     * Create a new order with items
     */
    async createOrder(
        tenantId: string,
        storeId: string,
        orderData: {
            orderNumber: string;
            customerName: string;
            customerEmail: string;
            customerPhone?: string;
            paymentMethod: string;
            shippingAddress?: {
                street?: string;
                city?: string;
                state?: string;
                postalCode?: string;
                country?: string;
            };
            notes?: string;
            subtotal: number;
            shippingCost: number;
            totalAmount: number;
            currency: string;
        },
        items: Array<{
            productId: string;
            productName: string;
            productImage?: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
            currency: string;
        }>
    ) {
        return db.transaction(async (tx) => {
            // Create order
            const [order] = await tx
                .insert(orders)
                .values({
                    tenantId,
                    storeId,
                    ...orderData,
                })
                .returning();

            // Create order items
            const orderItemsData = items.map((item) => ({
                tenantId,
                orderId: order.id,
                productId: item.productId,
                productName: item.productName,
                productImage: item.productImage,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                currency: item.currency,
            }));

            await tx.insert(orderItems).values(orderItemsData);

            return order;
        });
    }

    /**
     * Find order by ID with items
     */
    async findOrderById(orderId: string, tenantId: string): Promise<OrderWithItems | null> {
        const order = await db.query.orders.findFirst({
            where: and(
                eq(orders.id, orderId),
                eq(orders.tenantId, tenantId),
                isNull(orders.deletedAt)
            ),
            with: {
                items: true,
            },
        });

        return order as OrderWithItems | null;
    }

    /**
     * Find orders for a store with pagination
     */
    async findOrdersByStore(
        tenantId: string,
        filters: OrderFilters
    ): Promise<{ orders: OrderWithItems[]; total: number }> {
        const { status, paymentStatus, page, limit, search } = filters;
        const offset = (page - 1) * limit;

        // Build where conditions
        const conditions = [
            eq(orders.tenantId, tenantId),
            isNull(orders.deletedAt),
        ];

        if (status) {
            conditions.push(eq(orders.status, status));
        }

        if (paymentStatus) {
            conditions.push(eq(orders.paymentStatus, paymentStatus));
        }

        if (search) {
            conditions.push(
                or(
                    like(orders.orderNumber, `%${search}%`),
                    like(orders.customerName, `%${search}%`),
                    like(orders.customerEmail, `%${search}%`)
                )!
            );
        }

        const whereClause = and(...conditions);

        // Get orders with items
        const orderList = await db.query.orders.findMany({
            where: whereClause,
            with: {
                items: true,
            },
            orderBy: [desc(orders.createdAt)],
            limit,
            offset,
        });

        // Get total count
        const [{ count }] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(orders)
            .where(whereClause);

        return {
            orders: orderList as OrderWithItems[],
            total: count,
        };
    }

    /**
     * Update order status
     */
    async updateOrderStatus(
        orderId: string,
        tenantId: string,
        updates: { status?: string; paymentStatus?: string }
    ) {
        const [updated] = await db
            .update(orders)
            .set({
                ...updates,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(orders.id, orderId),
                    eq(orders.tenantId, tenantId),
                    isNull(orders.deletedAt)
                )
            )
            .returning();

        return updated;
    }

    /**
     * Get order statistics for a store
     */
    async getOrderStats(tenantId: string): Promise<OrderStats> {
        // Get total revenue (completed/paid orders)
        const [revenueResult] = await db
            .select({
                total: sql<number>`COALESCE(SUM(total_amount), 0)::int`,
                count: sql<number>`count(*)::int`,
            })
            .from(orders)
            .where(
                and(
                    eq(orders.tenantId, tenantId),
                    eq(orders.paymentStatus, "paid"),
                    isNull(orders.deletedAt)
                )
            );

        // Get pending orders count
        const [pendingResult] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(orders)
            .where(
                and(
                    eq(orders.tenantId, tenantId),
                    eq(orders.status, "pending"),
                    isNull(orders.deletedAt)
                )
            );

        // Get refunded amount
        const [refundedResult] = await db
            .select({
                total: sql<number>`COALESCE(SUM(total_amount), 0)::int`,
            })
            .from(orders)
            .where(
                and(
                    eq(orders.tenantId, tenantId),
                    eq(orders.paymentStatus, "refunded"),
                    isNull(orders.deletedAt)
                )
            );

        // Get total order count
        const [totalCountResult] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(orders)
            .where(
                and(
                    eq(orders.tenantId, tenantId),
                    isNull(orders.deletedAt)
                )
            );

        return {
            totalRevenue: revenueResult?.total || 0,
            revenueChange: "+0% from last month", // TODO: Calculate actual change
            orderCount: totalCountResult?.count || 0,
            countChange: "+0% from last month",
            pendingCount: pendingResult?.count || 0,
            pendingChange: "+0% from last month",
            refundedAmount: refundedResult?.total || 0,
            refundedChange: "+0% from last month",
            currency: "KES",
        };
    }

    /**
     * Get next order number for a store
     */
    async getNextOrderNumber(storeId: string): Promise<string> {
        const [result] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(orders)
            .where(eq(orders.storeId, storeId));

        const nextNumber = (result?.count || 0) + 1;
        return `ORD-${nextNumber.toString().padStart(4, "0")}`;
    }

    /**
     * Get product details for order items
     */
    async getProductsForOrder(productIds: string[]) {
        if (productIds.length === 0) {
            return [];
        }

        return db.query.products.findMany({
            where: and(
                inArray(products.id, productIds),
                isNull(products.deletedAt)
            ),
            with: {
                media: {
                    with: { media: true },
                    orderBy: (media, { asc }) => [asc(media.sortOrder)],
                    limit: 1,
                },
            },
        });
    }

    /**
     * Find store by slug
     */
    async findStoreBySlug(slug: string) {
        return db.query.stores.findFirst({
            where: and(eq(stores.slug, slug), isNull(stores.deletedAt)),
        });
    }
}

export const orderRepository = new OrderRepository();
