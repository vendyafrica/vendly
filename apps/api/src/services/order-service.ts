import { db, dbWs, and, eq, inArray, isNull, sql } from "@vendly/db";
import { orders, orderItems, products, stores, tenants } from "@vendly/db";
import { normalizePhoneToE164 } from "../utils/phone";
import { z } from "zod";

type ProductWithMedia = (typeof products.$inferSelect) & {
  media?: Array<{ media?: { blobUrl?: string | null } | null; sortOrder?: number | null } | null>;
};

export const orderItemInputSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
});

export type OrderItemInput = z.infer<typeof orderItemInputSchema>;

export const createOrderSchema = z.object({
  customerName: z.string().min(1).max(255),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  paymentMethod: z.enum(["card", "mpesa", "paypal", "cash_on_delivery"]).default("cash_on_delivery"),
  shippingAddress: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  notes: z.string().optional(),
  items: z.array(orderItemInputSchema).min(1),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "completed", "cancelled", "refunded"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

export type OrderWithItems = Awaited<ReturnType<typeof orderService.getOrderById>>;

export const orderService = {
  async createOrder(storeSlug: string, input: CreateOrderInput) {
    const store = await db.query.stores.findFirst({
      where: and(eq(stores.slug, storeSlug), isNull(stores.deletedAt)),
    });

    if (!store) {
      throw new Error("Store not found");
    }

    const productIds = input.items.map((i) => i.productId);
    const productList = await db.query.products.findMany({
      where: and(inArray(products.id, productIds), isNull(products.deletedAt)),
      with: {
        media: {
          with: { media: true },
          orderBy: (media, { asc }) => [asc(media.sortOrder)],
          limit: 1,
        },
      },
    });

    if (productList.length !== productIds.length) {
      throw new Error("One or more products not found");
    }

    const productMap = new Map(productList.map((p) => [p.id, p as unknown as ProductWithMedia]));

    let subtotal = 0;
    const currency = productList[0]?.currency || "KES";

    const orderItemsData = input.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const totalPrice = product.priceAmount * item.quantity;
      subtotal += totalPrice;

      const productImage = product.media?.[0]?.media?.blobUrl || undefined;

      return {
        productId: product.id,
        productName: product.productName,
        productImage,
        quantity: item.quantity,
        unitPrice: product.priceAmount,
        totalPrice,
        currency: product.currency,
      };
    });

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders)
      .where(eq(orders.storeId, store.id));

    const orderNumber = `ORD-${((countResult?.count || 0) + 1).toString().padStart(4, "0")}`;

    const shippingCost = 0;
    const totalAmount = subtotal + shippingCost;

    const order = await dbWs.transaction(async (tx) => {
      const [newOrder] = await tx
        .insert(orders)
        .values({
          tenantId: store.tenantId,
          storeId: store.id,
          orderNumber,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          paymentMethod: input.paymentMethod,
          paymentStatus: "paid",
          status: "processing",
          shippingAddress: input.shippingAddress,
          notes: input.notes,
          subtotal,
          shippingCost,
          totalAmount,
          currency,
        })
        .returning();

      await tx.insert(orderItems).values(
        orderItemsData.map((i) => ({
          tenantId: store.tenantId,
          orderId: newOrder.id,
          ...i,
        }))
      );

      return newOrder;
    });

    const completeOrder = await db.query.orders.findFirst({
      where: eq(orders.id, order.id),
      with: { items: true, store: true },
    });

    if (!completeOrder) {
      throw new Error("Failed to create order");
    }

    return completeOrder;
  },

  async getOrderById(orderId: string) {
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), isNull(orders.deletedAt)),
      with: { items: true, store: true },
    });
    return order;
  },

  async listOrdersForTenant(tenantId: string) {
    const list = await db.query.orders.findMany({
      where: and(eq(orders.tenantId, tenantId), isNull(orders.deletedAt)),
      with: { items: true, store: true },
      orderBy: (o, { desc }) => [desc(o.createdAt)],
    });
    return list;
  },

  async updateOrderStatus(orderId: string, tenantId: string, input: UpdateOrderStatusInput) {
    const existing = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.tenantId, tenantId), isNull(orders.deletedAt)),
    });

    if (!existing) {
      throw new Error("Order not found");
    }

    const [updated] = await db
      .update(orders)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId), isNull(orders.deletedAt)))
      .returning();

    return updated;
  },

  async getTenantPhoneByStoreSlug(storeSlug: string) {
    const store = await db.query.stores.findFirst({
      where: and(eq(stores.slug, storeSlug), isNull(stores.deletedAt)),
      columns: { tenantId: true },
    });

    if (!store) {
      throw new Error("Store not found");
    }

    const tenant = await db.query.tenants.findFirst({
      where: and(eq(tenants.id, store.tenantId), isNull(tenants.deletedAt)),
      columns: { phoneNumber: true },
    });

    return tenant?.phoneNumber || null;
  },

  async getTenantPhoneByTenantId(tenantId: string) {
    const tenant = await db.query.tenants.findFirst({
      where: and(eq(tenants.id, tenantId), isNull(tenants.deletedAt)),
      columns: { phoneNumber: true },
    });

    return tenant?.phoneNumber || null;
  },

  async getTenantIdByPhoneNumber(phoneNumber: string) {
    const variants = new Set<string>();
    const trimmed = phoneNumber.trim();
    if (trimmed) variants.add(trimmed);

    const normalized = normalizePhoneToE164(trimmed, {
      defaultCountryCallingCode: process.env.DEFAULT_COUNTRY_CALLING_CODE || "254",
    });
    if (normalized) variants.add(normalized);

    // Sometimes WhatsApp "from" arrives without '+'
    if (normalized?.startsWith("+")) variants.add(normalized.slice(1));

    const list = Array.from(variants);
    if (!list.length) return null;

    const tenant = await db.query.tenants.findFirst({
      where: and(inArray(tenants.phoneNumber, list), isNull(tenants.deletedAt)),
      columns: { id: true },
    });

    return tenant?.id || null;
  },

  async getOrderByOrderNumberForTenant(tenantId: string, orderNumber: string) {
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.tenantId, tenantId), eq(orders.orderNumber, orderNumber), isNull(orders.deletedAt)),
      with: { items: true, store: true },
    });
    return order;
  },

  async getLatestOrderForTenantByStatus(tenantId: string, statuses: Array<"pending" | "processing" | "completed" | "cancelled" | "refunded">) {
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.tenantId, tenantId), inArray(orders.status, statuses), isNull(orders.deletedAt)),
      orderBy: (o, { desc }) => [desc(o.createdAt)],
      with: { items: true, store: true },
    });

    return order;
  },
};
