import { OrderStatus, PaymentStatus, DeliveryStatus, PaymentMethod } from '../enums';

export interface Order {
  id: string;
  orderNumber: string;
  
  buyerId: string;
  storeId: string;
  
  // Order Status
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  
  // Pricing
  subtotal: number;
  shippingFee: number;
  transactionFee: number;
  total: number;
  
  // Payment
  paymentMethod: PaymentMethod;
  paymentId: string | null;
  
  // Delivery
  deliveryAddressId: string;
  courierId: string | null;
  trackingNumber: string | null;
  estimatedDelivery: Date | null;
  
  // Timestamps
  createdAt: Date;
  confirmedAt: Date | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  cancelledAt: Date | null;
  
  // Notes
  buyerNote: string | null;
  cancellationReason: string | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  
  // Snapshot at time of order
  productName: string;
  variantName: string | null;
  quantity: number;
  price: number;
  total: number;
}