import { DeliveryStatus, Currency } from '../enums';

export type DeliveryProvider = 'sendy';

export type DeliveryQuoteService = 'motorbike';

export interface SendyQuoteRequest {
  pickupAddress: string;
  dropoffAddress: string;
  city: string;
}

export interface SendyQuoteResponse {
  service: DeliveryQuoteService;
  price: number;
  etaMins: number;
  currency: Currency;
  quoteId?: string;
  meta?: Record<string, any>;
}

export interface RecipientInfo {
  name: string;
  phone: string;
  notes?: string;
}

export interface SendyBookRequest {
  orderId: string;
  quoteId?: string;
  pickupAddress: string;
  dropoffAddress: string;
  recipient: RecipientInfo;
}

export interface SendyBookResponse {
  deliveryId: string;
  status: DeliveryStatus;
  trackingUrl?: string;
}

export type SendyEventType =
  | 'courier_assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'failed';

export interface SendyWebhookPayload {
  provider: DeliveryProvider;
  event: SendyEventType;
  deliveryId: string;
  orderId?: string;
  timestamp: string; // ISO8601
  raw?: any;
  mappedStatus?: DeliveryStatus;
}