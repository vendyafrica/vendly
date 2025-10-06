import { UserRole } from '../enums';

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  whatsappEnabled: boolean;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
}