import { createStoreWaitlist } from "@vendly/database";
import { CreateWaitlistInput, WaitlistResponse } from "./types";

export async function joinWaitlistService(
    input: CreateWaitlistInput
): Promise<WaitlistResponse> {
    const result = await createStoreWaitlist({
        storeName: input.storeName,
    });

    return {
        message: "User joined waitlist successfully",
        data: result,
    };
}

export async function getWaitlistService() {
    // Future: fetch all waitlist entries
}