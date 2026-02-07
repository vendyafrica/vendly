type DedupeEntry = {
  expiresAtMs: number;
};

const cache = new Map<string, DedupeEntry>();

function nowMs() {
  return Date.now();
}

function cleanup() {
  const now = nowMs();
  cache.forEach((entry, key) => {
    if (entry.expiresAtMs <= now) {
      cache.delete(key);
    }
  });
}

export function shouldSendNotificationOnce(params: { key: string; ttlMs?: number }): boolean {
  cleanup();
  const ttlMs = params.ttlMs ?? 10 * 60 * 1000;
  const now = nowMs();

  const existing = cache.get(params.key);
  if (existing && existing.expiresAtMs > now) {
    return false;
  }

  cache.set(params.key, { expiresAtMs: now + ttlMs });
  return true;
}
