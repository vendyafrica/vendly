import { pgEnum } from 'drizzle-orm/pg-core';


export const roleEnum = pgEnum('role', ['seller', 'buyer', 'admin']);
export const storeStatusEnum = pgEnum('store_status', [
  'draft',
  'under_ai_review',
  'building',
  'live',
  'archived',
]);
export const aiRequestStatusEnum = pgEnum('ai_request_status', [
  'pending',
  'processing',
  'completed',
  'failed',
]);
export const paymentMethodEnum = pgEnum('payment_method', [
  'mpesa',
  'card',
  'bank_transfer',
]);
export const deliveryMethodEnum = pgEnum('delivery_method', [
  'courier',
  'self_delivery',
]);
export const mediaTypeEnum = pgEnum('media_type', ['image', 'video', 'carousel']);
export const productStatusEnum = pgEnum('product_status', [
  'draft',
  'published',
  'archived',
]);