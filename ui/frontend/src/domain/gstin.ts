/**
 * GSTIN format and check-digit validation. Offline only: it cannot say whether a business is registered.
 * State names are mapped only where verified on the GST portal's state code list.
 */

const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export const verifiedStateNames: Record<string, string> = {
  "24": "Gujarat",
  "26": "Dadra and Nagar Haveli and Daman and Diu",
  "27": "Maharashtra",
};

export type GstinCheck = "length" | "pattern" | "stateCode" | "checkDigit";

export type GstinReport = {
  normalised: string;
  valid: boolean;
  checks: Record<GstinCheck, boolean>;
  /** Only filled in when the GSTIN is valid. */
  decoded: { stateCode: string; stateName: string; pan: string; entityNumber: string } | null;
};

/** Mod-36 check character for the first 14 characters, or null if any character is outside 0-9A-Z. */
export function gstinCheckChar(first14: string): string | null {
  let sum = 0;
  for (let i = first14.length - 1, position = 0; i >= 0; i -= 1, position += 1) {
    const index = CHARS.indexOf(first14[i] ?? "");
    if (index < 0) return null;
    const d = (position % 2 === 0 ? 2 : 1) * index;
    sum += Math.floor(d / 36) + (d % 36);
  }
  return CHARS[(36 - (sum % 36)) % 36] ?? null;
}

function stateCodeOk(code: string): boolean {
  if (!/^\d{2}$/.test(code)) return false;
  const n = Number(code);
  return (n >= 1 && n <= 38) || n === 97 || n === 99;
}

/** Every state code a GSTIN may start with: 01 to 38, 97 and 99. */
export const stateCodes: string[] = [
  ...Array.from({ length: 38 }, (_, index) => String(index + 1).padStart(2, "0")),
  "97",
  "99",
];

export function stateLabel(code: string): string {
  return verifiedStateNames[code] ?? `State code ${code}`;
}

export function validateGstin(input: string): GstinReport {
  const normalised = input.trim().toUpperCase();
  const length = normalised.length === 15;
  const pattern = PATTERN.test(normalised);
  const stateCode = stateCodeOk(normalised.slice(0, 2));
  const expected = length ? gstinCheckChar(normalised.slice(0, 14)) : null;
  const checkDigit = expected !== null && expected === normalised[14];
  const valid = length && pattern && stateCode && checkDigit;
  const code = normalised.slice(0, 2);
  return {
    normalised,
    valid,
    checks: { length, pattern, stateCode, checkDigit },
    decoded: valid
      ? { stateCode: code, stateName: stateLabel(code), pan: normalised.slice(2, 12), entityNumber: normalised[12] ?? "" }
      : null,
  };
}
