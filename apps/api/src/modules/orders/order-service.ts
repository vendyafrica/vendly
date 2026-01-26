import { orderRepository } from "./order-repository";
import type { CreateOrderInput, UpdateOrderStatusInput, OrderFilters, OrderWithItems, OrderStats } from "./order-models";
import { whatsAppService } from "../whatsapp/whatsapp-service";

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

        const updatedOrder = await orderRepository.updateOrderStatus(orderId, tenantId, input);

        // --- WhatsApp Notifications Integration ---
        if (order.customerPhone) {
            try {
                if (input.status === 'PREPARING') {
                    await whatsAppService.sendOrderStatusUpdate(order.customerPhone, order.orderNumber, "Your order is being prepared! 🍳");
                }
                else if (input.status === 'READY_FOR_PICKUP') {
                    await whatsAppService.sendOrderStatusUpdate(order.customerPhone, order.orderNumber, "Your order is ready for pickup! 🛍️");
                }
                else if (input.status === 'OUT_FOR_DELIVERY') {
                    await whatsAppService.sendOrderStatusUpdate(order.customerPhone, order.orderNumber, "Your order is out for delivery! 🛵");
                }
                else if (input.status === 'DELIVERED') {
                    await whatsAppService.sendOrderDelivered(order.customerPhone, order.orderNumber);
                }
                else if (input.status === 'cancelled') {
                    // Logic to see who cancelled? For now just notify customer it's cancelled
                    await whatsAppService.sendOrderStatusUpdate(order.customerPhone, order.orderNumber, "Your order was cancelled.");

                    // Also notify seller if they exist
                    if (order.storeId) {
                        const store = await orderRepository.findStoreById(order.storeId);
                        if (store?.storeContactPhone) {
                            await whatsAppService.sendMerchantCancellation(store.storeContactPhone, order.orderNumber);
                        }
                    }
                }
            } catch (error) {
                console.error(`Failed to send WhatsApp status update for order ${orderId}:`, error);
            }
        }

        return updatedOrder;
    }

    /**
     * Get order statistics
     */
    async getOrderStats(tenantId: string): Promise<OrderStats> {
        return orderRepository.getOrderStats(tenantId);
    }

    /**
     * Handle Payment Success Event
     * Triggers WhatsApp notifications to Customer and Seller
     */
    async notifyPaymentSuccess(orderId: string, tenantId: string) {
        const order = await orderRepository.findOrderById(orderId, tenantId);
        if (!order) {
            console.error(`Order ${orderId} not found for payment notification`);
            return;
        }

        // 1. Notify Customer (Order Confirmed)
        if (order.customerPhone) {
            try {
                await whatsAppService.sendOrderConfirmation(order.customerPhone, {
                    orderId: order.orderNumber,
                    total: order.totalAmount.toString(),
                    currency: order.currency
                });
            } catch (error) {
                console.error("Failed to send customer confirmation:", error);
            }
        }

        // 2. Notify Seller (New Order Alert)
        if (order.storeId) {
            const store = await orderRepository.findStoreById(order.storeId);
            const sellerPhone = store?.storeContactPhone;

            if (sellerPhone) {
                try {
                    // Generate item summary logic
                    const itemSummary = order.items
                        .map(i => `${i.quantity}x ${i.productName}`)
                        .join(", ");

                    await whatsAppService.sendNewOrderAlert(sellerPhone, {
                        orderId: order.id, // Use UUID for callback payload integrity, but orderNumber for display? Template uses {{1}} for orderId
                        items: itemSummary.substring(0, 60) + (itemSummary.length > 60 ? "..." : ""),
                        total: `${order.currency} ${order.totalAmount}`
                    });
                } catch (error) {
                    console.error("Failed to send seller alert:", error);
                }
            } else {
                console.warn(`No contact phone found for store ${order.storeId}`);
            }
        }
    }
}

export const orderService = new OrderService();
