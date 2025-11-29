export interface CreateWaitlistInput {
  storeName: string;
  email?: string;
}

export interface WaitlistResponse {
  message: string;
  data: any;
}