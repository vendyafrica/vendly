import { UserRole } from '../enums';

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  whatsappEnabled: boolean;

  // Auth
  passwordHash: string;
  authProviders?: ('google' | 'apple' | 'email_otp' | 'phone_otp')[];
  googleId?: string;
  appleId?: string;
  emailOTPEnabled?: boolean;
  phoneOTPEnabled?: boolean;

  // Roles & status
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
}