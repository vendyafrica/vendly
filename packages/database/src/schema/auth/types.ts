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

export interface signIn{
    email: string;
    password: string;
}

export interface signUp{
    email: string;
    password: string;
    name: string;
    image?: string;
}