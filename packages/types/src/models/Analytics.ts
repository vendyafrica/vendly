import { InteractionType } from '../enums';

export interface BuyerInteraction {
  id: string;
  buyerId: string;
  
  interactionType: InteractionType;
  
  // Related Entities
  productId: string | null;
  storeId: string | null;
  category: string | null;
  tags: string[];
  
  createdAt: Date;
}

export interface StoreAnalytics {
  id: string;
  storeId: string;
  
  date: Date;
  
  // Traffic
  totalViews: number;
  uniqueVisitors: number;
  
  // Engagement
  newFollowers: number;
  productLikes: number;
  
  // Sales
  totalOrders: number;
  totalRevenue: number;
  totalItemsSold: number;
  
  // Average metrics
  averageOrderValue: number;
  conversionRate: number;
  
  createdAt: Date;
}