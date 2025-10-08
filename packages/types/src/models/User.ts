import { UserRole } from '../enums';

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  
  // Extended fields
  phoneNumber: string | null;
  whatsappEnabled: boolean;
  role: UserRole;
  isActive: boolean;
  phoneVerified: boolean;
  lastLogin: Date | null;

  createdAt: Date;
  updatedAt: Date;
}