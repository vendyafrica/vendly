
import { UserRole } from '../enums';

export interface RegisterRequest {
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
  whatsappEnabled?: boolean;
}

export interface LoginRequest {
  emailOrPhone: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    phoneNumber: string;
    role: UserRole;
  };
}