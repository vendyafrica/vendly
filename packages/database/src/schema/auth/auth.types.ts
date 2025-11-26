export interface Session{
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
}