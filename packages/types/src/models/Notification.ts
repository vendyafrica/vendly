import { NotificationType } from '../enums';

export interface Notification {
  id: string;
  userId: string;
  
  notificationType: NotificationType;
  title: string;
  message: string;
  
  // Related Entities
  relatedOrderId: string | null;
  relatedStoreId: string | null;
  relatedProductId: string | null;
  
  // Channels
  sentPush: boolean;
  sentEmail: boolean;
  sentSms: boolean;
  
  isRead: boolean;
  
  createdAt: Date;
  readAt: Date | null;
}
