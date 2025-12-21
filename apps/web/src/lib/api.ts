export type ApiRequestInit = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiFetch<T>(url: string, init: ApiRequestInit = {}): Promise<T> {
  // TODO: wire to real backend base URL and endpoints.
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const res = await fetch(url, {
    ...init,
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}
