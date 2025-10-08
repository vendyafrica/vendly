import { PaymentMethod } from '../enums';

export interface CreateOrderRequest {
  storeId: string;
  items: OrderItemRequest[];
  deliveryAddressId: string;
  paymentMethod: PaymentMethod;
  buyerNote?: string;
}

export interface OrderItemRequest {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  items: OrderItemResponse[];
  deliveryAddress: any;
  createdAt: Date;
}

export interface OrderItemResponse {
  id: string;
  productName: string;
  variantName?: string;
  quantity: number;
  price: number;
  total: number;
}