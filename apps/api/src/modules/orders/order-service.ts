import { orderRepository } from "./order-repository";
import type { CreateOrderInput, UpdateOrderStatusInput, OrderFilters, OrderWithItems, OrderStats } from "./order-models";

class OrderService {
    /**
     * Create a new order from storefront
     */
    async createOrder(
        storeSlug: string,
        input: CreateOrderInput
    ): Promise<OrderWithItems> {
        // Find store by slug
        const store = await orderRepository.findStoreBySlug(storeSlug);
        if (!store) {
            throw new Error("Store not found");
        }

        // Get product details
        const productIds = input.items.map((item) => item.productId);
        const productList = await orderRepository.getProductsForOrder(productIds);

        if (productList.length !== productIds.length) {
            throw new Error("One or more products not found");
        }

        // Build product map for quick lookup
        const productMap = new Map(productList.map((p) => [p.id, p]));

        // Calculate order totals and build items
        let subtotal = 0;
        const currency = productList[0]?.currency || "KES";

        const orderItems = input.items.map((item) => {
            const product = productMap.get(item.productId);
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }

            const totalPrice = product.priceAmount * item.quantity;
            subtotal += totalPrice;

            // Get product image
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

        // Generate order number
        const orderNumber = await orderRepository.getNextOrderNumber(store.id);

        // Calculate totals
        const shippingCost = 0; // TODO: Implement shipping calculation
        const totalAmount = subtotal + shippingCost;

        // Create order
        const order = await orderRepository.createOrder(
            store.tenantId,
            store.id,
            {
                orderNumber,
                customerName: input.customerName,
                customerEmail: input.customerEmail,
                customerPhone: input.customerPhone,
                paymentMethod: input.paymentMethod,
                shippingAddress: input.shippingAddress,
                notes: input.notes,
                subtotal,
                shippingCost,
                totalAmount,
                currency,
            },
            orderItems
        );

        // Fetch complete order with items
        const completeOrder = await orderRepository.findOrderById(order.id, store.tenantId);
        if (!completeOrder) {
            throw new Error("Failed to create order");
        }

        return completeOrder;
    }

    /**
     * Get order by ID
     */
    async getOrder(orderId: string, tenantId: string): Promise<OrderWithItems | null> {
        return orderRepository.findOrderById(orderId, tenantId);
    }

    /**
     * List orders for a tenant
     */
    async listOrders(
        tenantId: string,
        filters: OrderFilters
    ): Promise<{ orders: OrderWithItems[]; total: number; page: number; limit: number }> {
        const result = await orderRepository.findOrdersByStore(tenantId, filters);
        return {
            ...result,
            page: filters.page,
            limit: filters.limit,
        };
    }

    /**
     * Update order status
     */
    async updateOrderStatus(
        orderId: string,
        tenantId: string,
        input: UpdateOrderStatusInput
    ) {
        const order = await orderRepository.findOrderById(orderId, tenantId);
        if (!order) {
            throw new Error("Order not found");
        }

        return orderRepository.updateOrderStatus(orderId, tenantId, input);
    }

    /**
     * Get order statistics
     */
    async getOrderStats(tenantId: string): Promise<OrderStats> {
        return orderRepository.getOrderStats(tenantId);
    }
}

export const orderService = new OrderService();
