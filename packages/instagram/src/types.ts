export interface TokenData {
  accessToken: string;      // The actual token (like a password)
  tokenType: string;        // Usually "bearer"
  expiresIn: number;        // How many seconds until token expires
  userId: string;           // Instagram user's unique ID
  permissions: string[];    // What permissions user granted
  obtainedAt: number;       // When we got this token (timestamp)
}

export interface ShortLivedTokenResponse {
  accessToken: string;
  userId: string;
  permissions: string[];
}

export interface LongLivedTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface InstagramProfile {
  id: string;
  username: string;
  name: string;
  account_type: string;
  media_count: number;
  followers_count: number;
  follows_count: number;
  profile_picture_url: string;
  biography: string;
  website: string;
}