import { CreateWaitlistInput } from "./types";

export function validateWaitlistInput(data: any): CreateWaitlistInput {
  if (!data.storeName || typeof data.storeName !== "string") {
    throw new Error("storeName is required and must be a string");
  }

  if (data.storeName.trim().length < 2) {
    throw new Error("storeName must be at least 2 characters");
  }

  return {
    storeName: data.storeName.trim(),
    email: data.email?.trim(),
  };
}