import { WaitlistDto } from "@vendly/types";
import { CLIENT_CONFIG } from "@vendly/typescript-config";

const API_URL = CLIENT_CONFIG.BACKEND_URL;

export async function joinWaitlist(data: WaitlistDto): Promise<{
  message: string;
  data: any;
}> {
  const response = await fetch(`${API_URL}/api/waitlist/join-waitlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || result.error || "Failed to join waitlist");
  }
  return result;
}