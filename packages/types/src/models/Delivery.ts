import { DeliveryStatus } from '../enums';

export interface Courier {
  id: string;
  
  // Courier Info
  name: string;
  phoneNumber: string;
  email: string | null;
  
  // Courier Service
  serviceName: string;
  vehicleType: string | null;
  vehicleRegistration: string | null;
  
  // Location
  currentLatitude: number | null;
  currentLongitude: number | null;
  lastLocationUpdate: Date | null;
  
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Delivery {
  id: string;
  orderId: string;
  courierId: string | null;
  
  // Pickup Info
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  pickupPhone: string;
  
  // Delivery Info
  deliveryAddressId: string;
  
  // Status
  status: DeliveryStatus;
  
  // Timestamps
  courierAssignedAt: Date | null;
  pickedUpAt: Date | null;
  deliveredAt: Date | null;
  failedAt: Date | null;
  
  // Tracking
  trackingNumber: string;
  trackingUrl: string | null;
  estimatedDelivery: Date | null;
  
  // Pricing
  deliveryFee: number;
  
  // Notes
  deliveryNotes: string | null;
  failureReason: string | null;
  
  createdAt: Date;
  updatedAt: Date;
}