type Preference = "constant" | "once";

function nowMs() {
  return Date.now();
}

class ExpiringMap<V> {
  private store = new Map<string, { value: V; expiresAt: number }>();

  set(key: string, value: V, ttlMs: number) {
    this.store.set(key, { value, expiresAt: nowMs() + ttlMs });
  }

  get(key: string): V | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= nowMs()) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }
}

// Buyer preference: apply per phone for 24h
const buyerPref = new ExpiringMap<Preference>();

// Seller opener: track per tenant per day (24h TTL)
const sellerOpener = new ExpiringMap<boolean>();

export const buyerPreferenceStore = {
  setOnce(phone: string) {
    buyerPref.set(phone, "once", 24 * 60 * 60 * 1000);
  },
  setConstant(phone: string) {
    buyerPref.set(phone, "constant", 24 * 60 * 60 * 1000);
  },
  isOnce(phone?: string | null): boolean {
    if (!phone) return false;
    return buyerPref.get(phone) === "once";
  },
};

export const sellerOpenerStore = {
  shouldSend(tenantId: string, phone: string): boolean {
    const dayKey = `${tenantId}:${phone}:${new Date().toISOString().slice(0, 10)}`;
    const exists = sellerOpener.get(dayKey);
    if (exists) return false;
    sellerOpener.set(dayKey, true, 24 * 60 * 60 * 1000);
    return true;
  },
};
