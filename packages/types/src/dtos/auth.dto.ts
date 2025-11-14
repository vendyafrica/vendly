
import { UserRole } from "../enums/index";

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  image?: string;
  callbackURL?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  emailVerified: boolean;
  profileImage?: string;
  phoneNumber?: string;
  role: UserRole;
  whatsappEnabled: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: AuthUser;
  session: {
    id: string;
    expiresAt: Date;
    token: string;
  };
}

export interface LoginResponse {
  user: AuthUser;
  session: {
    id: string;
    token: string;
  };
}
