interface Entitlements {
  maxMessagesPerDay: number
}

// For anonymous users (no auth)
export const anonymousEntitlements: Entitlements = {
  maxMessagesPerDay: 3,
}
