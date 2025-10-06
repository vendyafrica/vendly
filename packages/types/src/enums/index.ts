export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin',
  COURIER = 'courier',
}

export enum SellerTier {
  FREE = 'free',
  PRO = 'pro',
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  HELD_IN_ESCROW = 'held_in_escrow',
  PAID_OUT = 'paid_out',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  MPESA = 'mpesa',
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
}

export enum DeliveryStatus {
  PENDING = 'pending',
  COURIER_ASSIGNED = 'courier_assigned',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

export enum NotificationType {
  ORDER_UPDATE = 'order_update',
  PROMOTION = 'promotion',
  NEW_FOLLOWER = 'new_follower',
  PRODUCT_BACK_IN_STOCK = 'product_back_in_stock',
  NEW_REVIEW = 'new_review',
}

export enum InteractionType {
  VIEW = 'view',
  LIKE = 'like',
  ADD_TO_CART = 'add_to_cart',
  PURCHASE = 'purchase',
  FOLLOW = 'follow',
}

export enum TransactionType {
  CHARGE = 'charge',
  REFUND = 'refund',
  PAYOUT = 'payout',
}