import { PaymentStatus, PaymentMethod, TransactionType } from '../enums';

export interface Transaction {
  id: string;
  orderId: string;
  
  transactionType: TransactionType;
  
  amount: number;
  currency: string;
  
  paymentMethod: PaymentMethod;
  paymentGateway: string;
  gatewayTransactionId: string | null;
  
  status: PaymentStatus;
  
  // Escrow & Payout
  heldUntil: Date | null;
  paidOutAt: Date | null;
  payoutBatchId: string | null;
  
  // Metadata
  metadata: Record<string, any> | null;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PayoutBatch {
  id: string;
  
  payoutDate: Date;
  totalAmount: number;
  totalOrders: number;
  
  status: string;
  
  createdAt: Date;
  completedAt: Date | null;
}