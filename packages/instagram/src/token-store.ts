import { TokenData } from './types';

export class TokenStore {
  private tokens: Map<string, TokenData>;

  constructor() {
    this.tokens = new Map<string, TokenData>();
  }

  save(userId: string, tokenData: TokenData): void {
    this.tokens.set(userId, tokenData);
    console.log(`💾 Token saved for user: ${userId}`);
  }

  get(userId: string): TokenData | undefined {
    return this.tokens.get(userId);
  }

  has(userId: string): boolean {
    return this.tokens.has(userId);
  }

  isExpired(userId: string): boolean {
    const tokenData = this.get(userId);
    if (!tokenData) return true;

    const tokenAge = Date.now() - tokenData.obtainedAt;
    return tokenAge > tokenData.expiresIn * 1000;
  }

  get size(): number {
    return this.tokens.size;
  }

  getAllUserIds(): string[] {
    return Array.from(this.tokens.keys());
  }
}