import { BACKEND_URL } from "../../../config";

const API_URL = BACKEND_URL;

interface JoinWaitlistData {
  storeName: string;
  email?: string;
}

export async function joinWaitlist(data: JoinWaitlistData): Promise<{
  message: string;
  data: any;
}> {
  const response = await fetch(`${API_URL}/api/waitlist/join`, {
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