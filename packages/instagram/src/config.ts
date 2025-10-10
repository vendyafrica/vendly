export class InstagramConfig {
  public readonly clientId: string;
  public readonly clientSecret: string;
  public readonly redirectUri: string;
  public readonly apiVersion: string = "v21.0"
  public readonly graphApiBase: string;
  public readonly tokenApiBase: string = "https://graph.instagram.com";

  constructor() {
    this.clientId = process.env.INSTAGRAM_CLIENT_ID!;
    this.clientSecret = process.env.INSTAGRAM_CLIENT_SECRET!;
    this.redirectUri = process.env.INSTAGRAM_REDIRECT_URI!;
    this.graphApiBase = `https://graph.instagram.com/${this.apiVersion}`;
  }

  validate(): { valid: boolean; error?: string } {
    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      return {
        valid: false,
        error: "INSTAGRAM_CLIENT_ID, INSTAGRAM_CLIENT_SECRET, and INSTAGRAM_REDIRECT_URI must all be set in .env file"
      };
    }
    return { valid: true };
  }

  getScopes(): string[] {
    return [
      "instagram_business_basic",
      "instagram_business_content_publish",
      "instagram_business_manage_messages",
      "instagram_business_manage_comments",
      "instagram_business_manage_insights",
    ];
  }
}