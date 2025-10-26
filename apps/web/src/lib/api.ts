const API_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function joinWaitlist(data: {
  email: string;
  phone: string;
  storeName: string;
}) {
  const response = await fetch(`${API_URL}/api/waitlist/join-waitlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to join waitlist");
  }

  return result;
}