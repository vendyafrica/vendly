export type NormalizePhoneOptions = {
  defaultCountryCallingCode?: string; // e.g. "254"
};

export function normalizePhoneToE164(input: string, opts: NormalizePhoneOptions = {}): string | null {
  const defaultCode = opts.defaultCountryCallingCode || "256";

  let v = input.trim();
  if (!v) return null;

  // remove spaces, dashes, parentheses
  v = v.replace(/[\s\-()]/g, "");

  // Already E.164-ish
  if (v.startsWith("+")) {
    const digits = v.slice(1).replace(/\D/g, "");
    if (!digits) return null;
    return `+${digits}`;
  }

  // 07xxxxxxxx (Kenya local)
  if (/^0\d{9}$/.test(v)) {
    return `+${defaultCode}${v.slice(1)}`;
  }

  // 7xxxxxxxx (missing leading 0)
  if (/^7\d{8}$/.test(v)) {
    return `+${defaultCode}${v}`;
  }

  // 2547xxxxxxxx (no plus)
  if (new RegExp(`^${defaultCode}\\d+$`).test(v)) {
    return `+${v}`;
  }

  // Fallback: keep digits and prepend '+' if it looks like an international number
  const digits = v.replace(/\D/g, "");
  if (digits.length >= 10) {
    return `+${digits}`;
  }

  return null;
}
